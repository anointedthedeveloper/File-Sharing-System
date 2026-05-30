import { supabase } from './supabase';

const STUN = [{ urls: 'stun:stun.l.google.com:19302' }];
const CHUNK_SIZE = 48 * 1024;

function waitForOpen(dc) {
  return new Promise((resolve, reject) => {
    if (dc.readyState === 'open') return resolve();
    const t = setTimeout(() => reject(new Error('Data channel timeout')), 30000);
    dc.onopen = () => {
      clearTimeout(t);
      resolve();
    };
    dc.onerror = () => {
      clearTimeout(t);
      reject(new Error('Data channel error'));
    };
  });
}

function waitBuffer(dc) {
  return new Promise((resolve) => {
    if (dc.bufferedAmount < CHUNK_SIZE * 4) return resolve();
    const check = () => {
      if (dc.bufferedAmount < CHUNK_SIZE * 2) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export class QuickShareSession {
  constructor({ roomCode, isHost, deviceName, onSignal, onFileProgress, onFileReceived, onPeerConnected, onError }) {
    this.onSignal = onSignal;
    this.roomCode = roomCode;
    this.isHost = isHost;
    this.deviceName = deviceName;
    this.onFileProgress = onFileProgress;
    this.onFileReceived = onFileReceived;
    this.onPeerConnected = onPeerConnected;
    this.onError = onError;

    this.pc = new RTCPeerConnection({ iceServers: STUN });
    this.channel = null;
    this.receiveBuffers = [];
    this.receiveMeta = null;
    this.channelSub = null;
    this.unsubscribed = false;

    this.pc.onicecandidate = (e) => {
      if (e.candidate) this.broadcast({ type: 'ice', candidate: e.candidate, from: deviceName });
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') onPeerConnected?.();
      if (['failed', 'disconnected', 'closed'].includes(this.pc.connectionState)) {
        onError?.(new Error(`Connection ${this.pc.connectionState}`));
      }
    };

    if (isHost) {
      this.channel = this.pc.createDataChannel('files', { ordered: true });
      this.setupDataChannel(this.channel);
    } else {
      this.pc.ondatachannel = (ev) => {
        this.channel = ev.channel;
        this.setupDataChannel(this.channel);
      };
    }

    this.signaling = supabase.channel(`quick-share:${roomCode}`, {
      config: { broadcast: { self: false } },
    });

    this.signaling
      .on('broadcast', { event: 'signal' }, ({ payload }) => this.handleSignal(payload))
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        if (isHost) {
          await this.broadcast({ type: 'host-ready', deviceName });
        } else {
          await this.broadcast({ type: 'join', deviceName });
        }
      });
  }

  async sendOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    await this.broadcast({ type: 'offer', sdp: offer, deviceName: this.deviceName });
  }

  broadcast(payload) {
    return this.signaling.send({
      type: 'broadcast',
      event: 'signal',
      payload: { ...payload, at: Date.now() },
    });
  }

  async handleSignal(payload) {
    if (!payload) return;
    if (payload.deviceName && payload.deviceName !== this.deviceName) {
      this.onSignal?.(payload);
    }
    if (payload.from === this.deviceName) return;

    try {
      if (payload.type === 'join' && this.isHost) {
        await this.sendOffer();
      } else if (payload.type === 'offer' && !this.isHost) {
        await this.pc.setRemoteDescription(payload.sdp);
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await this.broadcast({ type: 'answer', sdp: answer, deviceName: this.deviceName });
      } else if (payload.type === 'answer' && this.isHost) {
        await this.pc.setRemoteDescription(payload.sdp);
      } else if (payload.type === 'ice' && payload.candidate) {
        await this.pc.addIceCandidate(payload.candidate);
      }
    } catch (err) {
      console.error('[QuickShare] signal', err);
      this.onError?.(err);
    }
  }

  setupDataChannel(dc) {
    dc.binaryType = 'arraybuffer';
    dc.onmessage = (ev) => {
      if (typeof ev.data === 'string') {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.t === 'meta') {
            this.receiveMeta = msg;
            this.receiveBuffers = [];
          } else if (msg.t === 'done' && this.receiveMeta) {
            const blob = new Blob(this.receiveBuffers, { type: this.receiveMeta.mime || 'application/octet-stream' });
            this.onFileReceived?.({
              name: this.receiveMeta.name,
              blob,
              size: blob.size,
              from: this.receiveMeta.from,
            });
            this.receiveMeta = null;
            this.receiveBuffers = [];
          }
        } catch {
          /* ignore */
        }
        return;
      }
      if (ev.data instanceof ArrayBuffer) {
        this.receiveBuffers.push(ev.data);
      }
    };
  }

  async sendFile(file, fromDevice) {
    const dc = this.channel;
    if (!dc || dc.readyState !== 'open') throw new Error('Peer not connected');
    await waitForOpen(dc);

    dc.send(JSON.stringify({ t: 'meta', name: file.name, size: file.size, mime: file.type, from: fromDevice }));
    const buffer = await file.arrayBuffer();
    let offset = 0;
    while (offset < buffer.byteLength) {
      await waitBuffer(dc);
      const end = Math.min(offset + CHUNK_SIZE, buffer.byteLength);
      dc.send(buffer.slice(offset, end));
      offset = end;
      this.onFileProgress?.(offset / buffer.byteLength);
    }
    dc.send(JSON.stringify({ t: 'done' }));
    this.onFileProgress?.(1);
  }

  destroy() {
    if (this.unsubscribed) return;
    this.unsubscribed = true;
    this.channel?.close();
    this.pc?.close();
    supabase.removeChannel(this.signaling);
  }
}

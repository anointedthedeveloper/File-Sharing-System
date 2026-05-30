import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Copy, Download, Monitor, Smartphone, Upload, Users, History, Trash2, Check, Loader2, Zap, X } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';
import { useToast } from '../context/ToastContext';
import { getDeviceName, getDeviceNameAsync } from '../lib/deviceName';
import { QuickShareSession, generateRoomCode } from '../lib/quickSharePeer';
import { getQuickShareHistory, addQuickShareHistory, clearQuickShareHistory } from '../lib/quickShareHistory';

export default function QuickShare() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const sessionRef = useRef(null);

  const [deviceName, setDeviceNameState] = useState(getDeviceName());
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [peerDevice, setPeerDevice] = useState('');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState(() => getQuickShareHistory());

  const refreshHistory = useCallback(() => setHistory(getQuickShareHistory()), []);

  useEffect(() => {
    getDeviceNameAsync().then((name) => setDeviceNameState(name));
  }, []);

  useEffect(() => () => sessionRef.current?.destroy(), []);

  const startHost = async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setMode('host');
    setConnected(false);
    setPeerDevice('');
    sessionRef.current?.destroy();

    const session = new QuickShareSession({
      roomCode: code,
      isHost: true,
      deviceName,
      onPeerConnected: () => {
        setConnected(true);
        showToast('Device connected!', 'success');
      },
      onFileReceived: (file) => {
        addQuickShareHistory({ id: `${Date.now()}`, direction: 'received', name: file.name, size: file.size, from: file.from || peerDevice });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url; a.download = file.name; a.click();
        URL.revokeObjectURL(url);
        showToast(`Received: ${file.name}`, 'success');
      },
      onSignal: (p) => { if (p.deviceName) setPeerDevice(p.deviceName); },
      onError: (err) => console.warn('[QuickShare]', err),
    });

    sessionRef.current = session;
    addQuickShareHistory({ id: code, direction: 'hosted', code, deviceName });
    refreshHistory();
  };

  const startJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) { showToast('Please enter a valid room code.', 'warning'); return; }
    setRoomCode(code); setMode('join'); setConnected(false); setPeerDevice('');
    sessionRef.current?.destroy();

    sessionRef.current = new QuickShareSession({
      roomCode: code,
      isHost: false,
      deviceName,
      onPeerConnected: () => { setConnected(true); showToast('Connected!', 'success'); },
      onFileReceived: (file) => {
        addQuickShareHistory({ id: `${Date.now()}`, direction: 'received', name: file.name, size: file.size, from: file.from });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url; a.download = file.name; a.click();
        URL.revokeObjectURL(url);
        showToast(`Received: ${file.name}`, 'success');
      },
      onSignal: (p) => { if (p.deviceName) setPeerDevice(p.deviceName); },
      onError: (err) => showToast(err.message || 'Connection lost.', 'error'),
    });

    addQuickShareHistory({ id: `join-${code}`, direction: 'joined', code, deviceName });
    refreshHistory();
  };

  const sendFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sessionRef.current) return;
    setSending(true);
    try {
      await sessionRef.current.sendFile(file, deviceName);
      addQuickShareHistory({ id: `${Date.now()}`, direction: 'sent', name: file.name, size: file.size, to: peerDevice || roomCode });
      refreshHistory();
      showToast(`Sent: ${file.name}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send file.', 'error');
    } finally {
      setSending(false); e.target.value = '';
    }
  };

  const leaveRoom = () => {
    sessionRef.current?.destroy();
    setMode(null);
    setConnected(false);
    setPeerDevice('');
    setRoomCode('');
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <LayoutContainer title="Quick Share — Send Files Directly">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] shadow-sm">
            <Wifi className="w-3.5 h-3.5" /> Device to Device
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
            Quick Share
          </h1>
          <p className="text-base font-medium text-[var(--text-secondary)] max-w-lg mx-auto">
            Send files directly from one device to another in real time — like AirDrop but for any browser. No upload, no waiting for a link.
          </p>
        </div>

        {/* Device display */}
        <div className="glass-card rounded-[2rem] p-4 sm:p-5 flex items-center gap-4 border-[var(--border-strong)] mb-6">
          <div className="w-11 h-11 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">This Device</p>
            <p className="text-base font-bold text-[var(--text-primary)]">{deviceName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500">Ready</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {!mode ? (
                <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 gap-6">

                  {/* Create Room */}
                  <button onClick={startHost} className="glass-card glass-card-hover rounded-[2rem] p-8 text-left border-[var(--border-strong)] group">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-2">Create a Room</h2>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Get a room code and share it with another device to connect.</p>
                  </button>

                  {/* Join Room */}
                  <div className="glass-card rounded-[2rem] p-8 border-[var(--border-strong)] flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 rounded-[1.25rem] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-5 shadow-sm">
                        <Users className="w-7 h-7 text-[var(--accent-secondary)]" />
                      </div>
                      <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-1">Join a Room</h2>
                      <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Enter the room code from the other device.</p>
                    </div>
                    <div className="space-y-3">
                      <input
                        value={joinCode}
                        onChange={e => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="e.g. A3X9"
                        className="w-full bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl py-3 text-center font-mono text-lg tracking-[0.25em] font-bold text-[var(--text-primary)] focus:border-[var(--accent-secondary)] uppercase outline-none"
                        maxLength={8}
                        onKeyDown={(e) => e.key === 'Enter' && startJoin()}
                      />
                      <button onClick={startJoin} className="w-full py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-base)] font-bold text-sm hover:opacity-90 transition-opacity">
                        Join Room
                      </button>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div key="session" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[2rem] p-8 sm:p-10 border-[var(--border-strong)] shadow-premium-hover">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-[var(--border)]">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                        {mode === 'host' ? 'Room Code — Share this with another device' : 'Joined Room'}
                      </p>
                      <p className="text-4xl font-mono font-bold tracking-widest text-[var(--accent)]">{roomCode}</p>
                    </div>
                    <div className="flex gap-2">
                      {mode === 'host' && (
                        <button
                          onClick={() => { navigator.clipboard.writeText(roomCode); showToast('Copied!', 'success'); }}
                          className="btn-ghost !rounded-xl !py-2.5 !px-4 !text-xs flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </button>
                      )}
                      <button onClick={leaveRoom} className="btn-ghost !rounded-xl !py-2.5 !px-4 !text-xs !bg-rose-500/10 !text-rose-500 !border-rose-500/20 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" /> Leave
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-5 transition-all duration-500 ${
                      connected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : 'border-[var(--border-strong)] border-t-[var(--accent)] animate-spin text-[var(--text-muted)]'
                    }`}>
                      {connected ? <Check className="w-9 h-9" /> : <Wifi className="w-9 h-9" />}
                    </div>
                    <p className="text-lg font-bold font-display text-[var(--text-primary)] mb-1">
                      {connected ? `Connected to ${peerDevice || 'another device'}` : 'Waiting for another device to join…'}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {connected ? 'You can now send files to each other.' : 'Keep this page open.'}
                    </p>
                  </div>

                  <input ref={fileInputRef} type="file" className="hidden" onChange={sendFile} disabled={!connected || sending} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!connected || sending}
                    className="btn-primary w-full !py-5 !rounded-2xl text-base mt-4 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                      : <><Upload className="w-5 h-5" /> Send a File</>
                    }
                  </button>

                </motion.div>
              )}
            </AnimatePresence>

            {/* How it works callout */}
            {!mode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-start gap-4"
              >
                <Zap className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)] mb-1">How Quick Share works</p>
                  <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed">
                    One device creates a room and shares the room code. The other device types the code and joins. Once connected, either device can send files directly — no cloud upload involved.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* History panel */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[2rem] p-6 h-full flex flex-col max-h-[520px]">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border)]">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
                  <History className="w-4 h-4" /> Recent Activity
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={() => { clearQuickShareHistory(); refreshHistory(); }}
                    className="text-[10px] font-bold text-[var(--text-muted)] hover:text-rose-500 transition-colors uppercase"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 hide-scrollbar">
                {history.length === 0 ? (
                  <p className="text-xs font-medium text-[var(--text-muted)] text-center py-10">No activity yet.</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        item.direction === 'received' ? 'bg-emerald-500' :
                        item.direction === 'sent' ? 'bg-[var(--accent)]' :
                        'bg-[var(--text-muted)]'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {item.name || item.code || 'Room'}
                        </p>
                        <p className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mt-0.5 flex items-center gap-1">
                          {item.direction}
                          {item.size ? <span className="font-normal normal-case tracking-normal">· {formatBytes(item.size)}</span> : null}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </LayoutContainer>
  );
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

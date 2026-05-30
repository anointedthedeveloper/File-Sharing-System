import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Copy,
  Download,
  Monitor,
  Smartphone,
  Upload,
  Users,
  History,
  Trash2,
  Check,
  Loader2,
} from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';
import { useToast } from '../context/ToastContext';
import { getDeviceName, setDeviceName } from '../lib/deviceName';
import { QuickShareSession, generateRoomCode } from '../lib/quickSharePeer';
import { getQuickShareHistory, addQuickShareHistory, clearQuickShareHistory } from '../lib/quickShareHistory';

export default function QuickShare() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const sessionRef = useRef(null);

  const [deviceName, setDeviceNameState] = useState(getDeviceName);
  const [editingName, setEditingName] = useState(false);
  const [mode, setMode] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [peerDevice, setPeerDevice] = useState('');
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [history, setHistory] = useState(() => getQuickShareHistory());

  const refreshHistory = useCallback(() => setHistory(getQuickShareHistory()), []);

  useEffect(() => () => sessionRef.current?.destroy(), []);

  const startHost = async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setMode('host');
    setConnected(false);
    sessionRef.current?.destroy();

    const session = new QuickShareSession({
      roomCode: code,
      isHost: true,
      deviceName,
      onPeerConnected: () => {
        setConnected(true);
        showToast('Device connected — ready to transfer', 'success');
      },
      onFileReceived: (file) => {
        addQuickShareHistory({
          id: `${Date.now()}`,
          direction: 'received',
          name: file.name,
          size: file.size,
          from: file.from || peerDevice,
        });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Received ${file.name}`, 'success');
      },
      onSignal: (p) => {
        if (p.deviceName) setPeerDevice(p.deviceName);
      },
      onError: (err) => console.warn('[QuickShare]', err),
    });

    sessionRef.current = session;
    addQuickShareHistory({ id: code, direction: 'hosted', code, deviceName });
    refreshHistory();
  };

  const startJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      showToast('Enter a valid access code', 'warning');
      return;
    }
    setRoomCode(code);
    setMode('join');
    setConnected(false);
    sessionRef.current?.destroy();

    sessionRef.current = new QuickShareSession({
      roomCode: code,
      isHost: false,
      deviceName,
      onPeerConnected: () => {
        setConnected(true);
        showToast('Connected to host', 'success');
      },
      onFileReceived: (file) => {
        addQuickShareHistory({
          id: `${Date.now()}`,
          direction: 'received',
          name: file.name,
          size: file.size,
          from: file.from,
        });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${file.name}`, 'success');
      },
      onSignal: (p) => {
        if (p.deviceName) setPeerDevice(p.deviceName);
      },
      onError: (err) => showToast(err.message || 'Connection issue', 'error'),
    });

    sessionRef.current = session;
    addQuickShareHistory({ id: `join-${code}`, direction: 'joined', code, deviceName });
    refreshHistory();
  };

  const sendFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sessionRef.current) return;
    setSending(true);
    setSendProgress(0);
    try {
      await sessionRef.current.sendFile(file, deviceName);
      addQuickShareHistory({
        id: `${Date.now()}`,
        direction: 'sent',
        name: file.name,
        size: file.size,
        to: peerDevice || roomCode,
      });
      refreshHistory();
      showToast('File sent peer-to-peer', 'success');
    } catch (err) {
      showToast(err.message || 'Send failed', 'error');
    } finally {
      setSending(false);
      setSendProgress(0);
      e.target.value = '';
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    showToast('Access code copied', 'success');
  };

  const leaveSession = () => {
    sessionRef.current?.destroy();
    sessionRef.current = null;
    setMode(null);
    setRoomCode('');
    setConnected(false);
    setPeerDevice('');
  };

  const saveDeviceName = () => {
    setDeviceName(deviceName);
    setEditingName(false);
    showToast('Device name saved', 'success');
  };

  return (
    <LayoutContainer
      title="Quick Share - Device to Device | Sharing It"
      description="Share files instantly between nearby devices using an access code. Peer-to-peer, no cloud storage."
    >
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="section-badge mx-auto">
            <Radio className="w-3.5 h-3.5" />
            P2P · No database
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
            Quick Share
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Connect devices with a short code. Files transfer directly — nothing is stored on our servers.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <Monitor className="w-5 h-5 shrink-0 hidden sm:block" style={{ color: 'var(--accent)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              This device
            </p>
            {editingName ? (
              <input
                value={deviceName}
                onChange={(e) => setDeviceNameState(e.target.value)}
                className="form-input mt-1 text-sm py-2"
                maxLength={48}
              />
            ) : (
              <p className="font-semibold truncate text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                {deviceName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={editingName ? saveDeviceName : () => setEditingName(true)}
            className="btn-ghost !py-2 !px-4 !text-xs shrink-0"
          >
            {editingName ? 'Save' : 'Rename'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!mode ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <button
                type="button"
                onClick={startHost}
                className="glass-card rounded-2xl p-6 text-left border transition-transform hover:-translate-y-1 active:scale-[0.99] touch-manipulation"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 shadow-glow">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-bold font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                  Host a room
                </h2>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Get an access code others can enter to receive your files.
                </p>
              </button>

              <div className="glass-card rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h2 className="font-bold font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                    Join with code
                  </h2>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Enter the code shown on the host device.
                  </p>
                </div>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A3X9K2"
                  className="form-input text-center font-mono text-lg tracking-[0.2em] uppercase"
                  maxLength={8}
                />
                <button type="button" onClick={startJoin} className="btn-primary w-full !rounded-xl">
                  <Smartphone className="w-4 h-4" />
                  Join room
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-6 sm:p-8 border space-y-6"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {mode === 'host' ? 'Your access code' : 'Connected to'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold tracking-wider mt-1" style={{ color: 'var(--accent)' }}>
                    {roomCode}
                  </p>
                </div>
                {mode === 'host' && (
                  <button type="button" onClick={copyCode} className="btn-ghost !py-2 !px-3">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                )}
              </div>

              <div
                className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border"
                style={{
                  borderColor: connected ? 'color-mix(in srgb, #22c55e 40%, var(--border))' : 'var(--border)',
                  background: connected ? 'color-mix(in srgb, #22c55e 8%, transparent)' : 'var(--bg-muted)',
                }}
              >
                {connected ? <Check className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} />}
                <span style={{ color: 'var(--text-secondary)' }}>
                  {connected ? `Linked with ${peerDevice || 'peer device'}` : 'Waiting for peer to connect…'}
                </span>
              </div>

              <input ref={fileInputRef} type="file" className="hidden" onChange={sendFile} disabled={!connected || sending} />

              <button
                type="button"
                disabled={!connected || sending}
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full !py-4 !rounded-2xl disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending {Math.round(sendProgress * 100)}%
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 rotate-180" />
                    Send a file
                  </>
                )}
              </button>

              {sending && (
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--gradient-brand)', width: `${sendProgress * 100}%` }}
                    layout
                  />
                </div>
              )}

              <button type="button" onClick={leaveSession} className="w-full text-xs font-semibold py-2 opacity-70 hover:opacity-100" style={{ color: 'var(--text-muted)' }}>
                Leave session
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <History className="w-4 h-4" />
                Session history
                <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>
                  (this tab only)
                </span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  clearQuickShareHistory();
                  refreshHistory();
                }}
                className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="text-xs px-4 py-3 rounded-xl border flex justify-between gap-2"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
                >
                  <span className="truncate font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.name || item.code || item.direction}
                  </span>
                  <span className="shrink-0 capitalize" style={{ color: 'var(--text-muted)' }}>
                    {item.direction}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </LayoutContainer>
  );
}

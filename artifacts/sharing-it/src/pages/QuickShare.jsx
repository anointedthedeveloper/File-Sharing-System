import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Copy, Download, Monitor, Smartphone, Upload, Users, History, Trash2, Check, Loader2, Zap } from 'lucide-react';
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
        showToast('Link established.', 'success');
      },
      onFileReceived: (file) => {
        addQuickShareHistory({ id: `${Date.now()}`, direction: 'received', name: file.name, size: file.size, from: file.from || peerDevice });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url; a.download = file.name; a.click();
        URL.revokeObjectURL(url);
        showToast(`Payload acquired: ${file.name}`, 'success');
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
    if (code.length < 4) { showToast('Invalid frequency code.', 'warning'); return; }
    setRoomCode(code); setMode('join'); setConnected(false);
    sessionRef.current?.destroy();

    sessionRef.current = new QuickShareSession({
      roomCode: code,
      isHost: false,
      deviceName,
      onPeerConnected: () => { setConnected(true); showToast('Uplink confirmed.', 'success'); },
      onFileReceived: (file) => {
        addQuickShareHistory({ id: `${Date.now()}`, direction: 'received', name: file.name, size: file.size, from: file.from });
        refreshHistory();
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url; a.download = file.name; a.click();
        URL.revokeObjectURL(url);
        showToast(`Payload acquired: ${file.name}`, 'success');
      },
      onSignal: (p) => { if (p.deviceName) setPeerDevice(p.deviceName); },
      onError: (err) => showToast(err.message || 'Signal lost.', 'error'),
    });

    addQuickShareHistory({ id: `join-${code}`, direction: 'joined', code, deviceName });
    refreshHistory();
  };

  const sendFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sessionRef.current) return;
    setSending(true); setSendProgress(0);
    try {
      await sessionRef.current.sendFile(file, deviceName);
      addQuickShareHistory({ id: `${Date.now()}`, direction: 'sent', name: file.name, size: file.size, to: peerDevice || roomCode });
      refreshHistory();
      showToast('Transmission complete.', 'success');
    } catch (err) {
      showToast(err.message || 'Transmission failed.', 'error');
    } finally {
      setSending(false); setSendProgress(0); e.target.value = '';
    }
  };

  return (
    <LayoutContainer title="P2P Transfer - Sharing It">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)] shadow-sm">
            <Zap className="w-3.5 h-3.5" /> Direct Device Bridge
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">
            Kinetic P2P Transfer
          </h1>
          <p className="text-sm font-medium text-[var(--text-secondary)] max-w-md mx-auto">
            Establish a direct cryptographic tunnel between devices. Zero servers. Absolute speed.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-[2rem] p-4 sm:p-6 flex items-center justify-between gap-4 border-[var(--border-strong)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Monitor className="w-6 h-6 text-[var(--text-primary)]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">Local Terminal</p>
                  {editingName ? (
                    <input value={deviceName} onChange={e => setDeviceNameState(e.target.value)} className="bg-transparent border-b border-[var(--accent)] focus:outline-none text-sm font-bold text-[var(--text-primary)] py-1" />
                  ) : (
                    <p className="text-base font-bold text-[var(--text-primary)]">{deviceName}</p>
                  )}
                </div>
              </div>
              <button onClick={editingName ? () => {setDeviceName(deviceName); setEditingName(false);} : () => setEditingName(true)} className="btn-ghost !py-2 !px-4 !rounded-xl !text-xs">
                {editingName ? 'Save' : 'Rename'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!mode ? (
                <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 gap-6">
                  <button onClick={startHost} className="glass-card glass-card-hover rounded-[2rem] p-8 text-left border-[var(--border-strong)] group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="w-8 h-8 text-[var(--accent)]" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-2">Host Tunnel</h2>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Generate a secure frequency code for another device to lock onto.</p>
                  </button>
                  <div className="glass-card rounded-[2rem] p-8 border-[var(--border-strong)] flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm">
                        <Users className="w-8 h-8 text-[var(--accent-secondary)]" />
                      </div>
                      <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-4">Join Tunnel</h2>
                    </div>
                    <div className="space-y-3 mt-4">
                      <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. A3X9K2" className="w-full bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl py-3 text-center font-mono text-lg tracking-[0.2em] font-bold text-[var(--text-primary)] focus:border-[var(--accent-secondary)] uppercase outline-none" maxLength={8} />
                      <button onClick={startJoin} className="w-full py-3.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-base)] font-bold text-sm hover:scale-[1.02] transition-transform">Initiate Handshake</button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="session" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[2rem] p-8 sm:p-10 border-[var(--border-strong)] shadow-premium-hover">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-[var(--border)]">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                        {mode === 'host' ? 'Broadcasting on Frequency' : 'Locked onto'}
                      </p>
                      <p className="text-4xl font-mono font-bold tracking-widest text-[var(--accent)]">{roomCode}</p>
                    </div>
                    <div className="flex gap-2">
                      {mode === 'host' && <button onClick={() => {navigator.clipboard.writeText(roomCode); showToast('Copied','success');}} className="btn-ghost !rounded-xl !py-2.5">Copy</button>}
                      <button onClick={() => {sessionRef.current?.destroy(); setMode(null);}} className="btn-ghost !rounded-xl !py-2.5 !bg-rose-500/10 !text-rose-500 !border-rose-500/20">Abort</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 transition-colors duration-500 ${connected ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-[var(--border-strong)] border-t-[var(--accent)] animate-spin text-[var(--text-muted)]'}`}>
                      {connected ? <Check className="w-10 h-10" /> : <Radio className="w-10 h-10" />}
                    </div>
                    <p className="text-lg font-bold font-display text-[var(--text-primary)] mb-1">
                      {connected ? `Uplink Active: ${peerDevice}` : 'Awaiting Peer Terminal...'}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {connected ? 'Encrypted tunnel established. Ready to transmit.' : 'Keep this screen open.'}
                    </p>
                  </div>

                  <input ref={fileInputRef} type="file" className="hidden" onChange={sendFile} disabled={!connected || sending} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={!connected || sending} className="btn-primary w-full !py-5 !rounded-2xl text-lg mt-4 disabled:opacity-50">
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Push Payload</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-card rounded-[2rem] p-6 h-full flex flex-col max-h-[600px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2"><History className="w-4 h-4"/> P2P Log</h3>
                <button onClick={() => {clearQuickShareHistory(); refreshHistory();}} className="text-[10px] font-bold text-[var(--text-muted)] hover:text-rose-500 transition-colors uppercase">Clear</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 hide-scrollbar">
                {history.length === 0 ? (
                  <p className="text-xs font-medium text-[var(--text-muted)] text-center py-10">No P2P activity logged in this terminal.</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{item.name || item.code || 'Signal'}</p>
                        <p className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{item.direction}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${item.direction === 'received' ? 'bg-emerald-500' : 'bg-[var(--accent)]'}`} />
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

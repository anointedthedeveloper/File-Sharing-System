import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Download, Lock, ShieldAlert, Key, Eye, EyeOff, Loader2, ArrowLeft, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { STORAGE_BUCKET, supabase } from '../lib/supabase';
import LayoutContainer from '../components/layout/LayoutContainer';
import { FeatureLoader } from '../components/ui/Loader';
import FilePreview, { canPreviewType } from '../components/ui/FilePreview';

export default function Share() {
  const { slug } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [passwordGate, setPasswordGate] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchFileDetails();
  }, [slug]);

  useEffect(() => {
    if (!unlocked || !fileData?.storage_path) return undefined;
    if (!canPreviewType(fileData.type)) {
      setPreviewUrl(null);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(fileData.storage_path, 3600);
        if (error) throw error;
        if (!cancelled && data?.signedUrl) setPreviewUrl(data.signedUrl);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => { cancelled = true; };
  }, [unlocked, fileData]);

  const fetchFileDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('slug', slug);

      if (error || !data?.length) {
        throw new Error('Node invalid or auto-destructed.');
      }

      const file = Array.isArray(data) ? data[0] : data;
      setFileData(file);
      
      if (file.password || file.password_hash) setPasswordGate(true);
      else setUnlocked(true);

    } catch (e) {
      setErrorMsg(e.message || 'Decryption failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!passwordAttempt) {
      toast.showToast('Submit passkey.', 'warning');
      return;
    }
    
    setVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    setVerifying(false);

    const correctPassword = fileData.password || fileData.password_hash;
    if (correctPassword === passwordAttempt) {
      setUnlocked(true);
      setPasswordGate(false);
    } else {
      toast.showToast('Invalid cryptographic key.', 'error');
    }
  };

  const handleDownload = async () => {
    if (!fileData) return;
    setDownloading(true);
    try {
      await supabase.from('files').update({ downloads_count: (fileData.downloads_count || 0) + 1 }).eq('id', fileData.id);
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(fileData.storage_path, 60);
      
      if (error) throw error;
      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = fileData.name;
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('URL generation failed');
      }
    } catch (e) {
      toast.showToast(e.message || 'Stream initialization failed.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRemainingTime = (isoString) => {
    if (!isoString) return 'Persistent Node';
    const gap = new Date(isoString).getTime() - Date.now();
    if (gap <= 0) return 'Purged';
    const hours = Math.floor(gap / 3600000);
    if (hours > 24) return `${Math.floor(hours / 24)}d TTL`;
    if (hours < 1) return `${Math.floor(gap / 60000)}m TTL`;
    return `${hours}h TTL`;
  };

  return (
    <LayoutContainer title="Extraction Node - Sharing It" ambient={true}>
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <AnimatePresence mode="wait">
            
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[2.5rem] p-12 text-center flex flex-col items-center">
                <FeatureLoader />
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mt-6">Establishing Connection...</p>
              </motion.div>
            )}

            {errorMsg && !loading && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card border-rose-500/30 bg-rose-500/5 rounded-[2.5rem] p-10 text-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <ShieldAlert className="w-10 h-10 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-display text-[var(--text-primary)]">Node Offline</h3>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mt-2">{errorMsg}</p>
                </div>
                <Link to="/" className="btn-ghost !rounded-full !px-8">Return to Base</Link>
              </motion.div>
            )}

            {passwordGate && !unlocked && !loading && (
              <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card rounded-[2.5rem] p-10 text-center shadow-premium-hover relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="w-20 h-20 rounded-[1.5rem] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Lock className="w-8 h-8 text-[var(--text-primary)]" />
                </div>
                <h3 className="text-2xl font-extrabold font-display text-[var(--text-primary)] mb-2">Encrypted Payload</h3>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-8">This node requires cryptographic clearance.</p>
                <form onSubmit={handleVerifyPassword} className="space-y-4">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={passwordAttempt} onChange={(e) => setPasswordAttempt(e.target.value)} placeholder="Passkey" className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] text-center text-lg tracking-widest rounded-2xl py-4 focus:border-[var(--accent)] font-mono" disabled={verifying} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-5 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button type="submit" disabled={verifying} className="btn-primary w-full !py-4.5 !rounded-2xl">
                    {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Decrypt</span>}
                  </button>
                </form>
              </motion.div>
            )}

            {unlocked && !loading && !errorMsg && (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-premium-hover border-[var(--border-strong)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[1.5rem] gradient-bg flex items-center justify-center shadow-glow border border-white/20">
                    <File className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="w-full">
                    <h3 className="text-2xl font-extrabold font-display text-[var(--text-primary)] truncate px-4">{fileData.name}</h3>
                    <div className="flex items-center justify-center gap-3 mt-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                      <span>{formatBytes(fileData.size)}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                      <span>{fileData.type.split('/')[1] || 'BIN'}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                      <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Safe</span>
                    </div>
                  </div>

                  {previewUrl && canPreviewType(fileData?.type) && (
                    <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-black/5 p-1 mt-2">
                      <FilePreview url={previewUrl} type={fileData.type} name={fileData.name} maxHeight={250} className="w-full rounded-xl overflow-hidden" />
                    </div>
                  )}

                  <div className="w-full pt-4 space-y-4">
                    <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full !py-5 !rounded-2xl text-lg tracking-wide shadow-[0_15px_40px_-10px_var(--accent-glow)]">
                      {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5" /> Extract Payload</>}
                    </button>
                    
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-muted)] rounded-xl border border-[var(--border)]">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Node Status</span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">{getRemainingTime(fileData.expires_at)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </LayoutContainer>
  );
}

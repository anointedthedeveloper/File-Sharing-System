import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Shield, Lock, Eye, EyeOff, Calendar, Clipboard, Check, QrCode, Clock, Minimize2, ArrowRight } from 'lucide-react';
import AnimatedDropZone from '../components/ui/AnimatedDropZone';
import FilePreview, { canPreviewType } from '../components/ui/FilePreview';
import { compressFile, formatCompressionNote } from '../lib/compressFile';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';
import { STORAGE_BUCKET, supabase } from '../lib/supabase';
import LayoutContainer from '../components/layout/LayoutContainer';
import { Link } from 'react-router-dom';
import { FileUploadLoader, ButtonLoader } from '../components/ui/Loader';

export default function UploadPage() {
  const { showToast } = useToast();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expiry, setExpiry] = useState('24h'); 
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [compressEnabled, setCompressEnabled] = useState(true);
  const [compressNote, setCompressNote] = useState('');
  const [originalFileMeta, setOriginalFileMeta] = useState(null);

  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const isGuest = !userId;
  const compressLocked = isGuest;

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data?.session?.user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isGuest) setCompressEnabled(true);
  }, [isGuest]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    const limit = userId ? 1000 * 1024 * 1024 : 50 * 1024 * 1024;
    if (selectedFile.size > limit) {
      showToast(`File exceeds limit of ${userId ? '1GB' : '50MB'}.`, 'error');
      return;
    }

    setFile(selectedFile);
    setCompressNote('');
    setOriginalFileMeta({ size: selectedFile.size, name: selectedFile.name });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setCompressNote('');
    setOriginalFileMeta(null);
  };

  const calculateExpiryTimestamp = () => {
    if (expiry === 'never') return null;
    const now = Date.now();
    let gap = 3600000 * 24;
    if (expiry === '1h') gap = 3600000;
    if (expiry === '7d') gap = 3600000 * 24 * 7;
    return new Date(now + gap).toISOString();
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(5);
    setCompressNote('');

    try {
      let uploadFile = file;

      if (compressEnabled) {
        setProgress(15);
        const result = await compressFile(file);
        uploadFile = result.file;
        const note = formatCompressionNote(result);
        if (note) {
          setCompressNote(note);
          showToast(note, 'success');
        }
        setProgress(35);
      } else {
        setProgress(25);
      }

      const slug = Math.random().toString(36).substr(2, 6);
      const expiresAt = calculateExpiryTimestamp();
      const storagePath = `uploads/${slug}/${uploadFile.name}`;

      setProgress(50);
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, uploadFile);
        
      if (uploadError) {
        if (uploadError.message?.toLowerCase().includes('bucket not found')) {
          throw new Error(`Storage bucket "${STORAGE_BUCKET}" was not found. Contact administrator.`);
        }
        throw uploadError;
      }

      setProgress(80);
      const newFileData = {
        user_id: userId,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        storage_path: storagePath,
        slug,
        password: passwordProtect && password ? password : null,
        expires_at: expiresAt
      };

      const { error: dbError } = await supabase
        .from('files')
        .insert(newFileData);

      if (dbError) throw dbError;

      setProgress(100);
      setUploading(false);

      const generatedLink = `${window.location.origin}/share/${slug}`;
      setShareData({
        link: generatedLink,
        slug,
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
        expiresAt,
        compressed: compressEnabled && uploadFile.size < (originalFileMeta?.size || uploadFile.size),
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#8b5cf6', '#0ea5e9']
      });

      showToast('File secured and linked.', 'success');

    } catch (e) {
      console.error(e);
      setUploading(false);
      setProgress(0);
      showToast(e.message || 'Transmission failed.', 'error');
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.link);
    setCopied(true);
    showToast('Secure link copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <LayoutContainer
      title="Upload Stage - Sharing It"
      description="Securely stage and broadcast your files to the world."
    >
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 w-full max-w-[100vw] overflow-x-hidden relative">
        
        {/* Ambient background enhancements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-10 space-y-4">
            <span className="section-badge tracking-widest"><Upload className="w-3 h-3" /> Staging Area</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-display tracking-tight">
              Prepare Transmission
            </h1>
          </div>

          <div className="glass-card rounded-[2rem] p-2 bg-[var(--bg-muted)]/30 backdrop-blur-3xl shadow-premium-hover">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[var(--bg-elevated)] rounded-[1.8rem] overflow-hidden border border-[var(--border)]">
              
              {/* Main Upload Box */}
              <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border)] relative bg-[var(--bg-base)]/50">
                <AnimatePresence mode="wait">
                  {!shareData ? (
                    <motion.div
                      key="upload-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

                      {!file ? (
                        <div className="h-[300px]">
                          <AnimatedDropZone
                            dragActive={dragActive}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                            onFileChange={handleFileChange}
                            inputRef={fileInputRef}
                            disabled={uploading}
                            maxLabel={`Max ${userId ? '1GB' : '50MB'}`}
                          />
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                          <div className="p-4 rounded-2xl flex items-center justify-between gap-4 glass-card bg-[var(--bg-elevated)] shadow-sm">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-glow">
                                <File className="w-6 h-6 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-base font-bold truncate text-[var(--text-primary)]">{file.name}</p>
                                <p className="text-xs font-semibold mt-0.5 text-[var(--text-muted)] uppercase tracking-wider">
                                  {formatBytes(file.size)} &bull; {file.type || 'BINARY'}
                                </p>
                              </div>
                            </div>
                            <button type="button" onClick={removeFile} disabled={uploading} className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors shrink-0 group">
                              <X className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-rose-500 transition-colors" />
                            </button>
                          </div>

                          {canPreviewType(file.type) && (
                            <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm bg-black/5">
                              <FilePreview file={file} type={file.type} name={file.name} maxHeight={280} className="w-full" />
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Configurations */}
                      <div className="space-y-5 pt-4 border-t border-[var(--border)]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Expiry */}
                          <div className="space-y-2 text-left">
                            <label className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[var(--accent)]" />
                              Auto-Destruct
                            </label>
                            <select
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              disabled={uploading}
                              className="form-input text-sm cursor-pointer shadow-sm"
                            >
                              <option value="1h">T+ 1 Hour</option>
                              <option value="24h">T+ 24 Hours</option>
                              <option value="7d">T+ 7 Days</option>
                              <option value="never">Persist (Never)</option>
                            </select>
                          </div>

                          {/* Password Toggle */}
                          <div className="space-y-2 text-left">
                            <label className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                              <Shield className="w-4 h-4 text-[var(--accent)]" />
                              Encryption Gate
                            </label>
                            <button
                              type="button"
                              onClick={() => !uploading && setPasswordProtect(!passwordProtect)}
                              className={`w-full py-3.5 px-4 rounded-xl transition-all duration-300 text-sm font-bold flex items-center justify-between border ${
                                passwordProtect
                                  ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]'
                                  : 'bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                              }`}
                            >
                              <span>Require Passkey</span>
                              <Lock className={`w-4 h-4 ${passwordProtect ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {passwordProtect && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 text-left pt-2">
                                <label className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em]">Define Passkey</label>
                                <div className="relative">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={uploading}
                                    placeholder="Enter secure cryptographic key..."
                                    className="form-input text-sm py-3.5 pr-12 shadow-sm font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <label
                          className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                            compressLocked ? 'opacity-80 cursor-not-allowed bg-[var(--bg-muted)]' : 'cursor-pointer bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] shadow-sm'
                          }`}
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 transition-colors ${compressEnabled ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-strong)] bg-[var(--bg-muted)] text-transparent'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="checkbox"
                            checked={compressEnabled}
                            disabled={compressLocked || uploading || !file}
                            onChange={(e) => setCompressEnabled(e.target.checked)}
                            className="hidden"
                          />
                          <div className="text-left min-w-0 flex-1">
                            <span className="text-sm font-bold flex items-center gap-2 text-[var(--text-primary)]">
                              <Minimize2 className="w-4 h-4 text-[var(--accent)]" />
                              Payload Compression
                            </span>
                            <p className="text-xs mt-1.5 leading-relaxed font-medium text-[var(--text-secondary)]">
                              {compressLocked
                                ? 'Enforced for unauthenticated payloads. Optimizes assets automatically.'
                                : 'Highly recommended for raw image assets. Binaries and videos transmit unaltered.'}
                            </p>
                            {compressNote && (
                              <p className="text-xs mt-2 font-bold text-emerald-500">{compressNote}</p>
                            )}
                          </div>
                        </label>
                      </div>

                      {uploading && (
                        <div className="pt-4">
                          <FileUploadLoader progress={progress} fileName={file?.name} />
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          onClick={handleUpload}
                          disabled={!file || uploading}
                          className="btn-primary w-full !py-4.5 !rounded-2xl text-base tracking-wide"
                        >
                          {uploading ? (
                            <>
                              <ButtonLoader size="md" />
                              <span>Transmitting Payload...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              <span>Initialize Broadcast</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-8 text-center py-6 h-full flex flex-col justify-center"
                    >
                      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">Transmission Secured.</h3>
                        <p className="text-base text-[var(--text-secondary)] truncate max-w-sm mx-auto font-medium">
                          {shareData.name} is now accessible globally.
                        </p>
                      </div>

                      <div className="space-y-2.5 text-left max-w-md mx-auto w-full">
                        <label className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Global Node URL</label>
                        <div className="relative flex items-center p-1.5 bg-[var(--bg-muted)] border border-[var(--border)] rounded-2xl">
                          <input
                            type="text"
                            readOnly
                            value={shareData.link}
                            className="w-full bg-transparent text-sm pl-4 pr-32 font-mono font-medium text-[var(--text-primary)] outline-none"
                          />
                          <button
                            onClick={handleCopyLink}
                            className={`absolute right-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              copied ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-6 border border-[var(--border-strong)] rounded-3xl bg-[var(--bg-elevated)] max-w-[240px] mx-auto flex flex-col items-center gap-4 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                          <QRCodeSVG value={shareData.link} size={140} />
                        </div>
                        <div className="text-center w-full">
                          <p className="text-xs font-extrabold text-[var(--text-secondary)] flex items-center gap-1.5 justify-center uppercase tracking-widest">
                            <QrCode className="w-4 h-4 text-[var(--accent)]" />
                            Optical Scan
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => { setShareData(null); removeFile(); }}
                          className="btn-ghost !rounded-full !px-8"
                        >
                          Stage New Payload
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Sidebar */}
              <div className="col-span-1 lg:col-span-5 bg-[var(--bg-elevated)] p-8 sm:p-10 flex flex-col justify-center border-t lg:border-t-0 border-[var(--border)] relative overflow-hidden">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">Architectural Directives</h3>
                
                <ul className="space-y-8 relative z-10">
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all duration-300">
                      <Shield className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm mb-1">Zero-Knowledge Fabric</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">Data resides inert in secure buckets. We extract no telemetry from your payload contents.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all duration-300">
                      <Clock className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm mb-1">Ephemeral Storage</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">When timers trigger, nodes are purged aggressively. No archived backups remain.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all duration-300">
                      <Zap className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm mb-1">Edge Delivered</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">Downloads stream via distributed global edge caches, minimizing latency regardless of origin.</p>
                    </div>
                  </li>
                </ul>

                {!userId && (
                  <div className="mt-10 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-[var(--border-strong)]">
                    <p className="text-xs font-bold text-[var(--text-primary)] mb-3">Require expanded capacities?</p>
                    <Link to="/auth?tab=register" className="flex items-center text-xs font-extrabold text-[var(--accent)] hover:underline group">
                      Initialize authenticated node
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}

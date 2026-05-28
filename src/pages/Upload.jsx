import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Shield, Lock, Eye, EyeOff, Calendar, Clipboard, Check, RefreshCw, QrCode, Mail, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function UploadPage() {
  const { showToast } = useToast();

  // App states
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expiry, setExpiry] = useState('24h'); // 1h, 24h, 7d, never
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shareData, setShareData] = useState(null); // stores success metadata

  const fileInputRef = useRef(null);

  // Auto-fill mock credentials when guest uploads
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data?.session?.user?.id || null);
    };
    fetchUser();
  }, []);

  // Drag & Drop handlers
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
    // Size restrictions: Guest 50MB, User 1GB
    const limit = userId ? 1000 * 1024 * 1024 : 50 * 1024 * 1024;
    if (selectedFile.size > limit) {
      showToast(`File is too large. Limit is ${userId ? '1GB' : '50MB'} for ${userId ? 'registered users' : 'anonymous guest uploads'}.`, 'error');
      return;
    }

    setFile(selectedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  // Convert human expiry key to timestamp
  const calculateExpiryTimestamp = () => {
    if (expiry === 'never') return null;
    const now = Date.now();
    let gap = 3600000 * 24; // Default 24 hours
    if (expiry === '1h') gap = 3600000;
    if (expiry === '7d') gap = 3600000 * 24 * 7;
    return new Date(now + gap).toISOString();
  };

  // Upload simulation or live Supabase submission
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(5);

    try {
      // 1. Simulate active file upload looping indicators
      const duration = 2000; // 2 seconds
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, duration / steps));
        setProgress(Math.min(5 + i * 9.5, 95));
      }

      const slug = Math.random().toString(36).substr(2, 6);
      const expiresAt = calculateExpiryTimestamp();

      let storagePath = `uploads/${slug}/${file.name}`;

      // 2. Direct storage upload to real Supabase bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sharing-it-files')
        .upload(storagePath, file);
      if (uploadError) throw uploadError;

      // 3. Register Database Record inside files table
      const newFileData = {
        user_id: userId,
        name: file.name,
        size: file.size,
        type: file.type,
        storage_path: storagePath,
        slug,
        password: passwordProtect && password ? password : null,
        expires_at: expiresAt
      };

      const { data: dbRecords, error: dbError } = await supabase
        .from('files')
        .insert(newFileData);

      if (dbError) throw dbError;

      // 4. Wrap uploads in success triggers
      setProgress(100);
      setUploading(false);

      const generatedLink = `${window.location.origin}/share/${slug}`;
      setShareData({
        link: generatedLink,
        slug,
        name: file.name,
        size: file.size,
        type: file.type,
        expiresAt
      });

      // Trigger canvas confetti celebration!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#4f46e5', '#10b981']
      });

      showToast('File shared successfully!', 'success');

    } catch (e) {
      console.error(e);
      setUploading(false);
      setProgress(0);
      showToast(e.message || 'File upload failed.', 'error');
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.link);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper formatting filesize
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
      title="Upload and Share Files - Sharing It"
      description="Drag and drop files to generate premium secure, password-locked auto-expiring links instantly."
    >
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">

        {/* Title */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
            Share Your Files
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Choose files to securely upload. Configure password controls or expiry timelines as required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Main Upload Box Card (Lefthand Column) */}
          <div className="col-span-1 md:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center relative overflow-hidden">

              <AnimatePresence mode="wait">
                {!shareData ? (
                  <motion.div
                    key="upload-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Drag-drop zone */}
                    {!file ? (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 cursor-pointer transition-all duration-300 flex flex-col items-center gap-3 relative select-none ${dragActive
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                          }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center border border-blue-100/30 dark:border-blue-900/30 text-blue-600 dark:text-blue-400">
                          <Upload className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                            Drag and Drop File Here
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            or click to browse local storage
                          </p>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md uppercase">
                          Max Size: {userId ? '1GB' : '50MB'}
                        </div>
                      </div>
                    ) : (
                      /* File Selected Card */
                      <div className="border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between gap-4 text-left">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500">
                            <File className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate pr-4">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {formatBytes(file.size)} &bull; {file.type || 'Binary'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={removeFile}
                          disabled={uploading}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                          aria-label="Remove File"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Expiry and Password properties */}
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Expiry Option */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Link Expiry</span>
                          </label>
                          <select
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            disabled={uploading}
                            className="form-input text-sm cursor-pointer py-3 min-h-[48px]"
                          >
                            <option value="1h">1 Hour</option>
                            <option value="24h">24 Hours (1 Day)</option>
                            <option value="7d">7 Days</option>
                            <option value="never">Never Expire</option>
                          </select>
                        </div>

                        {/* Password Toggle Card */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Access Gate</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => !uploading && setPasswordProtect(!passwordProtect)}
                            className={`w-full min-h-[48px] flex items-center justify-between px-4 border rounded-xl transition-all text-sm font-semibold ${passwordProtect
                                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 text-blue-600 dark:text-blue-400'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                              }`}
                          >
                            <span>Password Lock</span>
                            <Lock className={`w-4 h-4 ${passwordProtect ? 'text-blue-500' : 'text-slate-400'}`} />
                          </button>
                        </div>

                      </div>

                      {/* Sliding Password Form Field */}
                      <AnimatePresence>
                        {passwordProtect && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1.5 text-left pt-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Set Share Passkey</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  disabled={uploading}
                                  placeholder="Enter secure passcode..."
                                  className="form-input text-sm py-3 pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* Progress tracking wrapper */}
                    {uploading && (
                      <div className="space-y-2 text-left pt-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading payload...</span>
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                          <motion.div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload CTA Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all min-h-[52px]"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Streaming to storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Generate Share Link</span>
                          </>
                        )}
                      </button>
                    </div>

                  </motion.div>
                ) : (

                  /* 3. POST-UPLOAD SHARE SUCCESS OVERLAY (Glassmorphic Slide Card) */
                  <motion.div
                    key="upload-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30 text-emerald-500">
                      <Check className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">Share Node Generated!</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm mx-auto">
                        Your file {shareData.name} is uploaded.
                      </p>
                    </div>

                    {/* Copy Link field block */}
                    <div className="space-y-1.5 text-left max-w-md mx-auto">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shareable URL</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value={shareData.link}
                          className="form-input text-xs pr-12 font-mono truncate"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="absolute right-2 px-3 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* QR Code and Actions grid */}
                    <div className="p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-slate-50 dark:bg-slate-900/40 max-w-xs mx-auto flex flex-col items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                        <QRCodeSVG value={shareData.link} size={130} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 justify-center uppercase tracking-wider">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Mobile Share QR Ready</span>
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Scan to instantly preview or download on phone.</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => { setShareData(null); removeFile(); }}
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        Share Another File
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Guidelines Sidebar Panel (Righthand Column) */}
          <div className="col-span-1 md:col-span-5 space-y-6 text-left">



            <div className="p-6.5 sm:p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 space-y-6">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Sharing Paradigms</h3>

              <ul className="space-y-4">
                {[
                  {
                    title: "Access Gate Locking",
                    desc: "Apply passkeys to protect links. Receivers must input correct password signatures to verify download streams."
                  },
                  {
                    title: "Auto-expiring Lifespans",
                    desc: "Specify timeline nodes (1 hour, 1 day, 7 days). Reaching limits automatically renders files entirely inaccessible."
                  },
                  {
                    title: "Mobile Friendly Previews",
                    desc: "Instantly preview PDFs, code snippets, visual images, or play audio and video directly in mobile browsers using QR codes."
                  }
                ].map((rule) => (
                  <li key={rule.title} className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 font-display flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{rule.title}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-3.5">
                      {rule.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </LayoutContainer>
  );
}

// Internal circular spin loader
const Loader2 = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

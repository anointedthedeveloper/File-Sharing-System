import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Download, Lock, ShieldAlert, Key, Eye, EyeOff, Loader2, ArrowLeft, Calendar } from 'lucide-react';
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
  
  // Security parameters
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
        console.error('[Share] preview URL', e);
      }
    })();

    return () => {
      cancelled = true;
    };
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
        throw new Error(error?.message || 'File share link does not exist or has expired.');
      }

      const file = Array.isArray(data) ? data[0] : data;
      setFileData(file);
      
      // Determine password lock requirements
      if (file.password || file.password_hash) {
        setPasswordGate(true);
      } else {
        setUnlocked(true);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message || 'Error pulling file details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!passwordAttempt) {
      toast.showToast('Please type password gate credentials.', 'warning');
      return;
    }
    
    setVerifying(true);
    await new Promise(r => setTimeout(r, 700));
    setVerifying(false);

    const correctPassword = fileData.password || fileData.password_hash;
    if (correctPassword === passwordAttempt) {
      setUnlocked(true);
      setPasswordGate(false);
      toast.showToast('Access gate successfully unlocked!', 'success');
    } else {
      toast.showToast('Invalid access key password.', 'error');
    }
  };

  // Secure download loop and metrics tracker
  const handleDownload = async () => {
    if (!fileData) return;
    setDownloading(true);
    try {
      // 1. Increment database download count metrics
      await supabase
        .from('files')
        .update({ downloads_count: (fileData.downloads_count || 0) + 1 })
        .eq('id', fileData.id);
      
      // 2. Fetch secure signed URL from storage bucket
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(fileData.storage_path, 60);
      
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
        toast.showToast('Download started in the background.', 'success');
      } else {
        throw new Error('Could not generate download URL');
      }
    } catch (e) {
      toast.showToast(e.message || 'Failed to trigger download file stream.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Formatting helpers
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getRemainingTime = (isoString) => {
    if (!isoString) return 'Never Expires';
    const now = Date.now();
    const expiry = new Date(isoString).getTime();
    const gap = expiry - now;
    if (gap <= 0) return 'Expired';

    const hours = Math.floor(gap / 3600000);
    if (hours > 24) {
      return `Expires in ${Math.floor(hours / 24)} days`;
    }
    if (hours < 1) {
      const minutes = Math.floor(gap / 60000);
      return `Expires in ${minutes} minutes`;
    }
    return `Expires in ${hours} hours`;
  };


  return (
    <LayoutContainer 
      title="Secure Shared File - Anobyte Software Transfer Files Online"
      description="Access and download secure shared files with Anobyte software, designed for transfer files online, share files free, and safe file delivery."
    >
      <div className="max-w-lg sm:max-w-xl mx-auto px-4 py-12 sm:py-20 flex flex-col justify-center min-h-[60vh] w-full">
        
        <AnimatePresence mode="wait">
          
          {/* 1. Loading indicators */}
          {loading && (
            <motion.div
              key="share-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center space-y-4"
            >
              <FeatureLoader />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Decrypting share signature...</p>
            </motion.div>
          )}

          {/* 2. Error displays */}
          {errorMsg && !loading && (
            <motion.div
              key="share-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 rounded-3xl glass-card border border-rose-200/50 dark:border-rose-900/50 text-center space-y-6 bg-rose-50/10"
            >
              <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/30 text-rose-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Share Node Unavailable</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  {errorMsg}
                </p>
              </div>

              <div className="pt-2">
                <Link to="/" className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go to Sharing It Home</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* 3. Password locked page gate card */}
          {passwordGate && !unlocked && !loading && (
            <motion.div
              key="share-password"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mx-auto border border-blue-100/30 dark:border-blue-900/30 text-blue-500">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Passkey Locked</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This secure share requires password locks verification.</p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordAttempt}
                    onChange={(e) => setPasswordAttempt(e.target.value)}
                    placeholder="Type password passcode..."
                    className="form-input text-xs pr-10"
                    disabled={verifying}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 min-h-[48px]"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying passkey...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Unlock Share Node</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* 4. Verified Download Share Panel */}
          {unlocked && !loading && !errorMsg && (
            <motion.div
              key="share-details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center space-y-6"
            >
              {/* File visual badge */}
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500 border border-blue-500/20">
                <File className="w-7 h-7" />
              </div>

              {/* Meta details */}
              <div className="space-y-1 pr-2">
                <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white truncate max-w-[300px] mx-auto leading-relaxed">
                  {fileData.name}
                </h3>
                <div className="flex items-center justify-center gap-2.5 text-xs text-slate-400 font-semibold">
                  <span>{formatBytes(fileData.size)}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{getRemainingTime(fileData.expires_at)}</span>
                  </span>
                </div>
              </div>

              {previewUrl && canPreviewType(fileData?.type) && (
                <FilePreview url={previewUrl} type={fileData.type} name={fileData.name} maxHeight={320} className="w-full" />
              )}

              {/* Download trigger CTA */}
              <div className="space-y-3.5">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all min-h-[52px]"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{downloading ? 'Starting Download...' : 'Download Secure File'}</span>
                </button>
                
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Downloads use encrypted temporary link tokens. Powered by{' '}
                  <a href="https://anobyte.online" target="_blank" rel="noreferrer" className="underline font-semibold gradient-text">
                    Anobyte
                  </a>
                  .
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </LayoutContainer>
  );
}

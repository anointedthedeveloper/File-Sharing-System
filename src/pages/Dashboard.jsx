import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Trash2, Download, Copy, Search, Filter, Loader2, Plus, Clock, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmailOnce } from '../lib/email';
import LayoutContainer from '../components/layout/LayoutContainer';
import { SkeletonTable } from '../components/ui/Loader';

export default function Dashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auth & data states
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Filtering & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all'); // all, image, document, media, other
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('Please sign in to access your dashboard.', 'info');
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setProfile(session.profile);
      sendWelcomeEmailOnce().catch(() => {});
      fetchUserFiles(session.user.id);
    };
    initSession();
  }, [navigate]);

  const fetchUserFiles = async (uid) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (e) {
      console.error(e);
      showToast('Error loading shared files history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (fid) => {
    if (!window.confirm('Are you absolute certain you want to delete this share link and file permanently? This action is irreversible.')) {
      return;
    }
    
    setDeletingId(fid);
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fid);

      if (error) throw error;
      
      // Optimistically update list
      setFiles(prev => prev.filter(f => f.id !== fid));
      showToast('File share purged successfully.', 'success');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Error deleting file share.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Clipboard copies
  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/share/${slug}`;
    navigator.clipboard.writeText(link);
    showToast('Share link copied!', 'success');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showToast('Use at least 8 characters for your new password.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Password confirmation does not match.', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.', 'success');
    } catch (e) {
      showToast(e.message || 'Could not update password.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Metrics calculators
  const totalFiles = files.length;
  const totalDownloads = files.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
  const usedStorageBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  
  // Total limits: 1GB = 1073741824 Bytes for logged-in accounts
  const storageLimitBytes = 1000 * 1024 * 1024; 
  const storagePercentage = Math.min((usedStorageBytes / storageLimitBytes) * 100, 100);

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
    if (!isoString) return 'Never';
    const now = Date.now();
    const expiry = new Date(isoString).getTime();
    const gap = expiry - now;
    if (gap <= 0) return 'Expired';

    const hours = Math.floor(gap / 3600000);
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    return `${hours}h left`;
  };

  // Match search & filtering categories
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    
    if (category === 'all') return matchesSearch;
    if (category === 'image') return matchesSearch && f.type.startsWith('image/');
    if (category === 'media') return matchesSearch && (f.type.startsWith('audio/') || f.type.startsWith('video/'));
    if (category === 'document') {
      return matchesSearch && (f.type.startsWith('text/') || f.type === 'application/pdf' || f.type === 'application/json');
    }
    // 'other' includes zip, archives, unknown
    return matchesSearch && !f.type.startsWith('image/') && !f.type.startsWith('audio/') && !f.type.startsWith('video/') && !f.type.startsWith('text/') && f.type !== 'application/pdf';
  });

  return (
    <LayoutContainer 
      title="User Dashboard - Manage Shared Files & Free File Sharing with Anobyte Software"
      description="Track shared files, manage download links, and monitor secure file sharing activity for transfer files online and share files free workflows."
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        
        {/* Welcome Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-slate-200/50 dark:border-slate-800/50 pb-6 text-left">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
              User Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{profile?.full_name || user?.email}</span>. Manage your shared links parameters.
            </p>
          </div>
          
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New File</span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            
            /* Skeletons */
            <motion.div key="dashboard-loading" className="space-y-4 py-4">
              <p className="text-xs text-center font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Syncing your shares...
              </p>
              <SkeletonTable rows={6} />
            </motion.div>
          ) : (
            
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* 1. METRICS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* File Count Card */}
                <div className="p-6 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Shares</p>
                  <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-2">
                    {totalFiles}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5">Shared link instances currently hosted.</p>
                </div>

                {/* Total Downloads Count Card */}
                <div className="p-6 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Downloads</p>
                  <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-2">
                    {totalDownloads}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5">Aggregate link visits and file downloads.</p>
                </div>

                {/* Storage Used Analytics Card */}
                <div className="p-6 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Space Allocated</span>
                      <span className="text-slate-500 dark:text-slate-300">{formatBytes(usedStorageBytes)} / {formatBytes(storageLimitBytes, 0)}</span>
                    </div>
                    
                    {/* Linear Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                        style={{ width: `${storagePercentage}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-3 sm:mt-0 font-medium">Reaching limit automatically locks further uploads.</p>
                </div>

              </div>

              {/* Account Security */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 p-6 rounded-[2rem] glass-card border border-blue-100/60 dark:border-blue-900/40 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-widest">Account</p>
                      <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-2">Security Settings</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        Signed in as <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.email}</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-glow">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handlePasswordChange}
                  className="lg:col-span-7 p-6 rounded-[2rem] glass-card border border-blue-100/60 dark:border-blue-900/40 text-left space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Change Password</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          disabled={updatingPassword}
                          className="form-input text-sm py-3 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-blue-500"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        disabled={updatingPassword}
                        className="form-input text-sm py-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">
                      Password changes apply to your Supabase account immediately. Use a unique password you do not use elsewhere.
                    </p>
                    <button
                      type="submit"
                      disabled={updatingPassword || !newPassword || !confirmPassword}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all"
                    >
                      {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. HISTORY CONTROLS BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-left">
                
                {/* Search field */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by filename..."
                    className="form-input text-xs pl-9 py-2.5 max-w-sm"
                  />
                </div>

                {/* Filters grid */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5 flex-shrink-0">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter:</span>
                  </span>
                  
                  {['all', 'image', 'document', 'media', 'other'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all select-none cursor-pointer ${
                        category === cat
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* 3. HISTORY FILES LISTING */}
              {filteredFiles.length === 0 ? (
                
                /* Empty state dashboard visual */
                <div className="p-8 sm:p-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
                    <File className="w-6 h-6 animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">No shared files found</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      {search || category !== 'all' 
                        ? 'No files matching chosen search filters.' 
                        : 'You haven\'t uploaded any file shares yet.'}
                    </p>
                  </div>

                  {(!search && category === 'all') && (
                    <div className="pt-2">
                      <Link to="/upload" className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                        <span>Upload First File</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                
                /* List of shared files - Card layout for mobile, Table for desktop */
                <>
                  {/* Mobile Card Layout */}
                  <div className="md:hidden space-y-4">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-5 rounded-2xl glass-card border border-slate-200/40 dark:border-slate-800/40 space-y-4"
                      >
                        {/* File name and icon */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                            <File className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {file.type.split('/')[1] || 'binary'} • {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Download className="w-3.5 h-3.5" />
                            <span className="font-semibold">{file.downloads_count} downloads</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-semibold">{getRemainingTime(file.expires_at)}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleCopyLink(file.slug)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            disabled={deletingId === file.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                          >
                            {deletingId === file.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/20 backdrop-blur-md">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filename</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filesize</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Downloads</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry</th>
                          <th className="px-6 py-4.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60">
                        {filteredFiles.map((file) => (
                          <tr 
                            key={file.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                          >
                            <td className="px-6 py-4.5 truncate max-w-[200px]">
                              <div className="flex items-center gap-3">
                                <File className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {formatBytes(file.size)}
                            </td>
                            <td className="px-6 py-4.5 text-xs text-slate-400 font-semibold truncate max-w-[120px]">
                              {file.type.split('/')[1] || 'binary'}
                            </td>
                            <td className="px-6 py-4.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
                              {file.downloads_count}
                            </td>
                            <td className="px-6 py-4.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md uppercase bg-slate-50 dark:bg-slate-900/40">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{getRemainingTime(file.expires_at)}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleCopyLink(file.slug)}
                                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 transition-colors"
                                  title="Copy Share Link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(file.id)}
                                  disabled={deletingId === file.id}
                                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-rose-500 hover:border-rose-500/50 transition-colors"
                                  title="Delete Share Link"
                                >
                                  {deletingId === file.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </LayoutContainer>
  );
}

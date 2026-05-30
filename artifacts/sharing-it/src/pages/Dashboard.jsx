import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  File, Trash2, Download, Copy, Search, Filter, Loader2, Plus, Clock, Lock,
  Eye, EyeOff, CheckCircle2, FolderOpen, HardDrive, User, Link2, Command
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmailOnce } from '../lib/email';
import LayoutContainer from '../components/layout/LayoutContainer';
import { SkeletonTable } from '../components/ui/Loader';

export default function Dashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('Authentication required for workspace access.', 'info');
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
      showToast('Telemetry sync failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fid) => {
    if (!window.confirm('Executing irreversible purge protocol. Proceed?')) {
      return;
    }
    
    setDeletingId(fid);
    try {
      const { error } = await supabase.from('files').delete().eq('id', fid);
      if (error) throw error;
      
      setFiles(prev => prev.filter(f => f.id !== fid));
      showToast('Node purged securely.', 'success');
    } catch (e) {
      showToast(e.message || 'Purge failed.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/share/${slug}`;
    navigator.clipboard.writeText(link);
    showToast('Secure coordinates copied.', 'success');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showToast('Key must contain at least 8 elements.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Key signature mismatch.', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      showToast('Cryptographic keys updated.', 'success');
    } catch (e) {
      showToast(e.message || 'Key cycle failed.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const totalFiles = files.length;
  const totalDownloads = files.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
  const usedStorageBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const storageLimitBytes = 1000 * 1024 * 1024; 
  const storagePercentage = Math.min((usedStorageBytes / storageLimitBytes) * 100, 100);

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getRemainingTime = (isoString) => {
    if (!isoString) return 'Persistent';
    const now = Date.now();
    const expiry = new Date(isoString).getTime();
    const gap = expiry - now;
    if (gap <= 0) return 'Purged';

    const hours = Math.floor(gap / 3600000);
    if (hours > 24) return `${Math.floor(hours / 24)}d TTL`;
    return `${hours}h TTL`;
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    if (category === 'all') return matchesSearch;
    if (category === 'image') return matchesSearch && f.type.startsWith('image/');
    if (category === 'media') return matchesSearch && (f.type.startsWith('audio/') || f.type.startsWith('video/'));
    if (category === 'document') return matchesSearch && (f.type.startsWith('text/') || f.type === 'application/pdf' || f.type === 'application/json');
    return matchesSearch && !f.type.startsWith('image/') && !f.type.startsWith('audio/') && !f.type.startsWith('video/') && !f.type.startsWith('text/') && f.type !== 'application/pdf';
  });

  return (
    <LayoutContainer 
      title="Workspace - Sharing It"
      description="Manage your secure file nodes and telemetry data."
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        
        {/* Cinematic Header Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] glass-card p-8 sm:p-12 mb-12 shadow-premium-hover border-[var(--border-strong)]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center shadow-glow shrink-0 border border-white/20">
                <Command className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[var(--accent)] mb-1 block">Command Center</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
                  Workspace
                </h1>
                <p className="text-sm mt-2 text-[var(--text-secondary)] font-medium">
                  Authenticated as <span className="text-[var(--text-primary)] font-bold">{profile?.full_name || user?.email}</span>
                </p>
              </div>
            </div>
            <Link to="/upload" className="btn-primary !rounded-full !px-8 shrink-0 shadow-[0_10px_30px_-10px_var(--accent-glow)]">
              <Plus className="w-5 h-5" />
              <span>Deploy Payload</span>
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card border border-[var(--border-strong)] shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Synchronizing Telemetry...</span>
                </div>
              </div>
              <SkeletonTable rows={4} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Telemetry Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Link2, label: 'Active Nodes', value: totalFiles, hint: 'Deployed live links' },
                  { icon: Download, label: 'Global Fetches', value: totalDownloads, hint: 'Total successful extractions' },
                  { icon: HardDrive, label: 'Capacity Used', value: formatBytes(usedStorageBytes), hint: `${formatBytes(storageLimitBytes, 0)} total · ${Math.round(storagePercentage)}% utilized`, progress: storagePercentage },
                ].map((card) => (
                  <div key={card.label} className="p-8 rounded-[2rem] glass-card glass-card-hover border border-[var(--border)] text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-0 group-hover:opacity-5 blur-[50px] transition-opacity duration-500 rounded-full" />
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          {card.label}
                        </p>
                        <div className="w-10 h-10 rounded-[1rem] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center shadow-sm">
                          <card.icon className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                      </div>
                      <p className="text-4xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
                        {card.value}
                      </p>
                      {card.progress !== undefined && (
                        <div className="w-full h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${card.progress}%` }} />
                        </div>
                      )}
                      <p className="text-xs font-semibold text-[var(--text-secondary)]">{card.hint}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Grid & Filters */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-[1.5rem] glass-card border border-[var(--border)] relative z-20">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Query nodes by signature..."
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {['all', 'image', 'document', 'media', 'other'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          category === cat
                            ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-md'
                            : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Node Listing */}
                {filteredFiles.length === 0 ? (
                  <div className="p-16 border border-dashed border-[var(--border-strong)] rounded-[2.5rem] text-center bg-[var(--bg-base)]/30 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-muted)] flex items-center justify-center mx-auto mb-6">
                      <FolderOpen className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-[var(--text-primary)] mb-2">No nodes located</h3>
                    <p className="text-sm text-[var(--text-secondary)] font-medium max-w-sm mx-auto mb-8">
                      {search || category !== 'all' 
                        ? 'Adjust query parameters to expand search scope.' 
                        : 'Your workspace is empty. Deploy a payload to initialize tracking.'}
                    </p>
                    {(!search && category === 'all') && (
                      <Link to="/upload" className="btn-primary !rounded-full px-8 py-3.5 text-sm">
                        <Plus className="w-4 h-4" />
                        <span>Deploy First Payload</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 rounded-[2rem] glass-card border border-[var(--border-strong)] flex flex-col gap-5 hover:border-[var(--accent)]/50 transition-colors bg-[var(--bg-base)]/80 relative overflow-hidden group"
                      >
                        {file.password && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full blur-xl pointer-events-none" />}
                        
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-[1rem] bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[var(--accent)]/5 transition-colors">
                            <File className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">
                              {file.type.split('/')[1] || 'BIN'} &bull; {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-y border-[var(--border)]">
                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Fetches</span>
                            <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              <Download className="w-3.5 h-3.5 text-[var(--accent)]" /> {file.downloads_count}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-[var(--border)]" />
                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Status</span>
                            <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" /> {getRemainingTime(file.expires_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleCopyLink(file.slug)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-primary)] transition-all shadow-sm"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy Link
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            disabled={deletingId === file.id}
                            className="flex items-center justify-center p-3 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shrink-0"
                            aria-label="Delete file"
                          >
                            {deletingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Block */}
              <div className="mt-16 p-8 sm:p-10 rounded-[2.5rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-base)] shadow-xl max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-strong)] flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-[var(--text-primary)]" />
                  </div>
                  <h3 className="text-2xl font-extrabold font-display text-[var(--text-primary)]">Key Rotation</h3>
                  <p className="text-sm text-[var(--text-secondary)] font-medium mt-2">Cycle your master cryptographic signature.</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Signature (Min 8 chars)"
                        disabled={updatingPassword}
                        className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-xl pl-4 pr-12 py-3.5 focus:border-[var(--accent)] transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Signature"
                      disabled={updatingPassword}
                      className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-3.5 focus:border-[var(--accent)] transition-colors font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword || !newPassword || !confirmPassword}
                    className="w-full btn-ghost !py-4 !rounded-xl !bg-[var(--text-primary)] !text-[var(--bg-base)] hover:scale-[1.02] border-none"
                  >
                    {updatingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Commit Rotation</span>}
                  </button>
                </form>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutContainer>
  );
}

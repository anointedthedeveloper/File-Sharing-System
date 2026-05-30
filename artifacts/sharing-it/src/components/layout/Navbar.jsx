import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, UploadCloud, ChevronDown, Wifi, HelpCircle, Info, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import logoImg from '../../assets/logo.png';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setProfile(session?.profile || null);
    };
    syncSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setProfile(session?.profile || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showToast('Logged out successfully.', 'success');
      navigate('/');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const navLinks = [
    { name: 'Upload', path: '/upload', icon: <UploadCloud className="w-4 h-4" /> },
    { name: 'Quick Share', path: '/quick-share', icon: <Wifi className="w-4 h-4" /> },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
    { name: 'How It Works', path: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 pt-4 px-4 sm:px-6 lg:px-8`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-500 border ${
          scrolled
            ? 'bg-[var(--glass)] shadow-premium backdrop-blur-2xl border-[var(--border-strong)] py-2 px-4'
            : 'bg-transparent border-transparent py-4 px-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group shrink-0 relative z-20">
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05, rotate: -2 }}
                src={logoImg}
                alt="Sharing It"
                className="h-8 sm:h-9 w-auto object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'text-white shadow-glow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full gradient-bg z-0"
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {link.icon}
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all shadow-sm group"
                >
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[var(--bg-base)] shadow-sm"
                  />
                  <span className="text-sm font-bold text-[var(--text-primary)] max-w-[120px] truncate">
                    {profile?.full_name || 'My Account'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 group-hover:text-[var(--text-primary)] ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} aria-hidden />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute right-0 mt-3 w-64 z-20 rounded-2xl p-2 glass-card border-[var(--border-strong)] shadow-premium-hover backdrop-blur-3xl"
                      >
                        <div className="px-4 py-3 mb-2 rounded-xl bg-[var(--bg-muted)]/50">
                          <p className="text-[10px] uppercase tracking-widest font-extrabold text-[var(--text-muted)] mb-1">Signed in as</p>
                          <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl hover:bg-[var(--bg-muted)] text-[var(--text-primary)] transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-[var(--accent)]" />
                            Dashboard
                          </Link>
                          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-left group">
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-5 py-2.5 text-sm font-bold rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all">
                  Log In
                </Link>
                <Link to="/auth?tab=register" className="btn-primary text-sm !py-2.5 !px-6 !rounded-full group">
                  <span className="relative z-10 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden relative z-20">
            <button onClick={toggleTheme} className="p-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm" aria-label="Menu">
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden absolute top-[calc(100%+10px)] left-4 right-4 z-40 rounded-3xl glass-card border-[var(--border-strong)] shadow-premium-hover p-3"
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-colors ${
                    isActive(link.path)
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border)] px-2">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-3">
                    <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="" className="w-12 h-12 rounded-full border-2 border-[var(--border)]" />
                    <div className="truncate">
                      <p className="font-bold text-[var(--text-primary)] text-lg">{profile?.full_name || 'My Account'}</p>
                      <p className="text-xs font-semibold text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-muted)] font-bold text-sm text-[var(--text-primary)]">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-sm">
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/auth" onClick={() => setIsOpen(false)} className="flex justify-center py-3.5 rounded-2xl text-sm font-bold border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm">
                    Log In
                  </Link>
                  <Link to="/auth?tab=register" onClick={() => setIsOpen(false)} className="btn-primary text-sm justify-center !py-3.5 !rounded-2xl flex-1">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

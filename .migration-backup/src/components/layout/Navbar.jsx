import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, UploadCloud, ChevronDown, HelpCircle, Sparkles, Radio } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showToast('Logged out successfully', 'success');
      navigate('/');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const navLinks = [
    { name: 'Upload', path: '/upload', icon: <UploadCloud className="w-4 h-4" /> },
    { name: 'Quick Share', path: '/quick-share', icon: <Radio className="w-4 h-4" /> },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b shadow-premium backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
      style={{
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        background: scrolled ? 'var(--glass)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.img
              whileHover={{ scale: 1.03 }}
              src={logoImg}
              alt="Sharing It"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center p-1 rounded-2xl gap-0.5" style={{ background: 'color-mix(in srgb, var(--bg-muted) 60%, transparent)', border: '1px solid var(--border)' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path) ? '' : 'hover:opacity-80'
                }`}
                style={{
                  color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive(link.path) ? 'var(--glass)' : 'transparent',
                }}
              >
                <span className="flex items-center gap-1.5">
                  {link.icon}
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-200"
              style={{ border: '1px solid var(--border)', background: 'var(--glass)', color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full gradient-bg shadow-glow text-white"
                >
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden xl:block">
                    {profile?.full_name || 'Account'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} aria-hidden />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-56 z-20 rounded-2xl p-2 shadow-premium-hover glass-card"
                      >
                        <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>Signed in</p>
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/upload" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                          <UploadCloud className="w-4 h-4" /> Upload
                        </Link>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-left">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-4 py-2 text-sm font-semibold rounded-xl transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                  Log In
                </Link>
                <Link to="/auth?tab=register" className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 rounded-xl" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }} aria-label="Menu">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--glass)' }}
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold"
                  style={{
                    color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive(link.path) ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                  }}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="" className="w-10 h-10 rounded-xl" />
                      <div className="truncate">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{profile?.full_name || 'User'}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
                      <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 text-left">
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-1">
                    <Link to="/auth" className="flex justify-center py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Log In</Link>
                    <Link to="/auth?tab=register" className="btn-primary text-sm justify-center !rounded-xl">Get Started</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

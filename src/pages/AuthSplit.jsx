import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Send, Loader2, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/hero.png';
import symbolImg from '../assets/symbol.png';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTheme } from '../context/ThemeContext';

export default function AuthSplit() {
  const [isLogin, setIsLogin] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  // Slideshow images and copy
  const slides = [
    {
      img: heroImg,
      title: 'Secure file delivery in milliseconds.',
      desc: 'Experience the ultimate workspace file routing. Fully encrypted, beautifully intuitive.'
    },
    {
      img: symbolImg,
      title: 'Share instantly, anywhere.',
      desc: 'Send files to anyone, on any device, with a single link. No app required.'
    },
    {
      img: heroImg,
      title: 'Your data, your control.',
      desc: 'Privacy-first design. You decide who accesses your files.'
    }
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  // Auto-advance slideshow every 4s
  React.useEffect(() => {
    const t = setTimeout(() => setSlideIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearTimeout(t);
  }, [slideIdx]);

  const shellClass = isDark
    ? 'bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100'
    : 'bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eef4ff_100%)] text-slate-900';

  const inputClass = isDark
    ? 'w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/70 placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all hover:border-white/20'
    : 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all hover:border-blue-300';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen w-full ${shellClass} select-none font-sans`}>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl animate-pulse" />
          <div className="absolute bottom-8 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-x-8 top-1/3 h-24 rounded-full bg-slate-400/5 blur-2xl" />
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className={`relative overflow-hidden rounded-[2rem] border ${isDark ? 'border-white/10 bg-slate-900/75' : 'border-slate-200 bg-white/95'} p-8 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl hover:border-white/20 transition-colors duration-300`}>
                <div className={`pointer-events-none absolute inset-0 rounded-[2rem] ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.08),_transparent_25%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.05),_transparent_25%)]'}`} />

                {/* Header */}
                <div className="space-y-2 mb-8 relative z-10">
                  <motion.h1
                    className="text-3xl font-extrabold font-display leading-tight"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {isLogin ? 'Welcome back' : 'Create your workspace'}
                  </motion.h1>
                  <motion.p
                    className={`text-sm ${isDark ? 'text-slate-300/90' : 'text-slate-500'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isLogin ? 'Enter your credentials to access your secure workspace.' : 'Start with a free account and unlock larger sharing limits.'}
                  </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        key="fullName-field"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        className="space-y-1.5"
                      >
                        <label className={`text-sm font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>Full name</span>
                        </label>
                        <motion.input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Dev"
                          required={!isLogin}
                          disabled={loading}
                          whileFocus={{ scale: 1.01 }}
                          className={inputClass}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className={`text-sm font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>Email address</span>
                    </label>
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      whileFocus={{ scale: 1.01 }}
                      className={inputClass}
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className={`text-sm font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Password</span>
                    </label>
                    <motion.input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      required
                      disabled={loading}
                      whileFocus={{ scale: 1.01 }}
                      className={inputClass}
                    />
                  </motion.div>

                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 shadow-[0_18px_32px_-12px_rgba(56,189,248,0.55)] hover:shadow-[0_20px_38px_-12px_rgba(56,189,248,0.75)] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>{isLogin ? 'Sign In' : 'Create Free Account'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                <AnimatePresence>
                  {isLogin && (
                    <motion.button
                      type="button"
                      disabled={loading}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold border ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'} transition-all disabled:opacity-50`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Sign in with email code or link</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Bottom toggle */}
                <motion.div
                  className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'} flex items-center justify-center gap-1.5 text-xs`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className={isDark ? 'text-slate-300/90' : 'text-slate-500'}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  </span>
                  <motion.button
                    onClick={() => setIsLogin(!isLogin)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-semibold text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-4 transition-all cursor-pointer"
                  >
                    {isLogin ? 'Register' : 'Log In'}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Promotional content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className={`relative overflow-hidden rounded-[2rem] border ${isDark ? 'border-white/10 bg-slate-900/75' : 'border-slate-200 bg-white/95'} p-8 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl`}>
                <div className={`pointer-events-none absolute inset-0 rounded-[2rem] ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.08),_transparent_25%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.05),_transparent_25%)]'}`} />

                {/* Brand */}
                <div className="relative z-10 flex items-center gap-2 mb-6">
                  <img src={symbolImg} alt="Brand Symbol" className="w-10 h-10 rounded-lg shadow-md bg-blue-600 p-1" />
                  <span className={`font-semibold tracking-wide text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Sharing It?</span>
                </div>

                {/* Slideshow */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                  <motion.img
                    key={slideIdx}
                    src={slides[slideIdx].img}
                    alt="Slide visual"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-48 h-48 object-contain rounded-2xl shadow-2xl"
                  />
                  <motion.h3
                    key={`title-${slideIdx}`}
                    className={`text-xl font-semibold leading-snug text-center ${isDark ? 'text-white' : 'text-slate-900'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {slides[slideIdx].title}
                  </motion.h3>
                  <motion.p
                    key={`desc-${slideIdx}`}
                    className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm leading-relaxed text-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slides[slideIdx].desc}
                  </motion.p>

                  {/* Slideshow dots */}
                  <div className="flex gap-2 justify-center mt-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlideIdx(i)}
                        className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${i === slideIdx ? 'bg-blue-500 border-blue-500 scale-110' : 'bg-transparent border-slate-400 hover:border-blue-400'}`}
                        aria-label={`Go to slide ${i+1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

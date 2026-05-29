import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Send } from 'lucide-react';
import heroImg from '../assets/hero.png';
import symbolImg from '../assets/symbol.png';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AmbientBackground from '../components/layout/AmbientBackground';
import Slideshow from '../components/ui/Slideshow';
import { ButtonLoader } from '../components/ui/Loader';
export default function AuthSplit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(() => searchParams.get('tab') !== 'register');

  useEffect(() => {
    setIsLogin(searchParams.get('tab') !== 'register');
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const promoSlides = [
    {
      img: heroImg,
      title: 'Secure file delivery in milliseconds.',
      desc: 'Encrypted routing with a workspace that feels as fast as it looks.',
    },
    {
      img: symbolImg,
      title: 'Share instantly, anywhere.',
      desc: 'One link. Any device. No app install required for recipients.',
    },
    {
      img: heroImg,
      title: 'Your data, your control.',
      desc: 'Privacy-first design — you decide who accesses your files and when they expire.',
    },
  ].map((s) => ({
    content: (
      <div className="flex flex-col items-center justify-center p-8 md:p-10 text-center space-y-5 min-h-[360px]">
        <motion.img
          key={s.title}
          src={s.img}
          alt=""
          className="w-44 h-44 object-contain rounded-2xl drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        />
        <h3 className="text-xl font-bold font-display leading-snug" style={{ color: 'var(--text-primary)' }}>
          {s.title}
        </h3>
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {s.desc}
        </p>
      </div>
    ),
  }));

  const panelClass = 'relative overflow-hidden rounded-[2rem] glass-card p-6 md:p-8 w-full max-w-lg shadow-premium-hover';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen w-full select-none font-sans bg-grid-pattern">
      <AmbientBackground intensity="strong" />
      <Navbar />

      <main className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center relative py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center"
            >
              <div className={panelClass}>
                <div className="space-y-2 mb-8 relative z-10">
                  <span className="section-badge">{isLogin ? 'Welcome back' : 'Get started free'}</span>
                  <h1 className="text-3xl font-extrabold font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {isLogin ? 'Sign in to your workspace' : 'Create your workspace'}
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isLogin
                      ? 'Enter your credentials to access secure file history and larger uploads.'
                      : 'Free account unlocks 1GB uploads and a personal dashboard.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        Full name
                      </label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alex Dev" required={!isLogin} disabled={loading} className="form-input" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <Mail className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      Email
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} className="form-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <Lock className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      Password
                    </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="form-input" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary !py-4 !rounded-2xl min-h-[48px] disabled:opacity-50">
                    {loading ? (
                      <>
                        <ButtonLoader size="sm" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In' : 'Create Free Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {isLogin && (
                  <button type="button" disabled={loading} className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold btn-ghost !rounded-2xl">
                    <Send className="w-3.5 h-3.5" />
                    Sign in with email code or link
                  </button>
                )}

                <div className="mt-6 pt-4 flex items-center justify-center gap-1.5 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      navigate(`/auth?tab=${isLogin ? 'register' : 'login'}`);
                    }}
                    className="font-semibold gradient-text hover:underline"
                  >
                    {isLogin ? 'Register' : 'Log In'}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center"
            >
              <div className={`${panelClass} flex-1`}>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <img src={symbolImg} alt="" className="w-9 h-9 rounded-lg shadow-md p-0.5 gradient-bg" />
                  <span className="font-semibold font-display text-lg" style={{ color: 'var(--text-primary)' }}>Sharing It</span>
                </div>
                <Slideshow slides={promoSlides} variant="compact" interval={5000} className="relative z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

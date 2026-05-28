import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Loader2, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Auth() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Tab states
  const [isLogin, setIsLogin] = useState(() => {
    return searchParams.get('tab') !== 'register';
  });

  // Form parameters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync tab with search parameters
  useEffect(() => {
    setIsLogin(searchParams.get('tab') !== 'register');
  }, [searchParams]);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      showToast('Please fulfill all mandatory parameters.', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // Provide a friendlier message for the email confirmation case
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            showToast('Please confirm your email address before signing in. Check your inbox.', 'error');
          } else {
            throw error;
          }
          return;
        }

        showToast('Welcome back to Sharing It!', 'success');
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        // If session is immediately available, email confirmation is disabled — go straight to dashboard
        if (data.session) {
          showToast('Account successfully provisioned!', 'success');
          navigate('/dashboard');
        } else {
          // Email confirmation is required — show confirmation notice
          setConfirmed(true);
        }
      }
    } catch (e) {
      showToast(e.message || 'Authentication error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContainer
      title={isLogin ? 'Sign In - Sharing It' : 'Create Free Account - Sharing It'}
      description="Access your Sharing It dashboard to review download metrics, expiry parameters and shared histories."
    >
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 flex flex-col justify-center min-h-[80vh]">

        {/* Email confirmation success card */}
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center space-y-5"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Check Your Email</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We sent a confirmation link to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
                Click the link in the email to activate your account and sign in.
              </p>
            </div>
            <button
              onClick={() => { setConfirmed(false); setIsLogin(true); navigate('/auth?tab=login'); }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-glow"
            >
              Back to Sign In
            </button>
          </motion.div>
        ) : (
        /* Card Frame */
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 text-center relative overflow-hidden">

          {/* Header titles */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-400">
              {isLogin ? 'Access your dashboard parameters.' : 'Sign up to unlock larger size limits.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="fullName-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Dev"
                    required={!isLogin}
                    disabled={loading}
                    className="form-input text-sm py-3"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="form-input text-sm py-3"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Password *</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                disabled={loading}
                className="form-input text-sm py-3"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-all min-h-[48px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Authenticating session...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Free Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom toggle prompt */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/50 flex items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => {
                if (loading) return;
                setIsLogin(!isLogin);
                navigate(`/auth?tab=${isLogin ? 'register' : 'login'}`);
              }}
              className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer"
            >
              {isLogin ? 'Register' : 'Log In'}
            </button>
          </div>

        </div>
        )}

      </div>
    </LayoutContainer>
  );
}

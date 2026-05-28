import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle2, KeyRound, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmailOnce } from '../lib/email';
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
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingAuth, setPendingAuth] = useState(null);

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
  const redirectTo = `${window.location.origin}/dashboard`;

  const sendPasswordlessLogin = async () => {
    if (!email) {
      showToast('Enter your email address first.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo
        }
      });

      if (error) throw error;

      setPendingAuth({ email, type: 'email' });
      setConfirmed(true);
      showToast('We sent a secure sign-in code and link.', 'success');
    } catch (e) {
      showToast(e.message || 'Could not send sign-in code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!pendingAuth?.email || !verificationCode.trim()) {
      showToast('Enter the verification code from your email.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingAuth.email,
        token: verificationCode.trim(),
        type: pendingAuth.type
      });

      if (error) throw error;

      sendWelcomeEmailOnce().catch(() => {});
      showToast('Email verified. You are signed in.', 'success');
      navigate('/dashboard');
    } catch (e) {
      showToast(e.message || 'Invalid or expired verification code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!pendingAuth?.email) return;

    setLoading(true);
    try {
      const { error } = pendingAuth.type === 'signup'
        ? await supabase.auth.resend({
            type: 'signup',
            email: pendingAuth.email,
            options: { emailRedirectTo: redirectTo }
          })
        : await supabase.auth.signInWithOtp({
            email: pendingAuth.email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: redirectTo
            }
          });

      if (error) throw error;
      showToast('Verification email sent again.', 'success');
    } catch (e) {
      showToast(e.message || 'Could not resend verification email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      showToast('Please fulfill all mandatory parameters.', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // Provide a friendlier message for the email confirmation case
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            showToast('Verify your email with the code/link first, or use email code sign in.', 'error');
          } else {
            throw error;
          }
          return;
        }

        sendWelcomeEmailOnce().catch(() => {});
        showToast('Welcome back to Sharing It!', 'success');
        navigate('/dashboard');
      } else {
        const { data: existingProfile, error: existingProfileError } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', email.trim())
          .maybeSingle();

        if (existingProfileError) throw existingProfileError;
        if (existingProfile) {
          showToast('An account with this email already exists. Please sign in instead.', 'warning');
          setIsLogin(true);
          navigate('/auth?tab=login');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        // If session is immediately available, email confirmation is disabled — go straight to dashboard
        if (data.session) {
          sendWelcomeEmailOnce().catch(() => {});
          showToast('Account successfully provisioned!', 'success');
          navigate('/dashboard');
        } else {
          // Email confirmation is required — show confirmation notice
          setPendingAuth({ email, type: 'signup' });
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
      title={isLogin ? 'Sign In to Anobyte Software - Secure File Sharing' : 'Create Free Account - Anobyte Software for Transfer Files Online'}
      description="Create an account or sign in to manage secure file sharing, shared files, transfer files online, and how to share file links with confidence."
    >
      <div className="relative max-w-md mx-auto px-4 py-16 sm:py-24 flex flex-col justify-center min-h-[80vh]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute inset-x-8 top-1/3 h-24 rounded-full bg-slate-400/5 blur-2xl" />
        </div>

        {/* Email verification card */}
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-[2rem] border border-white/10 bg-slate-900/75 text-center space-y-5 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 shadow-[0_18px_40px_-18px_rgba(56,189,248,0.85)] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold font-display text-white">Verify Your Email</h1>
              <p className="text-sm text-slate-300/90 leading-relaxed">
                We sent a code and secure link to <span className="font-semibold text-blue-700 dark:text-blue-300">{pendingAuth?.email || email}</span>.
                Open the link or enter the code below to continue.
              </p>
            </div>
            <form onSubmit={verifyCode} className="space-y-3 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verification Code</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Paste 6-digit code"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] text-slate-100 shadow-inner shadow-slate-950/70 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 shadow-[0_18px_32px_-12px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-12px_rgba(56,189,248,0.7)] disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Verify and Continue</span>
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={resendVerification}
                disabled={loading}
                className="py-3 rounded-2xl text-xs font-semibold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all"
              >
                Resend Code
              </button>
              <button
                onClick={() => { setConfirmed(false); setPendingAuth(null); setVerificationCode(''); setIsLogin(true); navigate('/auth?tab=login'); }}
                disabled={loading}
                className="py-3 rounded-2xl text-xs font-semibold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        ) : (
        /* Card Frame */
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 text-center shadow-[0_24px_80px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.08),_transparent_25%)]" />

          {/* Header titles */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white leading-tight">
              {isLogin ? 'Welcome back' : 'Create your workspace'}
            </h1>
            <p className="text-sm text-slate-300/90">
              {isLogin ? 'Enter your credentials to access your secure workspace.' : 'Start with a free account and unlock larger sharing limits.'}
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
                  <label className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-300" />
                    <span>Full name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Dev"
                    required={!isLogin}
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/70 placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-300" />
                <span>Email address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/70 placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-300" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/70 placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/35 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 shadow-[0_18px_32px_-12px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-12px_rgba(56,189,248,0.75)] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
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

          {isLogin && (
            <button
              type="button"
              onClick={sendPasswordlessLogin}
              disabled={loading}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold text-slate-100 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sign in with email code or link</span>
            </button>
          )}

          {/* Bottom toggle prompt */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-300/90">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => {
                if (loading) return;
                setIsLogin(!isLogin);
                navigate(`/auth?tab=${isLogin ? 'register' : 'login'}`);
              }}
              className="font-semibold text-blue-300 hover:text-blue-100 underline decoration-blue-400/30 underline-offset-4 transition-all cursor-pointer"
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

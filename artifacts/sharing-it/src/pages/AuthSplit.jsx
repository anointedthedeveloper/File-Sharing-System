import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, Send, Shield, Zap, Share2, 
  QrCode, Clock, KeyRound, CheckCircle2, AlertCircle, Command
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AmbientBackground from '../components/layout/AmbientBackground';
import Slideshow from '../components/ui/Slideshow';
import { ButtonLoader } from '../components/ui/Loader';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmailOnce } from '../lib/email';
import { logAuthError, getAuthErrorMessage } from '../lib/authErrors';

const FEATURE_SLIDES = [
  {
    icon: Zap,
    title: 'Kinetic deployment',
    desc: 'Bypass friction. Secure links generated instantly on drop.',
  },
  {
    icon: Shield,
    title: 'Fortified protocol',
    desc: 'Mandatory encryption, optional passkeys. Total sovereignty.',
  },
  {
    icon: Clock,
    title: 'Ephemeral presence',
    desc: 'Nodes self-destruct on a timer. Leaving absolutely zero trace.',
  },
];

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-sm"
      role="alert"
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-semibold leading-relaxed">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-70 hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 rotate-45" />
        </button>
      )}
    </motion.div>
  );
}

export default function AuthSplit() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabIsLogin = searchParams.get('tab') !== 'register';
  const [isLogin, setIsLogin] = useState(tabIsLogin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingAuth, setPendingAuth] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const redirectTo = `${window.location.origin}/dashboard`;

  useEffect(() => {
    setIsLogin(tabIsLogin);
    setAuthError('');
  }, [tabIsLogin]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) navigate('/dashboard');
      } catch (error) {
        logAuthError('session_check', error);
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuthFailure = (context, error, toastFallback) => {
    logAuthError(context, error, { email: email?.replace(/(.{2}).+(@.+)/, '$1***$2') });
    const message = getAuthErrorMessage(error, toastFallback);
    setAuthError(message);
    showToast(message, 'error');
  };

  const sendPasswordlessLogin = async () => {
    if (!email) {
      showToast('Input email parameters.', 'warning');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
      });
      if (error) throw error;

      setPendingAuth({ email, type: 'email' });
      setConfirmed(true);
      showToast('Magic link dispatched to inbox.', 'success');
    } catch (error) {
      handleAuthFailure('passwordless_send', error, 'Transmission failed.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!pendingAuth?.email || !verificationCode.trim()) {
      showToast('Awaiting authorization code.', 'warning');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingAuth.email,
        token: verificationCode.trim(),
        type: pendingAuth.type,
      });
      if (error) throw error;

      sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
      showToast('Authorization successful.', 'success');
      navigate('/dashboard');
    } catch (error) {
      handleAuthFailure('verify_otp', error, 'Invalid token sequence.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!pendingAuth?.email) return;

    setLoading(true);
    setAuthError('');
    try {
      const { error } =
        pendingAuth.type === 'signup'
          ? await supabase.auth.resend({
              type: 'signup',
              email: pendingAuth.email,
              options: { emailRedirectTo: redirectTo },
            })
          : await supabase.auth.signInWithOtp({
              email: pendingAuth.email,
              options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
            });

      if (error) throw error;
      showToast('Token regenerated and dispatched.', 'success');
    } catch (error) {
      handleAuthFailure('resend_verification', error, 'Regeneration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password || (!isLogin && !fullName)) {
      showToast('Incomplete parameters.', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            handleAuthFailure('sign_in', error);
            return;
          }
          throw error;
        }

        sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
        showToast('System accessed.', 'success');
        navigate('/dashboard');
      } else {
        const { data: existingProfile, error: existingProfileError } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', email.trim())
          .maybeSingle();

        if (existingProfileError) throw existingProfileError;
        if (existingProfile) {
          showToast('Entity exists. Re-routing to auth.', 'warning');
          setIsLogin(true);
          navigate('/auth?tab=login');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        if (data.session) {
          sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
          showToast('Node initialized.', 'success');
          navigate('/dashboard');
        } else {
          setPendingAuth({ email, type: 'signup' });
          setConfirmed(true);
          showToast('Check inbox for activation token.', 'success');
        }
      }
    } catch (error) {
      handleAuthFailure(isLogin ? 'sign_in' : 'sign_up', error, 'Handshake denied.');
    } finally {
      setLoading(false);
    }
  };

  const featureSlides = FEATURE_SLIDES.map((item) => {
    const Icon = item.icon;
    return {
      content: (
        <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--accent)] opacity-10 blur-xl transition-opacity group-hover:opacity-20" />
            <Icon className="w-8 h-8 text-[var(--text-primary)] relative z-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ),
    };
  });

  const switchTab = (login) => {
    if (loading) return;
    setIsLogin(login);
    setAuthError('');
    setConfirmed(false);
    setPendingAuth(null);
    setVerificationCode('');
    navigate(`/auth?tab=${login ? 'login' : 'register'}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[var(--bg-base)]">
      <AmbientBackground intensity="strong" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:pr-10"
          >
            <div className="mb-10">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-6 shadow-sm">
                <Command className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h1 className="text-4xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-3">
                {confirmed ? 'Verify Access' : isLogin ? 'Authenticate' : 'Initialize'}
              </h1>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {confirmed 
                  ? 'A secure token has been dispatched.' 
                  : isLogin 
                    ? 'Enter credentials to access workspace.' 
                    : 'Deploy a personal workspace for larger limits.'}
              </p>
            </div>

            <div className="relative">
              {confirmed ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Target Address</p>
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{pendingAuth?.email || email}</p>
                  </div>

                  <AnimatePresence>
                    <ErrorBanner message={authError} onDismiss={() => setAuthError('')} />
                  </AnimatePresence>

                  <form onSubmit={verifyCode} className="space-y-5 text-left">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Auth Token</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="••••••"
                        disabled={loading}
                        className="form-input text-center text-xl font-mono tracking-[0.5em] py-4"
                      />
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary !py-4 !rounded-xl text-sm">
                      {loading ? <ButtonLoader size="sm" /> : <span>Verify Signature</span>}
                    </button>
                  </form>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <button type="button" onClick={resendVerification} disabled={loading} className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      Resend Token
                    </button>
                    <button type="button" onClick={() => { setConfirmed(false); setPendingAuth(null); setVerificationCode(''); switchTab(true); }} disabled={loading} className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      Abort
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  
                  <AnimatePresence>
                    <ErrorBanner message={authError} onDismiss={() => setAuthError('')} />
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          key="name"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Alias</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Operator Name"
                            required={!isLogin}
                            disabled={loading}
                            className="form-input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="comms@domain.com"
                        required
                        disabled={loading}
                        className="form-input"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Passkey</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        className="form-input font-mono"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="w-full btn-primary !py-4 !rounded-xl text-base tracking-wide mt-2">
                      {loading ? <ButtonLoader size="sm" /> : <span>{isLogin ? 'Initiate Handshake' : 'Deploy Workspace'}</span>}
                    </button>
                  </form>

                  {isLogin && (
                    <button
                      type="button"
                      onClick={sendPasswordlessLogin}
                      disabled={loading}
                      className="w-full py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] text-sm font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4 text-[var(--text-muted)]" />
                      Request Magic Link
                    </button>
                  )}

                  <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                    <span>{isLogin ? "Require clearance?" : 'Access existing node?'}</span>
                    <button type="button" onClick={() => switchTab(!isLogin)} className="font-bold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                      {isLogin ? 'Initialize' : 'Authenticate'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Visual Presentation Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block h-[600px] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-muted)] rounded-[3rem] border border-[var(--border-strong)] shadow-2xl overflow-hidden p-2">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
              <div className="w-full h-full rounded-[2.5rem] bg-[var(--bg-base)]/50 backdrop-blur-sm border border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                <Slideshow slides={featureSlides} variant="hero" interval={4000} className="w-full h-full" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
                  <span>AES-256</span>
                  <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                  <span>SOC-2</span>
                  <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                  <span>P2P</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

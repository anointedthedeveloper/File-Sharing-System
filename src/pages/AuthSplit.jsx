import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Send,
  Shield,
  Zap,
  Share2,
  QrCode,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
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
    title: 'Instant transfers',
    desc: 'Drop a file and get a secure link in seconds — no install, no friction.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Built-in protection',
    desc: 'Password gates, signed URLs, and auto-expiry keep shares under your control.',
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    icon: QrCode,
    title: 'QR & previews',
    desc: 'Scan to download on mobile. Preview images, PDFs, and media in-browser.',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    icon: Share2,
    title: 'Share anywhere',
    desc: 'One link works on every device. Guests upload up to 50MB; accounts get 1GB.',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Clock,
    title: 'Auto-expiring links',
    desc: 'Set 1 hour, 24 hours, 7 days, or wipe after first download.',
    accent: 'from-emerald-500 to-teal-600',
  },
];

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 p-4 rounded-2xl text-sm border"
      style={{
        background: 'color-mix(in srgb, #ef4444 8%, var(--bg-elevated))',
        borderColor: 'color-mix(in srgb, #ef4444 35%, var(--border))',
        color: 'var(--text-primary)',
      }}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-xs font-semibold opacity-60 hover:opacity-100 shrink-0">
          Dismiss
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
      showToast('Enter your email address first.', 'warning');
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
      showToast('We sent a secure sign-in code and link.', 'success');
    } catch (error) {
      handleAuthFailure('passwordless_send', error, 'Could not send sign-in code.');
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
    setAuthError('');
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingAuth.email,
        token: verificationCode.trim(),
        type: pendingAuth.type,
      });
      if (error) throw error;

      sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
      showToast('Email verified. You are signed in.', 'success');
      navigate('/dashboard');
    } catch (error) {
      handleAuthFailure('verify_otp', error, 'Invalid or expired verification code.');
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
      showToast('Verification email sent again.', 'success');
    } catch (error) {
      handleAuthFailure('resend_verification', error, 'Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password || (!isLogin && !fullName)) {
      showToast('Please fill in all required fields.', 'warning');
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
        showToast('Welcome back!', 'success');
        navigate('/dashboard');
      } else {
        const { data: existingProfile, error: existingProfileError } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', email.trim())
          .maybeSingle();

        if (existingProfileError) throw existingProfileError;
        if (existingProfile) {
          showToast('An account with this email already exists. Please sign in.', 'warning');
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
          showToast('Account created successfully!', 'success');
          navigate('/dashboard');
        } else {
          setPendingAuth({ email, type: 'signup' });
          setConfirmed(true);
          showToast('Check your email to verify your account.', 'success');
        }
      }
    } catch (error) {
      handleAuthFailure(isLogin ? 'sign_in' : 'sign_up', error, 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const featureSlides = FEATURE_SLIDES.map((item) => {
    const Icon = item.icon;
    return {
      content: (
        <div className="flex flex-col items-center justify-center p-8 md:p-10 text-center min-h-[320px] gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-glow-lg`}>
            <Icon className="w-10 h-10 text-white" strokeWidth={1.75} />
          </div>
          <div className="space-y-2 max-w-xs">
            <h3 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.desc}
            </p>
          </div>
        </div>
      ),
    };
  });

  const panelClass =
    'relative overflow-hidden rounded-[2rem] glass-card p-6 md:p-8 w-full shadow-premium-hover border';

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
    <div className="min-h-screen w-full font-sans bg-grid-pattern">
      <AmbientBackground />
      <Navbar />

      <main className="relative flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center py-10 px-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
            {/* Form column */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">
              <div className={panelClass} style={{ borderColor: 'var(--border)' }}>
                <div
                  className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-100"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 50% at 0% 0%, var(--mesh-1), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, var(--mesh-2), transparent 50%)',
                  }}
                />

                <div className="relative z-10">
                  {confirmed ? (
                    <div className="space-y-5 text-center">
                      <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>
                          Verify your email
                        </h1>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          We sent a code to{' '}
                          <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                            {pendingAuth?.email || email}
                          </span>
                          . Enter it below or use the link in your inbox.
                        </p>
                      </div>

                      <AnimatePresence>
                        <ErrorBanner message={authError} onDismiss={() => setAuthError('')} />
                      </AnimatePresence>

                      <form onSubmit={verifyCode} className="space-y-4 text-left">
                        <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <KeyRound className="w-3.5 h-3.5" />
                          Verification code
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="6-digit code"
                          disabled={loading}
                          className="form-input text-center text-lg font-semibold tracking-[0.3em]"
                        />
                        <button type="submit" disabled={loading} className="w-full btn-primary !py-4 !rounded-2xl">
                          {loading ? <ButtonLoader size="sm" /> : <ArrowRight className="w-4 h-4" />}
                          <span>Verify and continue</span>
                        </button>
                      </form>

                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={resendVerification} disabled={loading} className="btn-ghost !py-3 !text-xs !rounded-xl">
                          Resend code
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmed(false);
                            setPendingAuth(null);
                            setVerificationCode('');
                            switchTab(true);
                          }}
                          disabled={loading}
                          className="btn-ghost !py-3 !text-xs !rounded-xl"
                        >
                          Back to sign in
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-6">
                        <span className="section-badge">
                          <Sparkles className="w-3.5 h-3.5" />
                          {isLogin ? 'Welcome back' : 'Free account'}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {isLogin ? 'Sign in to Sharing It' : 'Create your workspace'}
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {isLogin
                            ? 'Access your dashboard, 1GB uploads, and share history.'
                            : 'Register for larger uploads and a personal file dashboard.'}
                        </p>
                      </div>

                      <AnimatePresence>
                        {authError && <ErrorBanner message={authError} onDismiss={() => setAuthError('')} />}
                      </AnimatePresence>

                      <form onSubmit={handleSubmit} className="space-y-4 text-left mt-4">
                        <AnimatePresence mode="wait">
                          {!isLogin && (
                            <motion.div
                              key="name"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-1.5 overflow-hidden"
                            >
                              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                Full name
                              </label>
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Alex Dev"
                                required={!isLogin}
                                disabled={loading}
                                className="form-input"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                            <Mail className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            className="form-input"
                            autoComplete="email"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                            <Lock className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            className="form-input"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                          />
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary !py-4 !rounded-2xl min-h-[48px]">
                          {loading ? (
                            <>
                              <ButtonLoader size="sm" />
                              <span>Please wait...</span>
                            </>
                          ) : (
                            <>
                              <span>{isLogin ? 'Sign in' : 'Create free account'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      {isLogin && (
                        <button
                          type="button"
                          onClick={sendPasswordlessLogin}
                          disabled={loading}
                          className="mt-3 w-full btn-ghost !py-3 !rounded-2xl text-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Sign in with email code or link
                        </button>
                      )}

                      <div
                        className="mt-6 pt-4 flex items-center justify-center gap-1.5 text-xs border-t"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                      >
                        <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                        <button type="button" onClick={() => switchTab(!isLogin)} className="font-semibold gradient-text hover:underline">
                          {isLogin ? 'Register' : 'Sign in'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Feature highlights — icons only */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex flex-col gap-4"
            >
              <div className={`${panelClass} flex-1 flex flex-col`} style={{ borderColor: 'var(--border)' }}>
                <div className="relative z-10 mb-2 px-2">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Why Sharing It
                  </p>
                  <h2 className="text-lg font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
                    Everything you need to share securely
                  </h2>
                </div>
                <Slideshow slides={featureSlides} variant="hero" interval={5500} className="relative z-10 flex-1" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: 'Encrypted' },
                  { icon: Zap, label: 'Fast' },
                  { icon: Clock, label: 'Auto-expire' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-card text-center"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

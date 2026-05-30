import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, Send, Shield, Zap, QrCode,
  Clock, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AmbientBackground from '../components/layout/AmbientBackground';
import { ButtonLoader } from '../components/ui/Loader';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { sendWelcomeEmailOnce } from '../lib/email';
import { logAuthError, getAuthErrorMessage } from '../lib/authErrors';
import logoImg from '../assets/logo.png';

function InputField({ label, type, value, onChange, placeholder, required, disabled, autoComplete, icon: Icon }) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="relative group/field">
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 font-semibold ${
          focused || value
            ? '-top-2.5 text-[10px] uppercase tracking-widest px-1.5 bg-[var(--bg-muted)] rounded text-[var(--accent)]'
            : 'top-3.5 text-sm text-[var(--text-muted)]'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-3.5 top-3.5 w-4 h-4 transition-colors duration-200 ${focused ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />}
        <input
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={focused ? placeholder : ''}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full py-3.5 pr-4 rounded-xl border bg-[var(--bg-muted)] text-[var(--text-primary)] text-sm font-medium outline-none transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${focused
              ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-glow)] bg-[var(--bg-elevated)]'
              : 'border-[var(--border)] hover:border-[var(--border-strong)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500"
      role="alert"
    >
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="flex-1 text-xs font-semibold leading-relaxed">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">&times;</button>
      )}
    </motion.div>
  );
}

const PERKS = [
  { icon: Zap, text: 'Upload files and share links in seconds' },
  { icon: Shield, text: 'Password protection & auto-expiry included' },
  { icon: QrCode, text: 'QR code for every file you share' },
  { icon: Clock, text: 'Dashboard to manage and track your files' },
];

export default function AuthSplit() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabIsLogin = searchParams.get('tab') !== 'register';

  const [activeSide, setActiveSide] = useState(tabIsLogin ? 'login' : 'signup');
  const [hoveredSide, setHoveredSide] = useState(null);

  const [signup, setSignup] = useState({ name: '', email: '', password: '' });
  const [login, setLogin] = useState({ email: '', password: '' });

  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');

  const [signupPending, setSignupPending] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCodeVal] = useState('');
  const [verifyType, setVerifyType] = useState('signup');

  const redirectTo = `${window.location.origin}/dashboard`;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) navigate('/dashboard');
      } catch {}
    };
    checkUser();
  }, [navigate]);

  const handleAuthFailure = (setError, context, error, fallback) => {
    logAuthError(context, error);
    const msg = getAuthErrorMessage(error, fallback);
    setError(msg);
    showToast(msg, 'error');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (!signup.name || !signup.email || !signup.password) {
      setSignupError('Please fill in all fields.');
      return;
    }
    setSignupLoading(true);
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', signup.email.trim())
        .maybeSingle();

      if (existing) {
        setSignupError('An account with this email already exists. Please log in instead.');
        setActiveSide('login');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: signup.email.trim().toLowerCase(),
        password: signup.password,
        options: {
          emailRedirectTo: redirectTo,
          data: { full_name: signup.name },
        },
      });
      if (error) throw error;

      if (data.session) {
        sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
        showToast('Account created! Welcome to Sharing It.', 'success');
        navigate('/dashboard');
      } else {
        setVerifyEmail(signup.email);
        setVerifyType('signup');
        setSignupPending(true);
        showToast('Check your email for a confirmation code.', 'success');
      }
    } catch (error) {
      handleAuthFailure(setSignupError, 'sign_up', error, 'Something went wrong. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!login.email || !login.password) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: login.email, password: login.password });
      if (error) throw error;
      sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (error) {
      handleAuthFailure(setLoginError, 'sign_in', error, 'Incorrect email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!login.email) {
      setLoginError('Please enter your email address first.');
      return;
    }
    setMagicLoading(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: login.email,
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setVerifyEmail(login.email);
      setVerifyType('email');
      setLoginPending(true);
      showToast('Magic link sent! Check your inbox.', 'success');
    } catch (error) {
      handleAuthFailure(setLoginError, 'magic_link', error, 'Could not send magic link.');
    } finally {
      setMagicLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    const setLoading = verifyType === 'signup' ? setSignupLoading : setLoginLoading;
    const setError = verifyType === 'signup' ? setSignupError : setLoginError;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: verifyEmail,
        token: verifyCode.trim(),
        type: verifyType,
      });
      if (error) throw error;
      sendWelcomeEmailOnce().catch((err) => logAuthError('welcome_email', err));
      showToast('You\'re in! Welcome to Sharing It.', 'success');
      navigate('/dashboard');
    } catch (error) {
      handleAuthFailure(setError, 'verify_otp', error, 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const focusedSide = hoveredSide || activeSide;
  const signupWidth = focusedSide === 'signup' ? '55%' : focusedSide === 'login' ? '45%' : '50%';
  const loginWidth = focusedSide === 'login' ? '55%' : focusedSide === 'signup' ? '45%' : '50%';

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[var(--bg-base)]">
      <AmbientBackground intensity="strong" />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28 relative z-10">

        {/* Mobile: stacked tabs */}
        <div className="w-full max-w-md mx-auto lg:hidden">
          <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1 mb-8">
            {['signup', 'login'].map((side) => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeSide === side
                    ? 'gradient-bg text-white shadow-glow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {side === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSide === 'signup' ? (
              <motion.div key="signup-mobile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <SignupForm
                  signup={signup}
                  setSignup={setSignup}
                  loading={signupLoading}
                  error={signupError}
                  setError={setSignupError}
                  pending={signupPending}
                  verifyEmail={verifyEmail}
                  verifyCode={verifyCode}
                  setVerifyCode={setVerifyCodeVal}
                  onSubmit={handleSignup}
                  onVerify={handleVerify}
                  onCancel={() => setSignupPending(false)}
                />
              </motion.div>
            ) : (
              <motion.div key="login-mobile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <LoginForm
                  login={login}
                  setLogin={setLogin}
                  loading={loginLoading}
                  magicLoading={magicLoading}
                  error={loginError}
                  setError={setLoginError}
                  pending={loginPending}
                  verifyEmail={verifyEmail}
                  verifyCode={verifyCode}
                  setVerifyCode={setVerifyCodeVal}
                  onSubmit={handleLogin}
                  onVerify={handleVerify}
                  onMagicLink={handleMagicLink}
                  onCancel={() => setLoginPending(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: true side-by-side split */}
        <div
          className="hidden lg:flex w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border border-[var(--border-strong)] min-h-[620px] relative"
          style={{ background: 'var(--bg-elevated)' }}
        >
          {/* Sign Up — LEFT */}
          <motion.div
            animate={{ width: signupWidth }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            onHoverStart={() => setHoveredSide('signup')}
            onHoverEnd={() => setHoveredSide(null)}
            onClick={() => setActiveSide('signup')}
            className={`relative flex flex-col justify-center p-10 xl:p-14 cursor-default transition-all duration-500 border-r border-[var(--border)] ${
              activeSide !== 'signup' ? 'opacity-60' : 'opacity-100'
            }`}
            style={{ background: activeSide === 'signup' ? 'var(--bg-muted)' : 'var(--bg-elevated)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3 h-3" /> New here?
                </span>
                <h2 className="text-3xl xl:text-4xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-2">
                  Create your account
                </h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  It's free. Get a dashboard, larger uploads, and more.
                </p>
              </div>

              <SignupForm
                signup={signup}
                setSignup={setSignup}
                loading={signupLoading}
                error={signupError}
                setError={setSignupError}
                pending={signupPending}
                verifyEmail={verifyEmail}
                verifyCode={verifyCode}
                setVerifyCode={setVerifyCodeVal}
                onSubmit={handleSignup}
                onVerify={handleVerify}
                onCancel={() => setSignupPending(false)}
              />

              <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-3">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-xs font-semibold text-[var(--text-secondary)]">
                    <div className="w-6 h-6 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Central divider with logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              animate={{ rotate: focusedSide === 'signup' ? -10 : focusedSide === 'login' ? 10 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-14 h-14 rounded-2xl glass-card border-[var(--border-strong)] shadow-premium flex items-center justify-center"
            >
              <img src={logoImg} alt="Sharing It" className="w-9 h-9 object-contain" />
            </motion.div>
          </div>

          {/* Log In — RIGHT */}
          <motion.div
            animate={{ width: loginWidth }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            onHoverStart={() => setHoveredSide('login')}
            onHoverEnd={() => setHoveredSide(null)}
            onClick={() => setActiveSide('login')}
            className={`relative flex flex-col justify-center p-10 xl:p-14 cursor-default transition-all duration-500 ${
              activeSide !== 'login' ? 'opacity-60' : 'opacity-100'
            }`}
            style={{ background: activeSide === 'login' ? 'var(--bg-muted)' : 'var(--bg-elevated)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
            <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
                  <CheckCircle2 className="w-3 h-3" /> Welcome back
                </span>
                <h2 className="text-3xl xl:text-4xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-2">
                  Log in
                </h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  Access your dashboard and file history.
                </p>
              </div>

              <LoginForm
                login={login}
                setLogin={setLogin}
                loading={loginLoading}
                magicLoading={magicLoading}
                error={loginError}
                setError={setLoginError}
                pending={loginPending}
                verifyEmail={verifyEmail}
                verifyCode={verifyCode}
                setVerifyCode={setVerifyCodeVal}
                onSubmit={handleLogin}
                onVerify={handleVerify}
                onMagicLink={handleMagicLink}
                onCancel={() => setLoginPending(false)}
              />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SignupForm({ signup, setSignup, loading, error, setError, pending, verifyEmail, verifyCode, setVerifyCode, onSubmit, onVerify, onCancel }) {
  if (pending) {
    return <VerifyForm email={verifyEmail} code={verifyCode} setCode={setVerifyCode} onSubmit={onVerify} loading={loading} onCancel={onCancel} />;
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AnimatePresence>
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      </AnimatePresence>
      <InputField
        label="Full Name"
        type="text"
        value={signup.name}
        onChange={(e) => setSignup({ ...signup, name: e.target.value })}
        placeholder="Your name"
        required
        disabled={loading}
        icon={User}
        autoComplete="name"
      />
      <InputField
        label="Email Address"
        type="email"
        value={signup.email}
        onChange={(e) => setSignup({ ...signup, email: e.target.value })}
        placeholder="you@example.com"
        required
        disabled={loading}
        icon={Mail}
        autoComplete="email"
      />
      <InputField
        label="Password"
        type="password"
        value={signup.password}
        onChange={(e) => setSignup({ ...signup, password: e.target.value })}
        placeholder="At least 8 characters"
        required
        disabled={loading}
        icon={Lock}
        autoComplete="new-password"
      />
      <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5 !rounded-xl text-sm mt-2">
        {loading ? <ButtonLoader size="sm" /> : <span className="flex items-center justify-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
      </button>
    </form>
  );
}

function LoginForm({ login, setLogin, loading, magicLoading, error, setError, pending, verifyEmail, verifyCode, setVerifyCode, onSubmit, onVerify, onMagicLink, onCancel }) {
  if (pending) {
    return <VerifyForm email={verifyEmail} code={verifyCode} setCode={setVerifyCode} onSubmit={onVerify} loading={loading} onCancel={onCancel} />;
  }
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      </AnimatePresence>
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
          placeholder="you@example.com"
          required
          disabled={loading || magicLoading}
          icon={Mail}
          autoComplete="email"
        />
        <InputField
          label="Password"
          type="password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          placeholder="Your password"
          required
          disabled={loading || magicLoading}
          icon={Lock}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading || magicLoading} className="w-full btn-primary !py-3.5 !rounded-xl text-sm">
          {loading ? <ButtonLoader size="sm" /> : <span className="flex items-center justify-center gap-2">Log In <ArrowRight className="w-4 h-4" /></span>}
        </button>
      </form>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <button
        type="button"
        onClick={onMagicLink}
        disabled={loading || magicLoading}
        className="w-full py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] text-sm font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {magicLoading ? <ButtonLoader size="sm" /> : <><Send className="w-4 h-4 text-[var(--text-muted)]" /> Send Magic Link</>}
      </button>
    </div>
  );
}

function VerifyForm({ email, code, setCode, onSubmit, loading, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">Check your email</p>
          <p className="text-xs font-medium opacity-80 mt-0.5">We sent a 6-digit code to <strong>{email}</strong></p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Confirmation Code</label>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            disabled={loading}
            maxLength={6}
            className="w-full py-3.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-center text-2xl font-mono tracking-[0.5em] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] transition-all"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5 !rounded-xl text-sm">
          {loading ? <ButtonLoader size="sm" /> : 'Confirm Code'}
        </button>
      </form>
      <button type="button" onClick={onCancel} disabled={loading} className="w-full text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2">
        &larr; Go back
      </button>
    </motion.div>
  );
}

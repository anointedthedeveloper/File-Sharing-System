import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, UploadCloud, Shield, Share2, Zap, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function PageLoader({ message = 'Loading workspace...' }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
      style={{ background: isDark ? 'var(--bg-base)' : 'var(--bg-base)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-orb w-72 h-72 -top-20 -left-20 bg-blue-500/25" style={{ animationDelay: '0s' }} />
        <div className="ambient-orb w-96 h-96 bottom-0 right-0 bg-violet-500/20" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: 'var(--accent)',
            borderRightColor: 'color-mix(in srgb, var(--accent-secondary) 60%, transparent)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <UploadCloud className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </motion.div>
        </div>
      </div>

      <div className="text-center space-y-2 relative z-10">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {message}
        </p>
        <DotsLoader />
      </div>
    </motion.div>
  );
}

export function RouteLoader() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left"
      style={{ background: 'var(--gradient-brand)' }}
    />
  );
}

export function ButtonLoader({ size = 'sm' }) {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
      <Loader2 className={`${sizeClasses[size]} text-current`} />
    </motion.div>
  );
}

export function ProgressLoader({ progress = 0, size = 'md' }) {
  const sizeClasses = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' };
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="opacity-20" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.25 }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export function DotsLoader() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--accent)' }}
        />
      ))}
    </div>
  );
}

export function FileUploadLoader({ progress = 0, fileName = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 p-8 rounded-3xl glass-card max-w-sm w-full mx-auto"
    >
      <ProgressLoader progress={progress} size="lg" />
      <div className="text-center w-full space-y-2">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Uploading securely...
        </p>
        {fileName && (
          <p className="text-xs truncate max-w-[240px] mx-auto" style={{ color: 'var(--text-muted)' }}>
            {fileName}
          </p>
        )}
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-brand)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export function SuccessLoader() {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
      <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow-lg" style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}>
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
    </motion.div>
  );
}

export function FeatureLoader() {
  const icons = [UploadCloud, Shield, Share2, Zap];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((p) => (p + 1) % 4), 1800);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIndex];

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ duration: 0.35 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow gradient-bg"
        >
          <CurrentIcon className="w-8 h-8 text-white" />
        </motion.div>
      </AnimatePresence>
      <DotsLoader />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl glass-card space-y-4">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl glass-card">
          <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function OverlayLoader({ children, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] backdrop-blur-sm"
          style={{ background: 'color-mix(in srgb, var(--bg-base) 75%, transparent)' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

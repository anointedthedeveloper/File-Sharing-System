import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, UploadCloud, Shield, Share2, Zap, CheckCircle } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]">
      <div className="relative">
        {/* Animated background circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"
        />

        {/* Main loader */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full" />
          </motion.div>
          <div className="absolute">
            <UploadCloud className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ButtonLoader({ size = 'sm' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className={`${sizeClasses[size]} text-current`} />
    </motion.div>
  );
}

export function ProgressLoader({ progress = 0, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-700"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export function DotsLoader({ color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    sky: 'bg-sky-400',
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className={`w-3 h-3 rounded-full ${colorClasses[color]}`}
        />
      ))}
    </div>
  );
}

export function FileUploadLoader({ progress = 0 }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <UploadCloud className="w-16 h-16 text-blue-500/30" />
        </motion.div>
        <UploadCloud className="w-16 h-16 text-blue-500" />
      </div>
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-sm text-slate-300">{Math.round(progress)}%</span>
    </div>
  );
}

export function SuccessLoader() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="flex items-center justify-center"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute inset-0 w-20 h-20 bg-green-500/30 rounded-full blur-2xl"
        />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_20px_60px_-20px_rgba(34,197,94,0.5)]">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureLoader() {
  const icons = [UploadCloud, Shield, Share2, Zap];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIndex];

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 flex items-center justify-center shadow-[0_20px_60px_-20px_rgba(56,189,248,0.5)]">
          <CurrentIcon className="w-8 h-8 text-white" />
        </div>
      </motion.div>
    </div>
  );
}

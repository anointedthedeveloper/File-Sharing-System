import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 md:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal Toast Card Component
const ToastCard = ({ toast, onClose }) => {
  const { id, message, type } = toast;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  const bgStyles = {
    success: 'border-emerald-200/50 dark:border-emerald-900/50 bg-white/95 dark:bg-slate-900/95 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.1)]',
    error: 'border-rose-200/50 dark:border-rose-900/50 bg-white/95 dark:bg-slate-900/95 shadow-[0_4px_20px_-2px_rgba(244,63,94,0.1)]',
    info: 'border-blue-200/50 dark:border-blue-900/50 bg-white/95 dark:bg-slate-900/95 shadow-[0_4px_20px_-2px_rgba(59,130,246,0.1)]',
    warning: 'border-amber-200/50 dark:border-amber-900/50 bg-white/95 dark:bg-slate-900/95 shadow-[0_4px_20px_-2px_rgba(245,158,11,0.1)]'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-premium dark:shadow-premium-dark ${bgStyles[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

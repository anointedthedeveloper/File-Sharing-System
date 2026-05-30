import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

const dropVariants = {
  idle: { scale: 1, y: 0 },
  active: { scale: 1.02, y: -4 },
};

const floatVariants = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function AnimatedDropZone({
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  onFileChange,
  inputRef: externalRef,
  disabled,
  children,
  hint,
  maxLabel,
}) {
  const internalRef = useRef(null);
  const inputRef = externalRef || internalRef;

  return (
    <motion.div
      variants={dropVariants}
      animate={dragActive ? 'active' : 'idle'}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !disabled && (onClick ? onClick() : inputRef.current?.click())}
      className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 cursor-pointer select-none overflow-hidden touch-manipulation ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      }`}
      style={{
        borderColor: dragActive ? 'var(--accent)' : 'var(--border)',
        background: dragActive ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-elevated))' : 'var(--bg-elevated)',
      }}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={onFileChange} tabIndex={-1} aria-hidden />

      <AnimatePresence>
        {dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, var(--mesh-1), transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <motion.div variants={floatVariants} animate="animate" className="will-change-transform">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow"
            style={{ background: 'var(--gradient-brand)' }}
          >
            {dragActive ? <Sparkles className="w-7 h-7 text-white" /> : <Upload className="w-7 h-7 text-white" />}
          </div>
        </motion.div>

        {children || (
          <>
            <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              {dragActive ? 'Release to drop' : 'Drag & drop your file'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {hint || 'or tap to browse'}
            </p>
          </>
        )}

        {maxLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            {maxLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

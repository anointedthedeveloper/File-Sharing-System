import React from 'react';
import { motion } from 'framer-motion';

export default function AmbientBackground({ intensity = 'normal' }) {
  const scale = intensity === 'strong' ? 1.2 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05 * scale, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="ambient-orb w-[min(90vw,520px)] h-[min(90vw,520px)] -top-32 -left-24"
        style={{ background: 'var(--mesh-1)' }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="ambient-orb w-[min(70vw,400px)] h-[min(70vw,400px)] top-1/3 -right-20"
        style={{ background: 'var(--mesh-2)' }}
      />
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="ambient-orb w-[min(60vw,360px)] h-[min(60vw,360px)] bottom-0 left-1/3"
        style={{ background: 'var(--mesh-3)' }}
      />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function AmbientBackground({ intensity = 'normal' }) {
  const scale = intensity === 'strong' ? 1.3 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-grid-pattern" aria-hidden>
      <motion.div
        animate={{ 
          opacity: [0.3, 0.6, 0.3], 
          scale: [1, 1.1 * scale, 1],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="ambient-orb w-[min(100vw,700px)] h-[min(100vw,700px)] -top-40 -left-40"
        style={{ background: 'var(--mesh-1)' }}
      />
      <motion.div
        animate={{ 
          opacity: [0.2, 0.5, 0.2], 
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.05 * scale, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="ambient-orb w-[min(80vw,500px)] h-[min(80vw,500px)] top-1/4 -right-32"
        style={{ background: 'var(--mesh-2)' }}
      />
      <motion.div
        animate={{ 
          opacity: [0.15, 0.4, 0.15], 
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.1 * scale, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="ambient-orb w-[min(90vw,600px)] h-[min(90vw,600px)] -bottom-32 left-1/4"
        style={{ background: 'var(--mesh-3)' }}
      />
      {/* Particles effect overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
    </div>
  );
}

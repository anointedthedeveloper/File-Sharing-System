import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function Slideshow({
  slides,
  autoPlay = true,
  interval = 5500,
  className = '',
  variant = 'default',
  showCounter = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const goToPrevious = () => goToSlide((currentIndex - 1 + slides.length) % slides.length);
  const goToNext = () => goToSlide((currentIndex + 1) % slides.length);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const tick = 50;
    const step = (tick / interval) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentIndex((i) => (i + 1) % slides.length);
          return 0;
        }
        return p + step;
      });
    }, tick);

    return () => clearInterval(timer);
  }, [isPlaying, interval, slides.length, currentIndex]);

  const isCompact = variant === 'compact';
  const isHero = variant === 'hero';

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`relative overflow-hidden ${
          isHero
            ? 'rounded-[2rem] border min-h-[320px]'
            : isCompact
              ? 'rounded-2xl'
              : 'rounded-3xl border shadow-premium'
        }`}
        style={{
          borderColor: 'var(--border)',
          background: 'var(--glass)',
        }}
      >
        {isPlaying && slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 z-20 bg-black/10 dark:bg-white/10">
            <motion.div
              className="h-full"
              style={{ width: `${progress}%`, background: 'var(--gradient-brand)' }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: isHero ? 0.98 : 1, x: isHero ? 0 : 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: isHero ? 0.98 : 1, x: isHero ? 0 : -24 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            {slides[currentIndex].content}
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-10"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                background: index === currentIndex ? 'var(--accent)' : 'var(--border-strong)',
                boxShadow: index === currentIndex ? '0 0 12px var(--accent-glow)' : 'none',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {showCounter && slides.length > 1 && (
        <p className="text-center mt-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {slides.length}
        </p>
      )}
    </div>
  );
}

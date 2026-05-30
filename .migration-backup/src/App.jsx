import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader } from './components/ui/Loader';

import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import AuthSplit from './pages/AuthSplit';
import Share from './pages/Share';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Unsubscribe from './pages/Unsubscribe';
import FAQ from './pages/FAQ';
import QuickShare from './pages/QuickShare';
import ScrollToTop from './components/ScrollToTop';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/unsubscribe" element={<PageTransition><Unsubscribe /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
          <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
          <Route path="/quick-share" element={<PageTransition><QuickShare /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><AuthSplit /></PageTransition>} />
          <Route path="/share/:slug" element={<PageTransition><Share /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          {booting ? (
            <PageLoader key="boot" message="Preparing Sharing It..." />
          ) : (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader message="Loading page..." />}>
                  <AppContent />
                </Suspense>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </ToastProvider>
    </ThemeProvider>
  );
}

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutContainer({ 
  children, 
  title = 'Anobyte - Modern Premium File Sharing',
  description = 'Anobyte is a secure, blazing-fast, and auto-expiring file-sharing platform designed for developers and creators.',
  ogType = 'website',
  ogImage = 'https://anobyte.online/og-image.jpg'
}) {
  
  // Dynamic SEO Page Meta Tag Updates
  useEffect(() => {
    // Title
    document.title = title;
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;

    // OpenGraph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      ogImg = document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      document.head.appendChild(ogImg);
    }
    ogImg.content = ogImage;

    // Scroll to top on page render
    window.scrollTo(0, 0);
  }, [title, description, ogImage, ogType]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 bg-grid-pattern">
      {/* Dynamic Background Glow Elements for Modern Premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 dark:bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/5 dark:bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <Navbar />

      {/* Main Content Area with Spring Fade In Transition */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.15 }}
        className="flex-grow z-10 w-full relative"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutContainer({ 
  children, 
  title = 'Sharing It - Secure File Sharing, Instantly',
  description = 'Sharing It by Anobyte software helps you transfer files online free, share files securely, and enjoy an Airdrop-style experience for documents, photos, and media.',
  keywords = 'Anobyte, Anobyte software, transfer files online, transfer files free, airdrop alternative, share files free, sharing files free, save files online free, shared files, how to share file',
  ogType = 'website',
  ogImage = 'https://sharingit.anobyte.online/og-image.svg'
}) {
  
  // Dynamic SEO Page Meta Tag Updates
  useEffect(() => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sharingit.anobyte.online';

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

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${window.location.pathname}`;

    // OpenGraph Type / Site Name
    let ogTypeTag = document.querySelector('meta[property="og:type"]');
    if (!ogTypeTag) {
      ogTypeTag = document.createElement('meta');
      ogTypeTag.setAttribute('property', 'og:type');
      document.head.appendChild(ogTypeTag);
    }
    ogTypeTag.content = ogType;

    let ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (!ogSiteName) {
      ogSiteName = document.createElement('meta');
      ogSiteName.setAttribute('property', 'og:site_name');
      document.head.appendChild(ogSiteName);
    }
    ogSiteName.content = 'Anobyte Software';

    // Twitter Card
    let twCard = document.querySelector('meta[name="twitter:card"]');
    if (!twCard) {
      twCard = document.createElement('meta');
      twCard.name = 'twitter:card';
      document.head.appendChild(twCard);
    }
    twCard.content = 'summary_large_image';

    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twTitle) {
      twTitle = document.createElement('meta');
      twTitle.name = 'twitter:title';
      document.head.appendChild(twTitle);
    }
    twTitle.content = title;

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement('meta');
      twDesc.name = 'twitter:description';
      document.head.appendChild(twDesc);
    }
    twDesc.content = description;

    // OpenGraph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      ogImg = document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      document.head.appendChild(ogImg);
    }
    ogImg.content = ogImage;

    let twImg = document.querySelector('meta[name="twitter:image"]');
    if (!twImg) {
      twImg = document.createElement('meta');
      twImg.name = 'twitter:image';
      document.head.appendChild(twImg);
    }
    twImg.content = ogImage;

    // Scroll to top on page render
    window.scrollTo(0, 0);
  }, [title, description, keywords, ogImage, ogType]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#050b18] text-slate-900 dark:text-slate-100 transition-colors duration-300 bg-grid-pattern">
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

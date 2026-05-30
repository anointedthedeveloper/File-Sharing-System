import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from './AmbientBackground';

export default function LayoutContainer({
  children,
  title = 'Sharing It - Secure File Sharing, Instantly',
  description = 'Sharing It by Anobyte software helps you transfer files online free, share files securely, and enjoy an Airdrop-style experience for documents, photos, and media.',
  keywords = 'Anobyte, Anobyte software, transfer files online, transfer files free, airdrop alternative, share files free, sharing files free, save files online free, shared files, how to share file',
  ogType = 'website',
  ogImage = 'https://sharingit.anobyte.online/og-image.svg',
  ambient = true,
}) {
  useEffect(() => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sharingit.anobyte.online';

    document.title = title;

    const setMeta = (selector, attr, value, createAttrs = {}) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(createAttrs).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
      }
      if (attr === 'content') el.content = value;
      else el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description, { name: 'description' });
    setMeta('meta[property="og:title"]', 'content', title, { property: 'og:title' });
    setMeta('meta[property="og:description"]', 'content', description, { property: 'og:description' });
    setMeta('meta[name="keywords"]', 'content', keywords, { name: 'keywords' });
    setMeta('meta[property="og:type"]', 'content', ogType, { property: 'og:type' });
    setMeta('meta[property="og:site_name"]', 'content', 'Anobyte Software', { property: 'og:site_name' });
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', { name: 'twitter:card' });
    setMeta('meta[name="twitter:title"]', 'content', title, { name: 'twitter:title' });
    setMeta('meta[name="twitter:description"]', 'content', description, { name: 'twitter:description' });
    setMeta('meta[property="og:image"]', 'content', ogImage, { property: 'og:image' });
    setMeta('meta[name="twitter:image"]', 'content', ogImage, { name: 'twitter:image' });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${window.location.pathname}`;

  }, [title, description, keywords, ogImage, ogType]);

  return (
    <div className="flex flex-col min-h-screen bg-grid-pattern transition-colors duration-500">
      {ambient && <AmbientBackground />}
      <Navbar />

      <main className="flex-grow z-10 w-full relative animate-fade-in">
        {children}
      </main>

      <Footer />
    </div>
  );
}

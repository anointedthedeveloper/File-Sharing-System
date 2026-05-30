import React from 'react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Privacy() {
  return (
    <LayoutContainer 
      title="Privacy Policy - Anobyte Software File Sharing & Transfer Files Online"
      description="Review how Anobyte software protects shared files, secure links, transfer files online, and free file sharing data with clear privacy practices."
    >
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest font-semibold">Last Updated: May 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Welcome to Sharing It. We are highly committed to protecting your privacy. This policy outlines how we manage and protect the items and files you upload to our storage nodes.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">1. Information We Collect</h2>
          <p>
            When utilizing Sharing It as a guest, we do not require you to supply an email address or username. We solely record file metadata necessary to generate sharing tokens, including file name, size, mime type, and chosen expiry timer limits. For registered users, we save credentials (email, hashed password, and full name) to facilitate access control.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">2. File Storage and Expiry</h2>
          <p>
            Uploaded files are stored within secure Supabase Storage buckets. File shares can be optionally configured to expire automatically. Once a share link expires or is deleted by the creator, the database record and corresponding file are permanently purged from our cloud servers and cannot be recovered.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">3. Security Metrics</h2>
          <p>
            We implement industry-standard encryption protocols. For file shares with password locks, download access is restricted until users submit valid passkeys. We strongly advise using unique passphrase signatures.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">4. Cookies and Logs</h2>
          <p>
            We solely use essential cookies to maintain logged-in user sessions. We do not engage in third-party tracking or targeted advertisements.
          </p>
        </div>
      </div>
    </LayoutContainer>
  );
}

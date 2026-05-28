import React from 'react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Terms() {
  return (
    <LayoutContainer 
      title="Terms of Service - Anobyte Sharing Platform"
      description="Read our platform boundaries, storage restrictions and account sharing policies."
    >
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest font-semibold">Last Updated: May 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            By accessing or uploading components to the Anobyte file-sharing service, you agree to comply with and be bound by the following terms of use.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">1. Authorized Use and Account</h2>
          <p>
            You represent that any assets, archives, or templates you share on our server do not infringe upon any third-party copyrights or patents. We do not inspect uploads but reserve structural rights to scrub illegal files if flagged.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">2. Storage and System Limits</h2>
          <p>
            Anobyte is provided as-is. We do not charge fees for standard usage tiers but enforce size boundaries: 50MB for guests, and 1GB for registered accounts. We reserve the right to prune inactive or excessively heavy files during cleanups.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">3. Disclaimers of Warranties</h2>
          <p>
            We represent no warranties that the service will remain uninterrupted, error-free, or entirely bulletproof. You share files at your personal risk, and you assume all liability for archiving backups locally.
          </p>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white pt-4">4. Variations to Terms</h2>
          <p>
            We may refine these policies at any time. Continued usage of Anobyte signifies agreement with revised parameters.
          </p>
        </div>
      </div>
    </LayoutContainer>
  );
}

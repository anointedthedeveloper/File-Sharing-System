import React from 'react';
import LayoutContainer from '../components/layout/LayoutContainer';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <LayoutContainer title="Privacy Protocol - Sharing It">
      <div className="max-w-4xl mx-auto px-6 py-24 sm:py-32 relative">
        <div className="absolute top-40 right-20 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mb-16 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-8 shadow-sm">
            <Shield className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-4">
            Privacy Protocol
          </h1>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>Effective Date: Initial Deployment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Revision: 1.0.0</span>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 border-[var(--border-strong)] prose prose-slate dark:prose-invert max-w-none relative z-10">
          <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
            This document outlines the strict parameters governing how Sharing It processes and annihilates your data. We operate under a zero-surveillance mandate.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-12 mb-4 border-b border-[var(--border)] pb-2">01. Telemetry & Data Collection</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            Guest operations require zero personal identification. We log solely the metadata necessary for mechanical delivery (filesize, MIME type, cryptographic hashes). Authenticated operators provide an email and secure alias solely to maintain dashboard states.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">02. The Ephemeral Promise</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            All nodes are subject to hard limits. Upon reaching the user-defined chronological threshold, the node is purged. The database record is dropped, and the underlying binary asset is physically deleted from the storage bucket. No backups are retained.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">03. Cryptographic Framework</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            Transit occurs exclusively over TLS. Payloads are encrypted at rest. Password-gated nodes rely on SHA-256 derivation; the raw keys are never stored nor accessible by administrators.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">04. Tracking Prohibition</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            We do not execute third-party analytics pixels. We do not inject advertising code. Cookies are restricted to JWT authentication tokens for logged-in sessions. Your traversal through the system is yours alone.
          </p>
        </div>
      </div>
    </LayoutContainer>
  );
}

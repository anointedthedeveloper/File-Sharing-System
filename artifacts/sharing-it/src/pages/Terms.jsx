import React from 'react';
import LayoutContainer from '../components/layout/LayoutContainer';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <LayoutContainer title="Terms of Service - Sharing It">
      <div className="max-w-4xl mx-auto px-6 py-24 sm:py-32 relative">
        <div className="absolute top-40 right-20 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mb-16 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-8 shadow-sm">
            <FileText className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>Effective Date: Initial Deployment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Revision: 1.0.0</span>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 border-[var(--border-strong)] prose prose-slate dark:prose-invert max-w-none relative z-10">
          <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
            By initializing a connection or deploying a payload to the Sharing It infrastructure, you acknowledge and agree to the following operational parameters.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-12 mb-4 border-b border-[var(--border)] pb-2">01. Authorized Usage</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            You represent that any assets transmitted through the network do not violate third-party intellectual property or legal statutes. While we employ a zero-knowledge architecture and do not inspect payloads, we retain the absolute right to purge any node identified as hostile or illegal.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">02. Infrastructure Limits</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            The service is provided without charge for standard operations. We enforce hard volume limits: 50MB for unauthenticated guests, and 1GB for registered operators. We reserve the right to throttle bandwidth or purge dormant nodes to preserve system integrity.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">03. Liability & Warranties</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            Sharing It is provided strictly "as-is". We offer no guarantees of uptime, fault tolerance, or data preservation. You deploy assets at your own risk. The system is designed for transit, not permanent archival; maintain local backups of all critical data.
          </p>

          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mt-10 mb-4 border-b border-[var(--border)] pb-2">04. Parameter Modifications</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            We retain the authority to alter these terms or adjust infrastructure limits without prior broadcast. Continued utilization of the network constitutes acceptance of the current parameters.
          </p>
        </div>
      </div>
    </LayoutContainer>
  );
}

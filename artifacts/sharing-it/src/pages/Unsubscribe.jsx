import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MailX, ArrowLeft } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Executing network sever protocol...');

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const unsubscribe = async () => {
      try {
        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token })
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(body?.error || 'Invalid cryptographic token.');
        }

        setStatus('success');
        setMessage('Your address has been purged from the broadcast list.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Operation failed. Token may be expired.');
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <LayoutContainer title="Sever Comms - Sharing It">
      <div className="max-w-xl mx-auto px-6 py-32 min-h-[80vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full p-10 sm:p-14 rounded-[2.5rem] glass-card border-[var(--border-strong)] text-center relative z-10 shadow-2xl bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-base)]">
          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm border ${
            status === 'loading' ? 'bg-[var(--bg-muted)] border-[var(--border-strong)] text-[var(--accent)]' :
            status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
            'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}>
            {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-8 h-8" />}
            {status === 'error' && <MailX className="w-8 h-8" />}
          </div>

          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-extrabold font-display text-[var(--text-primary)]">
              {status === 'success' ? 'Comms Severed' : status === 'error' ? 'Validation Failure' : 'Standby'}
            </h1>
            <p className="text-base text-[var(--text-secondary)] font-medium max-w-sm mx-auto">
              {message}
            </p>
          </div>

          <Link to="/" className="btn-ghost !rounded-full !px-8">
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </Link>
        </div>
      </div>
    </LayoutContainer>
  );
}

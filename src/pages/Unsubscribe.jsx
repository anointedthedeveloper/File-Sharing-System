import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MailX, ArrowLeft } from 'lucide-react';
import LayoutContainer from '../components/layout/LayoutContainer';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Updating your email preference...');

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
          throw new Error(body?.error || 'This unsubscribe link is invalid or expired.');
        }

        setStatus('success');
        setMessage('You are unsubscribed from non-essential welcome emails.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'This unsubscribe link could not be processed.');
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <LayoutContainer
      title="Unsubscribe - Sharing It"
      description="Manage Sharing It email preferences."
    >
      <div className="max-w-md mx-auto px-4 py-20 min-h-[70vh] flex items-center">
        <div className="w-full p-8 rounded-[2rem] glass-card border border-blue-100/70 dark:border-blue-900/40 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 shadow-glow flex items-center justify-center mx-auto text-white">
            {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-8 h-8" />}
            {status === 'error' && <MailX className="w-8 h-8" />}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {status === 'success' ? 'Preference Updated' : status === 'error' ? 'Link Not Verified' : 'One Moment'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-glow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sharing It</span>
          </Link>
        </div>
      </div>
    </LayoutContainer>
  );
}

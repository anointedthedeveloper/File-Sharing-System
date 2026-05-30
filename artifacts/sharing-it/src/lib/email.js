import { supabase } from './supabase';

export async function sendWelcomeEmailOnce() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (!token) return { skipped: true };

  const response = await fetch('/api/send-welcome', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error || 'Could not send welcome email.');
  }

  return body;
}

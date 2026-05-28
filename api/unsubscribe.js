import { createClient } from '@supabase/supabase-js';
import { isValidUnsubscribeToken } from './_email-utils.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase environment variables are not configured.' });
  }

  try {
    const { email, token } = req.body || {};
    const normalizedEmail = email?.trim().toLowerCase();

    if (!isValidUnsubscribeToken(normalizedEmail, token)) {
      return res.status(400).json({ error: 'Invalid unsubscribe link.' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase
      .from('email_unsubscribes')
      .upsert({
        email: normalizedEmail,
        source: 'welcome'
      });

    if (error) throw error;

    return res.status(200).json({ unsubscribed: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unsubscribe failed.' });
  }
}

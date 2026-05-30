import { createClient } from '@supabase/supabase-js';
import { createUnsubscribeToken, getAppUrl, getResendConfig, sendResendEmail } from './_email-utils.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

function buildWelcomeEmail({ email, fullName, unsubscribeUrl }) {
  const firstName = fullName?.split(' ')?.[0] || 'there';
  const appUrl = getAppUrl();

  const text = [
    `Hi ${firstName},`,
    '',
    'Welcome to Sharing It. Your account is ready.',
    '',
    'You can upload a file, set an expiry or passkey, and share the secure link from your dashboard.',
    '',
    `Open your dashboard: ${appUrl}/dashboard`,
    '',
    `Unsubscribe from welcome emails: ${unsubscribeUrl}`,
    '',
    'Sharing It by Anobyte Software'
  ].join('\n');

  const html = `<!doctype html>
  <html>
    <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="display:none;max-height:0;overflow:hidden;">Your Sharing It account is ready.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 8px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#2563eb;">Sharing It</p>
                  <h1 style="margin:0;font-size:28px;line-height:1.2;color:#0f172a;">Welcome, ${firstName}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 28px 8px;">
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#475569;">Your account is ready. Upload a file, set an expiry or passkey, and share a secure link in seconds.</p>
                  <a href="${appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 20px;border-radius:999px;">Open dashboard</a>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 28px 28px;">
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">You received this because an account was created for ${email}. This is a service message, not a marketing blast.</p>
                  <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#64748b;"><a href="${unsubscribeUrl}" style="color:#2563eb;">Unsubscribe</a> from non-essential welcome emails.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  return { html, text };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase environment variables are not configured.' });
  }

  try {
    const authorization = req.headers.authorization || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authorization }
      }
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Sign in before sending welcome email.' });
    }

    const user = userData.user;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id,email,full_name,welcome_sent_at')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.welcome_sent_at) {
      return res.status(200).json({ skipped: true, reason: 'already_sent' });
    }

    const email = profile?.email || user.email;
    const { data: unsubscribe } = await supabase
      .from('email_unsubscribes')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (unsubscribe) {
      return res.status(200).json({ skipped: true, reason: 'unsubscribed' });
    }

    const token = createUnsubscribeToken(email);
    const unsubscribeUrl = `${getAppUrl()}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    const { from } = getResendConfig();
    const { html, text } = buildWelcomeEmail({
      email,
      fullName: profile?.full_name || user.user_metadata?.full_name,
      unsubscribeUrl
    });

    await sendResendEmail({
      from,
      to: [email],
      subject: 'Welcome to Sharing It',
      html,
      text,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });

    await supabase
      .from('profiles')
      .update({ welcome_sent_at: new Date().toISOString() })
      .eq('id', user.id);

    return res.status(200).json({ sent: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Welcome email failed.' });
  }
}

import crypto from 'node:crypto';

const appUrl = process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` || 'http://localhost:5173';

export function getAppUrl() {
  return appUrl.replace(/\/$/, '');
}

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'Sharing It <onboarding@resend.dev>';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  return { apiKey, from };
}

export function createUnsubscribeToken(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY;
  return crypto
    .createHmac('sha256', secret)
    .update(email.trim().toLowerCase())
    .digest('hex');
}

export function isValidUnsubscribeToken(email, token) {
  if (!email || !token) return false;
  const expected = createUnsubscribeToken(email);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export async function sendResendEmail(payload) {
  const { apiKey } = getResendConfig();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.message || body?.error?.message || 'Resend email delivery failed.');
  }

  return body;
}

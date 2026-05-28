import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')?.replace('v1,whsec_', '');
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Sharing It <hello@sharingit.anobyte.online>';
const siteUrl = Deno.env.get('APP_URL') || 'https://sharingit.anobyte.online';
const supabaseUrl = Deno.env.get('SUPABASE_URL');

type EmailActionType = 'signup' | 'magiclink' | 'recovery' | 'invite' | 'email_change' | 'reauthentication';

type EmailPayload = {
  user: {
    email?: string;
    new_email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
  email_data: {
    token?: string;
    token_new?: string;
    token_hash?: string;
    token_hash_new?: string;
    redirect_to?: string;
    email_action_type: EmailActionType;
    site_url?: string;
  };
};

function getSubject(actionType: EmailActionType) {
  const subjects: Record<EmailActionType, string> = {
    signup: 'Your Sharing It verification code',
    magiclink: 'Your Sharing It sign-in code',
    recovery: 'Reset your Sharing It password',
    invite: 'You have been invited to Sharing It',
    email_change: 'Confirm your Sharing It email change',
    reauthentication: 'Your Sharing It security code'
  };

  return subjects[actionType] || 'Your Sharing It security code';
}

function getHeading(actionType: EmailActionType) {
  const headings: Record<EmailActionType, string> = {
    signup: 'Verify your email',
    magiclink: 'Sign in to Sharing It',
    recovery: 'Reset your password',
    invite: 'Join Sharing It',
    email_change: 'Confirm your new email',
    reauthentication: 'Confirm it is you'
  };

  return headings[actionType] || 'Confirm your email';
}

function buildVerifyUrl(actionType: EmailActionType, tokenHash?: string, redirectTo?: string) {
  if (!supabaseUrl || !tokenHash) return siteUrl;

  const url = new URL(`${supabaseUrl}/auth/v1/verify`);
  url.searchParams.set('token', tokenHash);
  url.searchParams.set('type', actionType);
  url.searchParams.set('redirect_to', redirectTo || `${siteUrl}/dashboard`);
  return url.toString();
}

function buildEmail({
  actionType,
  token,
  verifyUrl,
  recipient
}: {
  actionType: EmailActionType;
  token?: string;
  verifyUrl: string;
  recipient: string;
}) {
  const heading = getHeading(actionType);
  const codeBlock = token
    ? `<p style="margin:0 0 18px;font-size:32px;letter-spacing:8px;font-weight:800;color:#2563eb;">${token}</p>`
    : '';
  const codeText = token ? `\nCode: ${token}\n` : '';

  const html = `<!doctype html>
  <html>
    <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="display:none;max-height:0;overflow:hidden;">${heading} for your Sharing It account.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 8px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#2563eb;">Sharing It</p>
                  <h1 style="margin:0;font-size:28px;line-height:1.2;color:#0f172a;">${heading}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 28px 8px;">
                  <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#475569;">Use the code below in the Sharing It verification screen, or open the secure link.</p>
                  ${codeBlock}
                  <a href="${verifyUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 20px;border-radius:999px;">Continue securely</a>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 28px 28px;">
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">This message was requested for ${recipient}. If you did not request it, you can ignore this email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const text = [
    heading,
    '',
    'Use this code in the Sharing It verification screen, or open the secure link.',
    codeText,
    `Secure link: ${verifyUrl}`,
    '',
    `This message was requested for ${recipient}. If you did not request it, ignore this email.`
  ].join('\n');

  return { html, text };
}

async function sendEmail(to: string, subject: string, html: string, text: string) {
  if (!resendApiKey) throw new Error('RESEND_API_KEY is not set.');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Resend request failed.');
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 405 });
  }

  if (!hookSecret) {
    return new Response('SEND_EMAIL_HOOK_SECRET is not set', { status: 500 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  try {
    const wh = new Webhook(hookSecret);
    const { user, email_data } = wh.verify(payload, headers) as EmailPayload;
    const actionType = email_data.email_action_type;

    if (actionType === 'email_change' && user.new_email) {
      const currentEmailUrl = buildVerifyUrl(actionType, email_data.token_hash_new, email_data.redirect_to);
      const newEmailUrl = buildVerifyUrl(actionType, email_data.token_hash, email_data.redirect_to);

      if (user.email && email_data.token) {
        const currentEmail = buildEmail({
          actionType,
          token: email_data.token,
          verifyUrl: currentEmailUrl,
          recipient: user.email
        });
        await sendEmail(user.email, getSubject(actionType), currentEmail.html, currentEmail.text);
      }

      if (email_data.token_new) {
        const newEmail = buildEmail({
          actionType,
          token: email_data.token_new,
          verifyUrl: newEmailUrl,
          recipient: user.new_email
        });
        await sendEmail(user.new_email, getSubject(actionType), newEmail.html, newEmail.text);
      }
    } else {
      const recipient = user.email || user.new_email;
      if (!recipient) throw new Error('No email recipient found.');

      const verifyUrl = buildVerifyUrl(actionType, email_data.token_hash, email_data.redirect_to);
      const email = buildEmail({
        actionType,
        token: email_data.token,
        verifyUrl,
        recipient
      });

      await sendEmail(recipient, getSubject(actionType), email.html, email.text);
    }

    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Email hook failed.' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

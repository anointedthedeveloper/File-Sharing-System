# Resend + Supabase Email Setup

Use the Supabase Send Email Auth Hook when you want our Resend function to send auth emails directly. Custom SMTP only changes the transport; Supabase still owns the email send. The hook replaces Supabase's built-in email sender.

## 1. Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Sharing It <hello@sharingit.anobyte.online>"
UNSUBSCRIBE_SECRET=use_a_long_random_secret_here
APP_URL=https://sharingit.anobyte.online
VITE_SUPABASE_URL=https://tiviaprimusuiaspeqai.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Use a verified sending domain in Resend before using `hello@sharingit.anobyte.online`.

## 2. Supabase Auth Email Hook

Deploy the Edge Function:

```bash
supabase functions deploy send-email --no-verify-jwt
```

In Supabase Dashboard:

1. Go to Authentication -> Hooks.
2. Create a Send Email hook.
3. Select HTTPS.
4. URL:

```text
https://tiviaprimusuiaspeqai.supabase.co/functions/v1/send-email
```

5. Click Generate Secret and copy the value.
6. Add the secret locally and in Supabase:

```env
SEND_EMAIL_HOOK_SECRET=v1,whsec_...
```

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key RESEND_FROM_EMAIL="Sharing It <hello@sharingit.anobyte.online>" APP_URL=https://sharingit.anobyte.online SEND_EMAIL_HOOK_SECRET=v1,whsec_...
```

7. Push auth config:

```bash
supabase config push --yes
```

Once enabled, Supabase will call `supabase/functions/send-email/index.ts`, and that function sends the email through Resend.

## 3. Optional SMTP Fallback

If you do not enable the hook, configure SMTP as a fallback:

1. Go to Authentication -> Settings -> SMTP Settings.
2. Enable Custom SMTP.
3. Use Resend SMTP:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: your Resend API key
   - Sender email: `hello@sharingit.anobyte.online`
   - Sender name: `Sharing It`

This makes Supabase send confirmation, magic-link, and OTP emails through Resend.

## 4. Supabase Confirm Signup Template

Authentication -> Email Templates -> Confirm signup:

Subject:

```text
Your Sharing It verification code
```

Body:

```html
<div style="margin:0;background:#f8fafc;padding:24px;font-family:Arial,sans-serif;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;padding:28px;">
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#2563eb;">Sharing It</p>
    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;">Verify your email</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">Enter this code in the Sharing It verification screen:</p>
    <p style="margin:0 0 18px;font-size:32px;letter-spacing:8px;font-weight:800;color:#2563eb;">{{ .Token }}</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">Or use the secure link below.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 20px;border-radius:999px;">Verify email</a>
    <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:#64748b;">If you did not create this account, you can ignore this email.</p>
  </div>
</div>
```

## 5. Magic Link Template

Authentication -> Email Templates -> Magic Link:

Subject:

```text
Your Sharing It sign-in code
```

Body:

```html
<div style="margin:0;background:#f8fafc;padding:24px;font-family:Arial,sans-serif;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;padding:28px;">
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#2563eb;">Sharing It</p>
    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;">Sign in to Sharing It</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">Use this one-time code:</p>
    <p style="margin:0 0 18px;font-size:32px;letter-spacing:8px;font-weight:800;color:#2563eb;">{{ .Token }}</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 20px;border-radius:999px;">Sign in securely</a>
    <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:#64748b;">This code expires soon. If you did not request it, ignore this email.</p>
  </div>
</div>
```

## 6. Deliverability Checklist

- Verify the sending domain in Resend.
- Add SPF, DKIM, and DMARC records from Resend DNS settings.
- Use a real branded sender, not a free Gmail/Yahoo address.
- Keep auth emails separate from marketing campaigns.
- Keep subject lines direct: no hype, all caps, or punctuation spam.
- Include plain text content and a clear reason for the email.
- The welcome email in this repo includes `List-Unsubscribe` headers plus an unsubscribe link.

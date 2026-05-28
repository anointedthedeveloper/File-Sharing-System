# Resend + Supabase Email Setup

Use Resend as the delivery layer for Supabase Auth emails so the app can accept a code or link without breaking `supabase.auth.verifyOtp`.

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

## 2. Supabase Auth SMTP

In Supabase Dashboard:

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

## 3. Supabase Confirm Signup Template

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

## 4. Magic Link Template

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

## 5. Deliverability Checklist

- Verify the sending domain in Resend.
- Add SPF, DKIM, and DMARC records from Resend DNS settings.
- Use a real branded sender, not a free Gmail/Yahoo address.
- Keep auth emails separate from marketing campaigns.
- Keep subject lines direct: no hype, all caps, or punctuation spam.
- Include plain text content and a clear reason for the email.
- The welcome email in this repo includes `List-Unsubscribe` headers plus an unsubscribe link.

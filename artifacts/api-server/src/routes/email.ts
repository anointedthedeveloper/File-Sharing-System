import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";

const appUrl =
  process.env.APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:5173");

function getAppUrl() {
  return appUrl.replace(/\/$/, "");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Sharing It <onboarding@resend.dev>";
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");
  return { apiKey, from };
}

function createUnsubscribeToken(email: string) {
  const secret =
    process.env.UNSUBSCRIBE_SECRET ?? process.env.RESEND_API_KEY ?? "";
  return crypto
    .createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("hex");
}

function isValidUnsubscribeToken(email: string, token: string) {
  if (!email || !token) return false;
  const expected = createUnsubscribeToken(email);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token),
    );
  } catch {
    return false;
  }
}

async function sendResendEmail(payload: object) {
  const { apiKey } = getResendConfig();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const msg =
      (body?.message as string) ??
      ((body?.error as Record<string, string>)?.message ?? "Resend email delivery failed.");
    throw new Error(msg);
  }
  return body;
}

function buildWelcomeEmail({
  email,
  fullName,
  unsubscribeUrl,
}: {
  email: string;
  fullName?: string;
  unsubscribeUrl: string;
}) {
  const firstName = fullName?.split(" ")?.[0] ?? "there";
  const appUrlBase = getAppUrl();

  const text = [
    `Hi ${firstName},`,
    "",
    "Welcome to Sharing It. Your account is ready.",
    "",
    "You can upload a file, set an expiry or passkey, and share the secure link from your dashboard.",
    "",
    `Open your dashboard: ${appUrlBase}/dashboard`,
    "",
    `Unsubscribe from welcome emails: ${unsubscribeUrl}`,
    "",
    "Sharing It by Anobyte Software",
  ].join("\n");

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
                  <a href="${appUrlBase}/dashboard" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 20px;border-radius:999px;">Open dashboard</a>
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

router.post("/send-welcome", async (req, res) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: "Supabase environment variables are not configured." });
    return;
  }
  try {
    const authorization = (req.headers.authorization as string) ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      res.status(401).json({ error: "Sign in before sending welcome email." });
      return;
    }

    const user = userData.user;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,full_name,welcome_sent_at")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    if ((profile as Record<string, unknown>)?.welcome_sent_at) {
      res.status(200).json({ skipped: true, reason: "already_sent" });
      return;
    }

    const p = profile as Record<string, unknown>;
    const email = (p?.email as string) ?? (user.email ?? "");
    const { data: unsubscribe } = await supabase
      .from("email_unsubscribes")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (unsubscribe) {
      res.status(200).json({ skipped: true, reason: "unsubscribed" });
      return;
    }

    const token = createUnsubscribeToken(email);
    const unsubscribeUrl = `${getAppUrl()}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    const { from } = getResendConfig();
    const { html, text } = buildWelcomeEmail({
      email,
      fullName: (p?.full_name as string) ?? (user.user_metadata?.full_name as string),
      unsubscribeUrl,
    });

    await sendResendEmail({
      from,
      to: [email],
      subject: "Welcome to Sharing It",
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    await supabase
      .from("profiles")
      .update({ welcome_sent_at: new Date().toISOString() })
      .eq("id", user.id);

    res.status(200).json({ sent: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message ?? "Welcome email failed." });
  }
});

router.post("/unsubscribe", async (req, res) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: "Supabase environment variables are not configured." });
    return;
  }
  try {
    const { email, token } = (req.body ?? {}) as Record<string, string>;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!isValidUnsubscribeToken(normalizedEmail, token)) {
      res.status(400).json({ error: "Invalid unsubscribe link." });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase
      .from("email_unsubscribes")
      .upsert({ email: normalizedEmail, source: "welcome" });

    if (error) throw error;

    res.status(200).json({ unsubscribed: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message ?? "Unsubscribe failed." });
  }
});

export default router;

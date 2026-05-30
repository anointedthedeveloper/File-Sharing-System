/**
 * Centralized auth error logging for debugging and support.
 */
export function logAuthError(context, error, meta = {}) {
  const payload = {
    context,
    message: error?.message ?? String(error),
    status: error?.status,
    code: error?.code,
    name: error?.name,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  console.error(`[SharingIt Auth] ${context}`, payload, error);

  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    console.debug('[SharingIt Auth] stack', error?.stack);
  }

  return payload;
}

export function getAuthErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  const msg = error.message?.toLowerCase() ?? '';

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Incorrect email or password.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Verify your email first, or use the email code sign-in option.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (msg.includes('password')) {
    return error.message;
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Network error. Check your connection and try again.';
  }

  return error.message || fallback;
}

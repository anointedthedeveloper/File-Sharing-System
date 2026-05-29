const STORAGE_KEY = 'sharingit_device_name';

export function getDeviceName() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved?.trim()) return saved.trim();
  } catch {
    /* ignore */
  }

  const ua = navigator.userAgent;
  let label = 'Unknown device';
  if (/iPhone|iPad|iPod/i.test(ua)) label = 'Apple Mobile';
  else if (/Android/i.test(ua)) label = 'Android';
  else if (/Windows/i.test(ua)) label = 'Windows PC';
  else if (/Mac/i.test(ua)) label = 'Mac';
  else if (/Linux/i.test(ua)) label = 'Linux';

  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  return host ? `${label} · ${host}` : label;
}

export function setDeviceName(name) {
  const trimmed = name?.trim().slice(0, 48);
  if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
}

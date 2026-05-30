const STORAGE_KEY = 'sharingit_device_name';

function detectFromUA() {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) {
    const match = ua.match(/;\s([^)]+)\)/);
    if (match) {
      const raw = match[1].trim();
      const parts = raw.split(/\s+/);
      return parts.slice(-2).join(' ');
    }
    return 'Android Device';
  }
  if (/Windows NT 10/i.test(ua)) return 'Windows PC';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
  if (/Linux/i.test(ua)) return 'Linux PC';
  return 'My Device';
}

export function getDeviceName() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved?.trim()) return saved.trim();
  } catch {}
  return detectFromUA();
}

export async function getDeviceNameAsync() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved?.trim()) return saved.trim();
  } catch {}

  try {
    if (navigator.userAgentData) {
      const hints = await navigator.userAgentData.getHighEntropyValues([
        'platform', 'model', 'platformVersion',
      ]);
      const model = hints.model?.trim();
      if (model && model !== '') return model;
      const platform = hints.platform || navigator.userAgentData.platform;
      if (platform) return platform;
    }
  } catch {}

  return detectFromUA();
}

export function setDeviceName(name) {
  const trimmed = name?.trim().slice(0, 48);
  if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
}

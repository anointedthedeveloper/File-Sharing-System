const KEY = 'sharingit_quick_share_history';
const MAX = 30;

export function getQuickShareHistory() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addQuickShareHistory(entry) {
  const list = getQuickShareHistory().filter((e) => e.id !== entry.id);
  list.unshift({ ...entry, at: Date.now() });
  sessionStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  return list;
}

export function clearQuickShareHistory() {
  sessionStorage.removeItem(KEY);
}

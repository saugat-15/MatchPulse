const WATCHLIST_KEY = 'matchpulse-watchlist';

export function readWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(ids: string[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
}

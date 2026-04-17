'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MatchCard } from '@/components/MatchCard';
import { useMatches } from '@/hooks/useMatches';
import { readWatchlist, writeWatchlist } from '@/lib/watchlistStorage';

export default function WatchlistPage() {
  const { matches, loading } = useMatches();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readWatchlist());
  }, []);

  const savedMatches = useMemo(
    () => matches.filter((match) => savedIds.includes(match.id)),
    [matches, savedIds]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      writeWatchlist(next);
      return next;
    });
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading watchlist...</p>;
  }

  if (savedMatches.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-lg font-semibold text-white">Your Watchlist</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Save matches from the search page to track them here.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-400"
        >
          Browse Matches
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h1 className="text-lg font-semibold text-white">Your Watchlist</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Quick access to saved matches. Updates are based on snapshot data and live status.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {savedMatches.map((match) => (
          <MatchCard key={match.id} match={match} savedIds={savedIds} onToggleSave={toggleSave} />
        ))}
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { MatchCard } from '@/components/MatchCard';
import { useMatches } from '@/hooks/useMatches';
import { readWatchlist, writeWatchlist } from '@/lib/watchlistStorage';

export default function SearchPage() {
  const { matches, loading } = useMatches();
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>(readWatchlist);

  const filteredMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return matches;

    return matches.filter((match) => {
      const players = `${match.players[0].name} ${match.players[1].name}`.toLowerCase();
      return (
        players.includes(term) ||
        match.tournament.toLowerCase().includes(term) ||
        match.round.toLowerCase().includes(term) ||
        match.court.toLowerCase().includes(term)
      );
    });
  }, [matches, query]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      writeWatchlist(next);
      return next;
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h1 className="text-lg font-semibold text-white">Search Matches</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Find live, upcoming, and completed matches across the tournament.
        </p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search player, round, tournament, or court"
          className="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-500"
        />
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading matches...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} savedIds={savedIds} onToggleSave={toggleSave} />
          ))}
        </div>
      )}

      {!loading && filteredMatches.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-500">
          No matches found for this search.
        </div>
      )}
    </section>
  );
}

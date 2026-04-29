'use client';

import { useMemo, useState } from 'react';
import { useMatchStream } from '@/hooks/useMatchStream';
import { useMatches } from '@/hooks/useMatches';
import { MatchHeader } from '@/components/MatchHeader';
import { MatchCard } from '@/components/MatchCard';
import { StatPills } from '@/components/StatPills';
import { MomentumChart } from '@/components/charts/MomentumChart';
import { StatsComparisonChart } from '@/components/charts/StatsComparisonChart';
import { ServeGaugeChart } from '@/components/charts/ServeGaugeChart';
import { BreakPointsChart } from '@/components/charts/BreakPointsChart';
import { ServeSpeedChart } from '@/components/charts/ServeSpeedChart';
import { PointsWonChart } from '@/components/charts/PointsWonChart';
import { EventTimeline } from '@/components/EventTimeline';
import { readWatchlist, writeWatchlist } from '@/lib/watchlistStorage';

export default function Home() {
  const { data, status, isSlowLoading } = useMatchStream();
  const { matches, loading: matchesLoading } = useMatches();
  const [savedIds, setSavedIds] = useState<string[]>(readWatchlist);
  const liveMatches = useMemo(
    () => matches.filter((match) => match.status === 'LIVE').slice(0, 4),
    [matches]
  );
  const upcomingMatches = useMemo(
    () => matches.filter((match) => match.status === 'UPCOMING').slice(0, 2),
    [matches]
  );
  const recentResults = useMemo(
    () => matches.filter((match) => match.status === 'COMPLETED').slice(0, 2),
    [matches]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      writeWatchlist(next);
      return next;
    });
  };

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">
        {status === 'reconnecting'
          ? 'Reconnecting...'
          : isSlowLoading
            ? 'Live stream is delayed. Loading latest snapshot...'
            : 'Connecting to live stream...'}
      </div>
    );
  }

  const [p1, p2] = data.players;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <aside className="xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-y-auto pr-1">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">Live Now</h2>
              <span className="text-xs text-zinc-500">Top courts</span>
            </div>
            {matchesLoading ? (
              <p className="text-sm text-zinc-500">Loading live matches...</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} savedIds={savedIds} onToggleSave={toggleSave} />
                ))}
                {liveMatches.length === 0 && (
                  <p className="text-sm text-zinc-500">No live matches right now.</p>
                )}
              </div>
            )}
          </section>
        </aside>

        <section className="xl:col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs text-zinc-400 lg:col-span-3">
            Stream status:{' '}
            <span
              className={
                status === 'live'
                  ? 'text-emerald-400'
                  : status === 'reconnecting'
                    ? 'text-amber-400'
                    : 'text-zinc-300'
              }
            >
              {status === 'live' ? 'LIVE' : status === 'reconnecting' ? 'RECONNECTING' : 'CONNECTING'}
            </span>
          </div>

          <div className="lg:col-span-3">
            <MatchHeader snapshot={data} />
          </div>

          <div className="lg:col-span-3">
            <StatPills p1={p1} p2={p2} />
          </div>

          <div className="lg:col-span-2">
            <MomentumChart momentum={data.momentum} p1Name={p1.name} p2Name={p2.name} />
          </div>
          <div className="lg:col-span-1">
            <ServeGaugeChart p1={p1} p2={p2} />
          </div>

          <div className="lg:col-span-1">
            <StatsComparisonChart p1={p1} p2={p2} />
          </div>
          <div className="lg:col-span-1">
            <BreakPointsChart p1={p1} p2={p2} />
          </div>
          <div className="lg:col-span-1">
            <ServeSpeedChart p1={p1} p2={p2} />
          </div>

          <div className="lg:col-span-1">
            <PointsWonChart p1={p1} p2={p2} />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:col-span-1">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">Up Next</h2>
              <span className="text-xs text-zinc-500">Today and tomorrow</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} savedIds={savedIds} onToggleSave={toggleSave} />
              ))}
              {!matchesLoading && upcomingMatches.length === 0 && (
                <p className="text-sm text-zinc-500">No upcoming matches in the schedule.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:col-span-1">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">Recent Results</h2>
              <span className="text-xs text-zinc-500">Latest completed matches</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {recentResults.map((match) => (
                <MatchCard key={match.id} match={match} savedIds={savedIds} onToggleSave={toggleSave} />
              ))}
              {!matchesLoading && recentResults.length === 0 && (
                <p className="text-sm text-zinc-500">No completed matches yet.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <EventTimeline events={data.events} />
          </div>
        </section>
      </div>
    </div>
  );
}

import type { MatchSnapshot } from '@/types/tennis';

function SetScores({ sets }: { sets: number[] }) {
  return (
    <div className="flex gap-2">
      {sets.map((s, i) => (
        <span key={i} className="text-sm font-mono text-zinc-400">
          {s}
        </span>
      ))}
    </div>
  );
}

export function MatchHeader({ snapshot }: { snapshot: MatchSnapshot }) {
  const { match, players } = snapshot;
  const [p1, p2] = players;
  const h2hLeader = match.h2h.p1Wins === match.h2h.p2Wins
    ? null
    : match.h2h.p1Wins > match.h2h.p2Wins ? p1.name : p2.name;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      {/* Match meta */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase tracking-wider min-w-0">
          <span className="truncate">{match.tournament}</span>
          <span className="shrink-0">·</span>
          <span className="truncate hidden sm:inline">{match.court}</span>
          <span className="shrink-0 hidden sm:inline">·</span>
          <span className="shrink-0 hidden sm:inline">{match.round}</span>
          <span className="shrink-0 hidden md:inline ml-1">
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400 normal-case tracking-normal">
              {match.surface}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-400 font-mono">{match.elapsedTime}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Score — stacked on mobile, horizontal on md+ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        {/* Player 1 */}
        <div className="flex items-center justify-between md:flex-1 gap-3">
          <div>
            <p className="font-bold text-white text-base sm:text-lg leading-tight">{p1.name}</p>
            <p className="text-xs text-zinc-500">{p1.country}</p>
          </div>
          <div className="flex items-center gap-3">
            <SetScores sets={p1.score.sets} />
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums md:hidden">
              {p1.score.currentGame}
            </span>
          </div>
        </div>

        {/* Current game — desktop only */}
        <div className="hidden md:flex items-center gap-3 px-4">
          <span className="text-4xl font-mono font-bold text-white tabular-nums">
            {p1.score.currentGame}
          </span>
          <span className="text-zinc-600 text-xl">—</span>
          <span className="text-4xl font-mono font-bold text-white tabular-nums">
            {p2.score.currentGame}
          </span>
        </div>

        {/* Player 2 */}
        <div className="flex items-center justify-between md:flex-1 gap-3">
          <div className="flex items-center gap-3 md:ml-auto">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums md:hidden">
              {p2.score.currentGame}
            </span>
            <SetScores sets={p2.score.sets} />
          </div>
          <div className="text-right">
            <p className="font-bold text-white text-base sm:text-lg leading-tight">{p2.name}</p>
            <p className="text-xs text-zinc-500">{p2.country}</p>
          </div>
        </div>
      </div>

      {/* H2H */}
      <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-center">
        <span className="text-xs text-zinc-500">
          H2H:{' '}
          <span className="text-zinc-300 font-semibold">
            {match.h2h.p1Wins}–{match.h2h.p2Wins}
          </span>
          {h2hLeader && (
            <>
              {' '}
              <span className="text-zinc-400">{h2hLeader} leads</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

'use client';

import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { MatchListItem } from '@/types/tennis';

const SURFACE_COLORS: Record<string, string> = {
  Hard: 'bg-blue-500/10 text-blue-400',
  Clay: 'bg-orange-500/10 text-orange-400',
  Grass: 'bg-green-500/10 text-green-400',
  Carpet: 'bg-purple-500/10 text-purple-400',
};

function StatusBadge({ status, startTime }: { status: MatchListItem['status']; startTime: string }) {
  if (status === 'LIVE') {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === 'UPCOMING') {
    const date = new Date(startTime);
    const label = date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
      Final
    </span>
  );
}

function PlayerRow({ player, isWinner }: { player: MatchListItem['players'][0]; isWinner?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        {player.seed && (
          <span className="text-[10px] text-zinc-600 w-4 shrink-0">[{player.seed}]</span>
        )}
        <span className={`text-sm font-semibold truncate ${isWinner ? 'text-white' : 'text-zinc-400'}`}>
          {player.name}
        </span>
        <span className="text-[10px] text-zinc-600 shrink-0">{player.country}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {player.sets.map((s, i) => (
          <span key={i} className={`text-sm font-mono tabular-nums w-5 text-center ${isWinner ? 'text-white font-bold' : 'text-zinc-500'}`}>
            {s}
          </span>
        ))}
        {player.currentGame && (
          <span className="text-sm font-mono font-bold text-yellow-400 w-6 text-center">
            {player.currentGame}
          </span>
        )}
      </div>
    </div>
  );
}

function getWinner(match: MatchListItem): 0 | 1 | null {
  if (match.status !== 'COMPLETED') return null;
  const [p1, p2] = match.players;
  const p1Sets = p1.sets.filter((s, i) => s > (p2.sets[i] ?? 0)).length;
  const p2Sets = p2.sets.filter((s, i) => s > (p1.sets[i] ?? 0)).length;
  if (p1Sets > p2Sets) return 0;
  if (p2Sets > p1Sets) return 1;
  return null;
}

interface MatchCardProps {
  match: MatchListItem;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function MatchCard({ match, savedIds, onToggleSave }: MatchCardProps) {
  const saved = savedIds.includes(match.id);
  const winner = getWinner(match);
  const surfaceClass = SURFACE_COLORS[match.surface] ?? 'bg-zinc-700 text-zinc-400';

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${surfaceClass}`}>
            {match.surface}
          </span>
          <span className="text-xs text-zinc-500 truncate">{match.round}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={match.status} startTime={match.startTime} />
          <button
            onClick={() => onToggleSave(match.id)}
            className="text-zinc-500 hover:text-yellow-500 transition-colors"
            aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {saved
              ? <BookmarkCheck className="h-4 w-4 text-yellow-500" />
              : <Bookmark className="h-4 w-4" />
            }
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="flex flex-col gap-2">
        <PlayerRow player={match.players[0]} isWinner={winner === 0} />
        <PlayerRow player={match.players[1]} isWinner={winner === 1} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{match.court}</span>
        {match.status === 'LIVE' && (
          <Link
            href="/"
            className="flex items-center gap-1 text-[10px] text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
          >
            Watch live <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

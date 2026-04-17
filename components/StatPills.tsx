import type { Player } from '@/types/tennis';

function parseRatio(str: string): { won: number; total: number } {
  const [won, total] = str.split('/').map(Number);
  return { won: won ?? 0, total: total ?? 0 };
}

type Pill = {
  label: string;
  p1Value: string;
  p2Value: string;
  p1Highlight?: boolean;
  p2Highlight?: boolean;
};

function StatPill({ label, p1Value, p2Value, p1Highlight, p2Highlight }: Pill) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 min-w-0">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-mono font-bold tabular-nums ${p1Highlight ? 'text-blue-400' : 'text-zinc-300'}`}>
          {p1Value}
        </span>
        <span className="text-zinc-700 text-xs">vs</span>
        <span className={`text-lg font-mono font-bold tabular-nums ${p2Highlight ? 'text-orange-400' : 'text-zinc-300'}`}>
          {p2Value}
        </span>
      </div>
    </div>
  );
}

export function StatPills({ p1, p2 }: { p1: Player; p2: Player }) {
  const bp1 = parseRatio(p1.stats.breakPointsWon);
  const bp2 = parseRatio(p2.stats.breakPointsWon);
  const net1 = parseRatio(p1.stats.netPointsWon);
  const net2 = parseRatio(p2.stats.netPointsWon);

  const pills: Pill[] = [
    {
      label: 'Points Won',
      p1Value: String(p1.stats.totalPointsWon),
      p2Value: String(p2.stats.totalPointsWon),
      p1Highlight: p1.stats.totalPointsWon > p2.stats.totalPointsWon,
      p2Highlight: p2.stats.totalPointsWon > p1.stats.totalPointsWon,
    },
    {
      label: 'Break Pts',
      p1Value: p1.stats.breakPointsWon,
      p2Value: p2.stats.breakPointsWon,
      p1Highlight: bp1.total > 0 && bp1.won / bp1.total > bp2.won / (bp2.total || 1),
      p2Highlight: bp2.total > 0 && bp2.won / bp2.total > bp1.won / (bp1.total || 1),
    },
    {
      label: 'Net Points',
      p1Value: p1.stats.netPointsWon,
      p2Value: p2.stats.netPointsWon,
      p1Highlight: net1.total > 0 && net1.won / net1.total > net2.won / (net2.total || 1),
      p2Highlight: net2.total > 0 && net2.won / net2.total > net1.won / (net1.total || 1),
    },
    {
      label: 'Dbl Faults',
      p1Value: String(p1.stats.doubleFaults),
      p2Value: String(p2.stats.doubleFaults),
      // fewer double faults = better
      p1Highlight: p1.stats.doubleFaults < p2.stats.doubleFaults,
      p2Highlight: p2.stats.doubleFaults < p1.stats.doubleFaults,
    },
    {
      label: 'Aces',
      p1Value: String(p1.stats.aces),
      p2Value: String(p2.stats.aces),
      p1Highlight: p1.stats.aces > p2.stats.aces,
      p2Highlight: p2.stats.aces > p1.stats.aces,
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {pills.map((pill) => (
        <StatPill key={pill.label} {...pill} />
      ))}
    </div>
  );
}

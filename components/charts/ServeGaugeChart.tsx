import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { Player } from '@/types/tennis';

function serveColor(pct: number): string {
  if (pct >= 65) return '#22c55e';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
}

function PlayerGauge({ player }: { player: Player }) {
  const pct = player.stats.firstServePct;
  const color = serveColor(pct);
  const config: ChartConfig = {
    serve: { label: '1st Serve %', color },
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <ChartContainer config={config} className="h-28 w-28">
        <RadialBarChart
          data={[{ name: 'serve', value: pct, fill: color }]}
          innerRadius="65%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            background={{ fill: '#27272a' }}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ChartContainer>
      <span className="text-2xl font-mono font-bold" style={{ color }}>
        {pct}%
      </span>
      <span className="text-xs text-zinc-400 text-center leading-tight">{player.name}</span>
    </div>
  );
}

export function ServeGaugeChart({ p1, p2 }: { p1: Player; p2: Player }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">1st Serve %</h3>
      <div className="flex justify-around items-center">
        <PlayerGauge player={p1} />
        <PlayerGauge player={p2} />
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Player } from '@/types/tennis';

const chartConfig = {
  p1: { label: 'Player 1', color: '#3b82f6' },
  p2: { label: 'Player 2', color: '#f97316' },
} satisfies ChartConfig;

const STATS: { key: keyof Player['stats']; label: string }[] = [
  { key: 'aces', label: 'Aces' },
  { key: 'winners', label: 'Winners' },
  { key: 'unforcedErrors', label: 'Unforced Errors' },
];

export function StatsComparisonChart({ p1, p2 }: { p1: Player; p2: Player }) {
  const config = {
    ...chartConfig,
    p1: { ...chartConfig.p1, label: p1.name },
    p2: { ...chartConfig.p2, label: p2.name },
  };

  // Butterfly layout: p1 as negative (extends left), p2 as positive (extends right)
  const data = STATS.map(({ key, label }) => ({
    stat: label,
    p1: -(p1.stats[key] as number),
    p2: p2.stats[key] as number,
    p1Raw: p1.stats[key] as number,
    p2Raw: p2.stats[key] as number,
  }));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-1">Stats Comparison</h3>
      <div className="flex justify-between text-xs text-zinc-500 mb-3 px-1">
        <span style={{ color: config.p1.color }}>{p1.name}</span>
        <span style={{ color: config.p2.color }}>{p2.name}</span>
      </div>
      <ChartContainer config={config} className="h-40 w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
          barCategoryGap="30%"
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => String(Math.abs(v))}
          />
          <YAxis
            type="category"
            dataKey="stat"
            tick={{ fontSize: 10 }}
            width={80}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(_value, name, item) => {
                  const raw = name === 'p1' ? item.payload.p1Raw : item.payload.p2Raw;
                  const label = name === 'p1' ? p1.name : p2.name;
                  return [String(raw), label];
                }}
              />
            }
          />
          <Bar dataKey="p1" stackId="a" fill={config.p1.color} radius={[4, 0, 0, 4]} isAnimationActive={false} />
          <Bar dataKey="p2" stackId="a" fill={config.p2.color} radius={[0, 4, 4, 0]} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

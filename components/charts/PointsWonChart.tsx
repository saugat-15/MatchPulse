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

export function PointsWonChart({ p1, p2 }: { p1: Player; p2: Player }) {
  const config = {
    ...chartConfig,
    p1: { ...chartConfig.p1, label: p1.name },
    p2: { ...chartConfig.p2, label: p2.name },
  };

  const data = [
    {
      stat: '1st Serve',
      p1: p1.stats.firstServePointsWon,
      p2: p2.stats.firstServePointsWon,
    },
    {
      stat: '2nd Serve',
      p1: p1.stats.secondServePointsWon,
      p2: p2.stats.secondServePointsWon,
    },
    {
      stat: 'Return',
      p1: p1.stats.returnPointsWon,
      p2: p2.stats.returnPointsWon,
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-1">Points Won %</h3>
      <div className="flex justify-between text-xs text-zinc-500 mb-3 px-1">
        <span style={{ color: config.p1.color }}>{p1.name}</span>
        <span style={{ color: config.p2.color }}>{p2.name}</span>
      </div>
      <ChartContainer config={config} className="h-44 w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => `${v}%`}
            tickCount={6}
          />
          <YAxis
            type="category"
            dataKey="stat"
            tick={{ fontSize: 10 }}
            width={64}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const label = name === 'p1' ? p1.name : p2.name;
                  return [`${value}%`, label];
                }}
              />
            }
          />
          <Bar dataKey="p1" fill={config.p1.color} radius={[0, 4, 4, 0]} isAnimationActive={false} />
          <Bar dataKey="p2" fill={config.p2.color} radius={[0, 4, 4, 0]} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Player } from '@/types/tennis';

const chartConfig = {
  avg: { label: 'Avg Speed', color: '#8b5cf6' },
  max: { label: 'Max Speed', color: '#ec4899' },
} satisfies ChartConfig;

export function ServeSpeedChart({ p1, p2 }: { p1: Player; p2: Player }) {
  const data = [
    {
      player: p1.name.split(' ').pop(),
      avg: p1.stats.avgServeSpeed,
      max: p1.stats.maxServeSpeed,
    },
    {
      player: p2.name.split(' ').pop(),
      avg: p2.stats.avgServeSpeed,
      max: p2.stats.maxServeSpeed,
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Serve Speed (km/h)</h3>
      <ChartContainer config={chartConfig} className="h-32 w-full">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 36, bottom: 0, left: 8 }}
          barCategoryGap="25%"
          barGap={3}
        >
          <XAxis
            type="number"
            domain={[150, 240]}
            tick={{ fontSize: 10 }}
            tickCount={5}
          />
          <YAxis
            type="category"
            dataKey="player"
            tick={{ fontSize: 10 }}
            width={60}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`${value} km/h`]}
              />
            }
          />
          <Bar dataKey="avg" fill={chartConfig.avg.color} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="avg" position="right" style={{ fill: '#a1a1aa', fontSize: 10 }} />
          </Bar>
          <Bar dataKey="max" fill={chartConfig.max.color} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="max" position="right" style={{ fill: '#a1a1aa', fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

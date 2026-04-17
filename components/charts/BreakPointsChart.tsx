import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Player } from '@/types/tennis';

const chartConfig = {
  converted: { label: 'Converted', color: '#22c55e' },
  missed: { label: 'Missed', color: '#3f3f46' },
} satisfies ChartConfig;

function parseBreakPoints(bp: string): { converted: number; missed: number } {
  const [won, total] = bp.split('/').map(Number);
  return { converted: won ?? 0, missed: (total ?? 0) - (won ?? 0) };
}

export function BreakPointsChart({ p1, p2 }: { p1: Player; p2: Player }) {
  const data = [
    { name: p1.name, ...parseBreakPoints(p1.stats.breakPointsWon) },
    { name: p2.name, ...parseBreakPoints(p2.stats.breakPointsWon) },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Break Points</h3>
      <ChartContainer config={chartConfig} className="h-40 w-full">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 8 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10 }}
            width={70}
            tickFormatter={(name: string) => name.split(' ').pop() ?? name}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="converted" stackId="bp" fill={chartConfig.converted.color} radius={[0, 0, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="converted" position="inside" style={{ fill: '#fff', fontSize: 10 }} />
          </Bar>
          <Bar dataKey="missed" stackId="bp" fill={chartConfig.missed.color} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="missed" position="inside" style={{ fill: '#a1a1aa', fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

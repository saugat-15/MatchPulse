import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { MomentumPoint } from '@/types/tennis';

const chartConfig = {
  p1: { label: 'Djokovic', color: '#3b82f6' },
  p2: { label: 'Alcaraz', color: '#f97316' },
} satisfies ChartConfig;

// Split each point into p1 (positive side) and p2 (negative side) for two-tone fill
function toChartData(momentum: MomentumPoint[]) {
  return momentum.map((m) => ({
    point: m.point,
    p1: m.value > 0 ? m.value : 0,
    p2: m.value < 0 ? m.value : 0,
  }));
}

export function MomentumChart({
  momentum,
  p1Name,
  p2Name,
}: {
  momentum: MomentumPoint[];
  p1Name: string;
  p2Name: string;
}) {
  const data = toChartData(momentum);
  const config = {
    ...chartConfig,
    p1: { ...chartConfig.p1, label: p1Name },
    p2: { ...chartConfig.p2, label: p2Name },
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Momentum</h3>
      <ChartContainer config={config} className="h-40 w-full">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="point" tick={{ fontSize: 10 }} />
          <YAxis domain={[-6, 6]} tick={{ fontSize: 10 }} />
          <ReferenceLine y={0} stroke="#52525b" />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Area
            type="monotone"
            dataKey="p1"
            stroke={config.p1.color}
            fill={config.p1.color}
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="p2"
            stroke={config.p2.color}
            fill={config.p2.color}
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getCurrentMonthYear } from '@/lib/utils';

interface BarChartLabelProps<T> {
  title: string;
  chartData: T[];
  chartConfig: ChartConfig;
  xAxisDataKey: string;
  barDataKey: string;
  barColor: string;
}

export function BarChartLabel<T>({
  title,
  chartData,
  chartConfig,
  xAxisDataKey,
  barDataKey,
  barColor,
}: BarChartLabelProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{getCurrentMonthYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey={xAxisDataKey} tickLine={false} tickMargin={10} axisLine={false} fontSize={14} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey={barDataKey} fill={barColor} radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BarChartLabel;

'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getCurrentMonthYear } from '@/lib/utils';

interface BarChartMultipleProps<T> {
  title: string;
  chartData: T[];
  chartConfig: ChartConfig;
  xAxisKey: string;
  firstColumnKey: string;
  secondColumnKey: string;
  firstColumnColor: string;
  secondColumnColor: string;
}

export function BarChartMultiple<T>({
  title,
  chartData,
  chartConfig,
  xAxisKey,
  firstColumnKey,
  secondColumnKey,
  firstColumnColor,
  secondColumnColor,
}: BarChartMultipleProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{getCurrentMonthYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey={firstColumnKey} fill={firstColumnColor} radius={4} />
            <Bar dataKey={secondColumnKey} fill={secondColumnColor} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

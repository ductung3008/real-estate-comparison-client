import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getCurrentMonthYear } from '@/lib/utils';

interface PieChartLegendProps<T> {
  title: string;
  chartData: T[];
  chartConfig: ChartConfig;
  dataKey: string;
  nameKey: string;
}

export function PieChartLegend<T>({ title, chartData, chartConfig, dataKey, nameKey }: PieChartLegendProps<T>) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{getCurrentMonthYear()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[500px]">
          <PieChart className="flex">
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} label />
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey} />}
              className="grid -translate-y-2 grid-cols-3 gap-2 text-center [&>*]:text-lg"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

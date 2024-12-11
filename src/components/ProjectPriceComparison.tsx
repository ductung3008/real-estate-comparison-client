import { Dot } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { CartesianGrid, Label, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import PlaceholderImage from '@/assets/images/placeholder.svg';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { toBillions } from '@/lib/utils';
import { Project } from '@/types/project.type';

interface TooltipPayload {
  name: string;
  color: string;
  value: number;
  unit: string;
  payload: Record<string, { price: number; percent: number }>;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded bg-white p-2 shadow-md">
        <p className="font-semibold">Tháng: {label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="text-base">
            <span style={{ color: entry.color, fontWeight: 'bold' }}>{entry.name}:</span> {entry.value} {entry.unit}{' '}
            <p className="text-sm">
              <span className={`${entry.payload[entry.name]?.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {entry.payload[entry.name]?.percent >= 0 ? '+' : '-'}
                {entry.payload[entry.name]?.percent.toFixed(2)}%
              </span>
              <span> so với tháng trước</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProjectPriceComparison = ({ projects, children }: { projects: Project[]; children: ReactNode }) => {
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const COLOR_PALETTE = ['#094bf4', '#ff8718', '#00c64f'];

  const generateChartConfig = (projects: Project[]): ChartConfig => {
    return projects.reduce((config, project, index) => {
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
      if (project?.name) {
        config[project.name] = { label: project.name, color };
      }
      return config;
    }, {} as ChartConfig);
  };

  useEffect(() => {
    const result = [];
    projects?.forEach((project) => {
      const sortedPrices = project?.prices?.sort((a, b) => a.year - b.year || a.unit - b.unit);
      sortedPrices?.forEach((price) => {
        const month = `T${price.unit}-${price.year}`;
        let monthEntry = result.find((entry) => entry.month === month);
        if (!monthEntry) {
          monthEntry = { month };
          result.push(monthEntry);
        }
        monthEntry[project?.name] = { price: toBillions(price?.price), percent: price?.percent };
      });
    });

    setChartConfig(generateChartConfig(projects));
    setChartData(result);
  }, [projects]);

  return (
    <div className="m-auto mb-20 mt-4 flex w-full max-w-[1400px] flex-col px-10 2xl:px-0">
      <div>
        {children}
        <Card className="relative overflow-hidden shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Mức giá phổ biến</CardTitle>
            <CardDescription className="flex divide-x text-base text-black">
              {Object.keys(chartConfig).map(
                (key) =>
                  key && (
                    <span key={key} className="mr-4 flex items-center">
                      <Dot size={40} strokeWidth={4} style={{ color: chartConfig[key].color }} />
                      {chartConfig[key].label}
                    </span>
                  ),
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" height={60} tickMargin={8} padding={{ left: 40, right: 40 }}>
                  <Label value="Tháng" position="insideBottom" style={{ textAnchor: 'middle' }} />
                </XAxis>
                <YAxis width={52} tickMargin={8} tickSize={8} allowDecimals={false}>
                  <Label
                    value="Giá (tỷ VNĐ)"
                    position="insideLeft"
                    angle={-90}
                    offset={10}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                {Object.keys(chartConfig).map((key) => (
                  <Line
                    connectNulls
                    key={key}
                    dataKey={(data) => data[key]?.price}
                    type="linear"
                    stroke={chartConfig[key].color}
                    strokeWidth={2}
                    unit={'tỷ VNĐ'}
                    name={key}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="justify-center">
            <span className="text-gray-500">Biểu đồ lịch sử biến động giá</span>
          </CardFooter>
          {projects[0] === null && (
            <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-[#fefefe]">
              <img src={PlaceholderImage} alt="placeholder image" className="size-32" />
              <h3 className="mb-5 mt-3 text-lg font-semibold">Thêm dự án để so sánh</h3>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProjectPriceComparison;

import { Dot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toBillions } from '@/lib/utils';
import { Project } from '@/types/project.type';
import PlaceholderImage from '@/assets/images/placeholder.svg';

const ProjectPriceComparison = ({ projects }: { projects: Project[] }) => {
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const generateChartConfig = (projects: Project[]): Record<string, { label: string; color: string }> => {
    const colorPalette = ['#094bf4', '#ff8718', '#00c64f'];

    return projects.reduce(
      (config, project, index) => {
        const color = colorPalette[index % colorPalette.length];
        config[project?.name] = {
          label: project?.name,
          color,
        };
        return config;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  };

  useEffect(() => {
    const result = [];
    projects?.forEach((project) => {
      project?.prices?.forEach((price) => {
        const month = `T${price.unit}-${price.year}`;
        let monthEntry = result.find((entry) => entry.month === month);
        if (!monthEntry) {
          monthEntry = { month };
          result.push(monthEntry);
        }
        monthEntry[project?.name] = toBillions(price?.price);
      });
    });

    setChartConfig(generateChartConfig(projects));
    setChartData(result);
  }, [projects]);

  return (
    <div className="m-auto mb-20 mt-4 flex w-full max-w-[1400px] flex-col">
      <div>
        <h2 className="mb-8 w-full text-left text-4xl font-semibold">So sánh giá bất động sản</h2>
        <Card className="relative shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Mức giá phổ biến của các căn Chung cư</CardTitle>
            <CardDescription className="flex divide-x text-base text-black">
              {Object.keys(chartConfig).map(
                (key) =>
                  key !== 'undefined' && (
                    <span key={key} className="mr-4 flex items-center">
                      <Dot size={40} strokeWidth={4} style={{ color: chartConfig[key].color }} />
                      {chartConfig[key].label}
                    </span>
                  ),
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full pt-4">
              <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickMargin={8} padding={{ left: 40, right: 40 }} />
                <YAxis width={40} tickMargin={8} tickSize={8} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent className="w-[220px]" />} />
                {Object.keys(chartConfig).map((key) => (
                  <Line
                    connectNulls
                    key={key}
                    dataKey={key}
                    type="linear"
                    stroke={chartConfig[key].color}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </CardContent>
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

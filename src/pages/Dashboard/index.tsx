/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from '@/components/LoadingScreen';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig } from '@/components/ui/chart';
import BarChartLabel from '@/components/ui/chart/BarChartLabel';
import { BarChartMultiple } from '@/components/ui/chart/BarChartMultiple';
import { PieChartLegend } from '@/components/ui/chart/PieChartLegend';
import { useStatistic } from '@/hooks/useStatistic';
import { rounded } from '@/lib/utils';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';
import { Building } from 'lucide-react';
import ErrorPage from '../ErrorPage';

const Dashboard = () => {
  const { data, loading, error } = useStatistic();
  const { projects, loading: loading2, fetchProjects } = useProjectStore();
  const navigate = useNavigate();

  const pieChartConfig = {
    count: {
      label: 'Số lượng',
    },
    ...data.district.reduce((acc: any, item: any, _: number) => {
      acc[item.district] = {
        label: item.district,
        color: item.fill,
      };
      return acc;
    }, {}),
  } satisfies ChartConfig;

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchProjects();
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [fetchProjects]);

  const totalProjects = data.price.reduce((acc: number, item: any) => acc + item.count, 0);

  const avgPrice = rounded(
    projects.reduce((acc: number, item: Project) => acc + item.maxSellingPrice, 0) / projects.length / 1000000000,
  );

  const avgPricePerMeter = rounded(
    projects.reduce((acc: number, item: Project) => acc + (item?.maxUnitPrice ?? 0), 0) / projects.length / 1000000,
  );

  if (loading && loading2) {
    <LoadingScreen />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Tổng quan</h1>
      <div className="flex grow flex-col gap-4">
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số lượng dự án BĐS</p>
                  <h3 className="text-2xl font-bold">{totalProjects}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số lượng quận tiêu biểu</p>
                  <h3 className="text-2xl font-bold">{data.district.length - 1}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá trung bình (tỷ VNĐ)</p>
                  <h3 className="text-2xl font-bold">{avgPrice}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá trung bình/m2 (triệu VNĐ)</p>
                  <h3 className="text-2xl font-bold">{avgPricePerMeter}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grow grid-cols-1 gap-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <BarChartLabel
              title="Biểu đồ số lượng dự án bất động sản theo giá (tỷ VNĐ)"
              chartConfig={{
                count: {
                  label: 'Dự án BĐS',
                  color: '#3182CE',
                },
              }}
              chartData={data.price}
              xAxisDataKey="priceRange"
              barDataKey="count"
              barColor="#3182CE"
            />

            <BarChartLabel
              title="Biểu đồ số lượng dự án bất động sản theo diện tích (ha)"
              chartConfig={{
                projectCount: {
                  label: 'Dự án BĐS',
                  color: '#ffa04c',
                },
              }}
              chartData={data.area}
              xAxisDataKey="areaCategory"
              barDataKey="projectCount"
              barColor="#ffa04c"
            />

            <PieChartLegend
              title="Biểu đồ số lượng dự án bất động sản theo quận"
              chartConfig={pieChartConfig}
              chartData={data.district}
              dataKey="count"
              nameKey="district"
            />

            <BarChartMultiple
              title="Biểu đồ số lượng dự án bất động sản theo giá đỗ xe (VNĐ)"
              chartConfig={{
                bike: {
                  label: 'Xe máy',
                  color: '#3182CE',
                },
                car: {
                  label: 'Xe ô tô',
                  color: '#ffa04c',
                },
              }}
              chartData={data.parking}
              xAxisKey="price"
              firstColumnKey="bike"
              secondColumnKey="car"
              firstColumnColor="#3182CE"
              secondColumnColor="#ffa04c"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

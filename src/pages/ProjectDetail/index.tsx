import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import DetailDeveloper from '@/assets/images/detail-developer.png';
import DetailHandover from '@/assets/images/detail-handover.png';
import DetailPriceM2 from '@/assets/images/detail-price-m2.png';
import DetailPrice from '@/assets/images/detail-price.png';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentMonthYear, toMillionPriceRange, toNumberWithCommas, toPriceRange, toRangeString } from '@/lib/utils';
import { getPlacesOfProject } from '@/services/place.service';
import { getPricesOfProject } from '@/services/price.service';
import { getPropertyTypesOfProject } from '@/services/property-type.service';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';
import ErrorPage from '@/pages/ErrorPage';
import Map from '@/components/Map';
import { place_categories, PlaceCategories } from '@/types/place.type';
import { Button } from '@/components/ui/button';
import MapPin from '@/assets/images/mapPins';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoadingScreen from '@/components/LoadingScreen';
import ProjectPriceComparison from '@/components/ProjectPriceComparison';

const ProjectDetail = () => {
  const { fetchProjects, projects } = useProjectStore();
  const { id } = useLocation().state || {};
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategories>(PlaceCategories.SCHOOL);

  useEffect(() => {
    const loadProjects = async () => {
      if (!projects.length) await fetchProjects();
      const initialProject =
        projects.find((p) => p.id === id) || projects.find((p) => p.name === decodeURIComponent(name));
      if (initialProject) setProject(initialProject);
    };

    loadProjects();
  }, [fetchProjects, projects, id, name]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (project && (!project.properties || !project.places || !project.prices)) {
        const [propertyTypes, places, prices] = await Promise.all([
          getPropertyTypesOfProject(project.id),
          getPlacesOfProject(project.id),
          getPricesOfProject(project.id),
        ]);
        setProject({
          ...project,
          properties: propertyTypes.sort((a, b) => a.numberOfBedroom - b.numberOfBedroom),
          places,
          prices,
        });
      }
    };

    loadProjectDetails();
  }, [project]);

  const renderPropertyTable = () =>
    project.properties && (
      <div className="mt-5 text-lg">
        <h4 className="font-semibold">Giá bán căn hộ</h4>
        <Table className="mt-3 border text-base *:*:w-1/3 *:*:*:border">
          <TableHeader>
            <TableRow>
              <TableHead>Loại căn hộ</TableHead>
              <TableHead>Diện tích</TableHead>
              <TableHead>Giá bán</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.properties.map((prop) => (
              <TableRow key={prop.numberOfBedroom}>
                <TableCell>{prop.numberOfBedroom} phòng ngủ</TableCell>
                <TableCell>{toRangeString(prop.minArea, prop.maxArea)} m²</TableCell>
                <TableCell>{toPriceRange(prop.minPrice, prop.maxPrice)} tỷ</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );

  const renderOverviewDetails = () => (
    <div className="mt-8 flex w-full gap-14 rounded-xl border px-6 pb-8 pt-4 shadow-xl *:w-1/2">
      <div>
        {[
          { label: 'Phân khúc', value: project.rank },
          { label: 'Quy mô', value: `${project.totalArea} ha` },
          { label: 'Mật độ xây dựng', value: `${project.ctsnDens} %` },
          { label: 'Phí đỗ xe máy/ tháng', value: `${toNumberWithCommas(project.bikeParkingMonthly) || 0} đ/tháng` },
          { label: 'Phí đỗ ô tô/ tháng', value: `${toNumberWithCommas(project.carParkingMonthly) || 0} đ/tháng` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between border-b pb-2 pt-6">
            <p>{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div>
        {[
          { label: 'Số thang máy/ toà', value: project.numberEle },
          { label: 'Số căn/ tầng', value: toRangeString(project.minPropPerFloor, project.maxPropPerFloor) },
          { label: 'Số tầng hầm đỗ xe', value: project.numberBasement },
          { label: 'Số toà', value: project.blocks },
          { label: 'Số tầng nổi', value: project.numberLivingFloor },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between border-b pb-2 pt-6">
            <p>{label}</p>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    if (project) {
      document.title = `${project.name} - ${project.address}`;
    }
    return () => clearTimeout(timer);
  }, [project]);

  if (!project) return <ErrorPage />;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="m-auto flex w-full max-w-[1200px] flex-col px-10 pt-16 *:border-b *:pb-6 *:pt-4 2xl:px-0">
      <img
        src={project?.masterPlanUrl}
        alt="project's thumbnail"
        className="aspect-16-9 w-full rounded-xl border-none !py-0"
      />
      <div>
        <h1 className="text-4xl font-bold">{project?.name}</h1>
        <div className="mt-3 flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-base font-semibold text-blue-500">
                <img src={MapPin.Pin} alt="Map pin" className="size-6" />
                <span className="ml-2">Xem bản đồ</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="z-[10000] flex h-screen !w-screen min-w-full flex-col">
              <DialogHeader>
                <DialogTitle>{project?.name}</DialogTitle>
                <DialogDescription>{project?.address}</DialogDescription>
              </DialogHeader>
              <div className="size-full">
                <Map project={project} />
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-gray-500">{project?.address}</span>
        </div>
      </div>
      <section>
        <h2 className="text-2xl font-semibold">Giá bán</h2>
        <p className="text-gray-500">
          Căn hộ chung cư dự án {project?.name} {getCurrentMonthYear()}
        </p>
        <div className="mt-6 flex gap-14 *:w-1/2">
          {[
            {
              img: DetailPrice,
              label: 'Giá',
              value: toPriceRange(project?.minSellingPrice, project?.maxSellingPrice) + ' tỷ',
            },
            {
              img: DetailPriceM2,
              label: 'Giá theo m²',
              value: toMillionPriceRange(project?.minUnitPrice, project?.maxUnitPrice) + ' triệu/m²',
            },
          ].map(({ img, label, value }) => (
            <div key={label} className="flex items-center gap-5">
              <img src={img} alt={label} className="aspect-square w-14 min-w-14" />
              <div>
                <p className="text-gray-500">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
        {renderPropertyTable()}
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Tổng quan</h2>
        <p className="text-gray-500">
          Căn hộ chung cư dự án {project?.name} {getCurrentMonthYear()}
        </p>
        <div className="mt-6 flex gap-14 *:w-1/2">
          {[
            { img: DetailDeveloper, label: 'Chủ đầu tư', value: project?.developerName },
            {
              img: DetailHandover,
              label: 'Thời điểm bàn giao',
              value: project?.handoverDate
                ? new Date(project?.handoverDate).toLocaleDateString('vi-VN')
                : 'Đang cập nhật',
            },
          ].map(({ img, label, value }) => (
            <div key={label} className="flex items-center gap-5">
              <img src={img} alt={label} className="aspect-square w-14 min-w-14" />
              <div>
                <p className="text-gray-500">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
        {renderOverviewDetails()}
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Tiện ích ngoại khu</h2>
        <p className="mb-4 mt-2 text-gray-500">
          Dự án {project?.name} sở hữu các tiện ích ngoại khu bao gồm{' '}
          {project?.places?.filter((p) => p.category === PlaceCategories.SCHOOL).length} trường học và trung tâm dạy
          học, {project?.places?.filter((p) => p.category === PlaceCategories.STORE).length} trung tâm mua sắm và siêu
          thị, {project?.places?.filter((p) => p.category === PlaceCategories.HOSPITAL).length} bệnh viện và phòng khám
        </p>
        <div className="h-[500px]">
          <Map project={project} category={selectedCategory} />
        </div>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {place_categories.map((category) => (
            <Button
              variant="ghost"
              key={category.value}
              className={`gap-3 rounded-full border border-gray-300 px-6 py-4 text-base font-semibold ${category.value === selectedCategory ? 'border-blue-500 bg-blue-500 bg-opacity-10' : ''}`}
              onClick={() => setSelectedCategory(category.value as PlaceCategories)}
            >
              <img src={category.icon} alt={category.label} className="filter-[invert(.5)] size-4" />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
      </section>
      <section>
        <ProjectPriceComparison projects={[project]}>
          <h2 className="text-2xl font-semibold">Biến động giá</h2>
          <p className="mb-4 mt-2 text-gray-500">
            Căn hộ chung cư dự án {project?.name} {getCurrentMonthYear()}
          </p>
        </ProjectPriceComparison>
      </section>
    </div>
  );
};

export default ProjectDetail;

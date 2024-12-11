import { isValidElement } from 'react';

import PlaceholderImage from '@/assets/images/placeholder.svg';
import PlaceCategoryComparison from '@/components/PlaceCategoryComparison';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  compareNumerical,
  getAverage,
  rounded,
  toMillionPriceRange,
  toNumberWithCommas,
  toPriceRange,
  toRangeString,
} from '@/lib/utils';
import { place_categories, PlaceCategories } from '@/types/place.type';
import { Project } from '@/types/project.type';

const SectionHeader = ({ title }) => (
  <TableRow>
    <TableCell colSpan={4} className="bg-[#eff3ff] !text-lg font-semibold !text-[#042066]">
      {title}
    </TableCell>
  </TableRow>
);

const getBackgroundColor = (value, rank, showDiff) => {
  if (([undefined, null, 0].includes(value) || rank === 3) && showDiff) return 'bg-[#ff7e81]';
  if (rank === 1) return 'bg-[#90ee90]';
  if (rank === 2) return 'bg-[#fff59e]';
  return 'bg-white';
};

const renderRow = (label, projects, accessorKey, accessorFn, showDiff, comparisonFn, order = 'none', unit = '') => {
  const compareValues = projects.map((p) => p && getAverage(accessorKey?.split(',').map((key) => p[key]) || []));
  const ranks = comparisonFn?.(compareValues, showDiff ? order : 'none') || [];
  const values = projects.map((p) => (p ? (accessorFn?.(p) ?? p[accessorKey]) : null));

  return (
    <TableRow key={label}>
      <TableCell className="min-w-[300px]">{label}</TableCell>
      {values.map((value, index) => {
        return (
          <TableCell key={index} className={`relative ${getBackgroundColor(value, ranks[index], showDiff)}`}>
            {value ? (isValidElement(value) ? value : `${value} ${unit}`) : '- -'}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const renderSection = (title, rows, projects, showDiff = false) => (
  <>
    <SectionHeader title={title} />
    {rows.map((row) =>
      renderRow(row.label, projects, row.accessorKey, row.accessorFn, showDiff, compareNumerical, row.order, row.unit),
    )}
  </>
);

const ProjectComparison = ({
  projects,
  showDiff,
  isMobile,
}: {
  projects: Project[];
  showDiff: boolean;
  isMobile: boolean;
}) => {
  projects = projects.slice(0, isMobile ? 2 : 3);
  const rows = {
    price: [
      {
        label: 'Khoảng giá bán',
        accessorKey: 'minSellingPrice,maxSellingPrice',
        accessorFn: (p) => toPriceRange(p?.minSellingPrice, p?.maxSellingPrice),
        unit: 'tỷ',
        order: 'asc',
      },
      {
        label: 'Giá bán theo m²',
        accessorKey: 'minUnitPrice,maxUnitPrice',
        accessorFn: (p) => toMillionPriceRange(p?.minUnitPrice, p?.maxUnitPrice),
        unit: 'triệu',
        order: 'asc',
      },
    ],
    area: [...Array(6)].map((_, index) => ({
      label: `Diện tích căn ${index} phòng ngủ`,
      accessorFn: (p) => {
        const propertyType = p?.properties?.find((property) => property?.numberOfBedroom === index);
        return propertyType ? toRangeString(propertyType?.minArea, propertyType?.maxArea) : null;
      },
      unit: 'm²',
    })),
    projectInfo: [
      { label: 'Địa chỉ', accessorKey: 'address' },
      { label: 'Chủ đầu tư', accessorKey: 'developerName' },
      {
        label: 'Ảnh dự án',
        accessorKey: 'masterPlanUrl',
        accessorFn: (p) => (
          <img
            src={p?.masterPlanUrl || 'https://placehold.co/250x150?text=404'}
            alt={`${p?.name}'s image`}
            className="w-full rounded-md object-cover"
          />
        ),
      },
      { label: 'Thời điểm bàn giao', accessorKey: 'handoverDate' },
      { label: 'Phân khúc', accessorKey: 'rank' },
      {
        label: 'Quy mô',
        accessorKey: 'totalArea',
        accessorFn: (p) => ((p?.totalArea || 0) !== 0 ? `${p.totalArea} ha` : '- -'),
        order: 'desc',
      },
      {
        label: 'Mật độ xây dựng',
        accessorKey: 'ctsnDens',
        accessorFn: (p) => {
          const density = p?.ctsnDens ? (p.ctsnDens < 1 ? p.ctsnDens * 100 : p.ctsnDens) : 0;
          return density !== 0 ? `${rounded(density)} %` : '- -';
        },
        order: 'desc',
      },
    ],
    parking: [
      {
        label: 'Phí đỗ xe máy/ tháng',
        accessorKey: 'bikeParkingMonthly',
        accessorFn: (p) => toNumberWithCommas(p?.bikeParkingMonthly),
        unit: 'đ/tháng',
        order: 'asc',
      },
      {
        label: 'Phí đỗ ô tô/ tháng',
        accessorKey: 'carParkingMonthly',
        accessorFn: (p) => toNumberWithCommas(p?.carParkingMonthly),
        unit: 'đ/tháng',
        order: 'asc',
      },
      { label: 'Số thang máy/ toà', accessorKey: 'numberEle', unit: 'thang/tòa', order: 'desc' },
      {
        label: 'Số căn/ tầng',
        accessorKey: 'minPropPerFloor,maxPropPerFloor',
        accessorFn: (p) => toRangeString(p?.minPropPerFloor, p?.maxPropPerFloor),
        unit: 'căn/tầng',
        order: 'desc',
      },
    ],
    building: [
      { label: 'Số tầng hầm đỗ xe', accessorKey: 'numberBasement', unit: 'tầng', order: 'desc' },
      { label: 'Số toà', accessorKey: 'blocks', unit: 'toà', order: 'desc' },
      { label: 'Số tầng nổi', accessorKey: 'numberLivingFloor', unit: 'tầng', order: 'desc' },
      { label: 'Tổng số căn', accessorKey: 'totalProperty', unit: 'căn', order: 'desc' },
    ],
  };

  return (
    <div className="m-auto my-10 flex w-full max-w-[1400px] flex-col px-10 2xl:px-0">
      <div>
        <h2 className="mb-4 w-full text-left text-4xl font-semibold">So sánh thông tin dự án</h2>
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-2xl">
          {projects[0] ? (
            <Table className="[&_td:first-child]:text-[#6f6f6f] [&_td:not(:first-child)]:w-[340px] [&_td:not(:first-child)]:font-semibold [&_td:not(:last-child)]:border-r [&_td]:p-5 [&_td]:text-base [&_tr]:h-16">
              <TableHeader className="text-lg font-semibold [&_th:not(:last-child)]:border-r [&_th]:p-5 [&_th]:text-[#042066]">
                <TableRow className="bg-[#eff3ff] hover:bg-[#eff3ff]">
                  <TableHead></TableHead>
                  {projects.map((project, index) => (
                    <TableHead key={index}>{project?.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {renderSection('Giá theo loại căn', [...rows.price, ...rows.area], projects, showDiff)}
                {renderSection('Tổng quan dự án', rows.projectInfo, projects, showDiff)}
                {renderSection('Thông tin phân khu', [...rows.parking, ...rows.building], projects, showDiff)}
                <SectionHeader title="Tiện ích xung quanh" />
                {Object.values([PlaceCategories.SCHOOL, PlaceCategories.HOSPITAL, PlaceCategories.OTHER]).map(
                  (category) => (
                    <PlaceCategoryComparison
                      key={category}
                      projects={projects}
                      category={category}
                      categoryName={place_categories[place_categories.findIndex((c) => c.value === category)].label}
                    />
                  ),
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[500px] w-full flex-col items-center justify-center">
              <img src={PlaceholderImage} alt="placeholder image" className="size-32" />
              <h3 className="mb-5 mt-3 text-lg font-semibold">Thêm dự án để so sánh</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectComparison;

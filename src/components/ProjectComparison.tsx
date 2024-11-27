import { Project } from '@/types/project.type';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { rounded, toMillionPriceRange, toNumberWithCommas, toPriceRange, toRangeString } from '@/lib/utils';
import { PlaceCategories } from '@/types/place.type';

const ProjectComparison = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="m-auto mb-20 mt-10 flex w-full max-w-[1400px] flex-col">
      <div>
        <h2 className="mb-4 w-full text-left text-4xl font-semibold">So sánh thông tin dự án</h2>
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-2xl">
          <Table className="[&_td:first-child]:text-[#6f6f6f] [&_td:not(:first-child)]:w-[340px] [&_td:not(:first-child)]:font-semibold [&_td:not(:last-child)]:border-r [&_td]:p-5 [&_td]:text-base [&_tr]:h-16">
            <TableHeader className="text-lg font-semibold [&_th:not(:last-child)]:border-r [&_th]:p-5 [&_th]:text-[#042066]">
              <TableRow className="bg-[#eff3ff] hover:bg-[#eff3ff]">
                <TableHead></TableHead>
                {projects.map((project, index) => (
                  <TableHead key={index}>{project?.name || ''}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="[&_tr]:odd:bg-[#f4f4f4]">
              <TableRow>
                <TableCell colSpan={4} className="bg-[#eff3ff] !text-lg font-semibold !text-[#042066]">
                  Giá theo loại căn
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Khoảng giá bán</TableCell>
                {projects.map((project, index) => {
                  const price = toPriceRange(project?.minSellingPrice, project?.maxSellingPrice);
                  return <TableCell key={index}>{price.includes('NaN') ? '- -' : `${price} tỷ`}</TableCell>;
                })}
              </TableRow>
              <TableRow>
                <TableCell>
                  Giá bán theo m<sup>2</sup>
                </TableCell>
                {projects.map((project, index) => {
                  const price = toMillionPriceRange(project?.minUnitPrice, project?.maxUnitPrice);
                  return <TableCell key={index}>{price.includes('NaN') ? '- -' : `${price} triệu`}</TableCell>;
                })}
              </TableRow>
              {[...Array(6)].map((_, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>Diện tích căn {index} phòng ngủ</TableCell>
                    {projects.map((project) => {
                      const propertyType = project?.properties?.find((property) => property?.numberOfBedroom === index);
                      const areaRange = propertyType
                        ? toRangeString(propertyType?.minArea, propertyType?.maxArea)
                        : '- -';
                      return (
                        <TableCell key={project?.id}>{areaRange !== '- -' ? `${areaRange} m²` : areaRange}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={4} className="bg-[#eff3ff] !text-lg font-semibold !text-[#042066]">
                  Tổng quan dự án
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Địa chỉ</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>{project?.address || '- -'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Chủ đầu tư</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>{project?.developerName || '- -'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Ảnh dự án</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>
                    <img
                      src={project?.masterPlanUrl ? project.masterPlanUrl : 'https://placehold.co/250x150?text=404'}
                      alt={`${project?.name}'s image`}
                      className="w-full rounded-md object-cover"
                    />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Thời điểm bàn giao</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>{project?.handoverDate || '- -'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Phân khúc</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>{project?.rank || '- -'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Quy mô</TableCell>
                {projects.map((project, index) => (
                  <TableCell key={index}>
                    {(project?.totalArea || 0) !== 0 ? `${project.totalArea} ha` : '- -'}{' '}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Mật độ xây dựng</TableCell>
                {projects.map((project, index) => {
                  const density = project?.ctsnDens
                    ? project.ctsnDens < 1
                      ? project?.ctsnDens * 100
                      : project?.ctsnDens
                    : 0;
                  return <TableCell key={index}>{density !== 0 ? `${rounded(density)} %` : '- -'}</TableCell>;
                })}
              </TableRow>

              <TableRow>
                <TableCell colSpan={4} className="bg-[#eff3ff] !text-lg font-semibold !text-[#042066]">
                  Thông tin phân khu
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Phí đỗ xe máy/ tháng</TableCell>
                {projects.map((project, index) => {
                  const price = project?.bikeParkingMonthly || 0;
                  return (
                    <TableCell
                      key={index}
                    >{`${price !== 0 ? `${toNumberWithCommas(price)}đ/tháng` : '- -'}`}</TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell>Phí đỗ ô tô/ tháng</TableCell>
                {projects.map((project, index) => {
                  const price = project?.carParkingMonthly || 0;
                  return (
                    <TableCell
                      key={index}
                    >{`${price !== 0 ? `${toNumberWithCommas(price)}đ/tháng` : '- -'}`}</TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell>Số thang máy/ toà</TableCell>
                {projects.map((project, index) => (
                  <TableCell
                    key={index}
                  >{`${(project?.numberEle || 0) !== 0 ? `${project.numberEle} thang/tòa` : '- -'}`}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Số căn/ tầng</TableCell>
                {projects.map((project, index) => {
                  const props = toRangeString(project?.minPropPerFloor, project?.maxPropPerFloor);
                  return <TableCell key={index}>{props.includes('NaN') ? '- -' : `${props} căn/tầng`}</TableCell>;
                })}
              </TableRow>
              <TableRow>
                <TableCell>Số tầng hầm đỗ xe</TableCell>
                {projects.map((project, index) => (
                  <TableCell
                    key={index}
                  >{`${(project?.numberBasement || 0) !== 0 ? `${project?.numberBasement} tầng` : '- -'}`}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Số toà</TableCell>
                {projects.map((project, index) => (
                  <TableCell
                    key={index}
                  >{`${(project?.blocks || 0) !== 0 ? `${project?.blocks} toà` : '- -'}`}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Số tầng nổi</TableCell>
                {projects.map((project, index) => (
                  <TableCell
                    key={index}
                  >{`${(project?.numberLivingFloor || 0) !== 0 ? `${project?.numberLivingFloor} tầng` : '- -'}`}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Tổng số căn</TableCell>
                {projects.map((project, index) => (
                  <TableCell
                    key={index}
                  >{`${(project?.totalProperty || 0) !== 0 ? `${project?.totalProperty} căn` : '- -'}`}</TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell colSpan={4} className="bg-[#eff3ff] !text-lg font-semibold !text-[#042066]">
                  Tiện ích
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">Trường học</TableCell>
                {projects.map((project, index) => {
                  const schools = project?.places?.filter((place) => place?.category === PlaceCategories.SCHOOL);
                  return (
                    <TableCell key={index} className="align-top">
                      <span className="text-om-t14 mb-1 inline font-medium">{schools?.length || 0} Trường học</span>
                      <ul className="list-inside list-disc pl-4">
                        {schools?.map((place) => (
                          <li key={place.id} className="font-medium">
                            {place.name}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="align-top">Bệnh viện/Phòng khám</TableCell>
                {projects.map((project, index) => {
                  const hospitals = project?.places?.filter((place) => place?.category === PlaceCategories.HOSPITAL);
                  return (
                    <TableCell key={index} className="align-top">
                      <span className="text-om-t14 mb-1 inline font-medium">
                        {hospitals?.length || 0} Bệnh viện/Phòng khám
                      </span>
                      <ul className="list-inside list-disc pl-4">
                        {hospitals?.map((place) => (
                          <li key={place.id} className="font-medium">
                            {place.name}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="align-top">Khác</TableCell>
                {projects.map((project, index) => {
                  const others = project?.places?.filter(
                    (place) =>
                      place?.category !== PlaceCategories.SCHOOL && place?.category !== PlaceCategories.HOSPITAL,
                  );
                  return (
                    <TableCell key={index} className="align-top">
                      <span className="text-om-t14 mb-1 inline font-medium">{others?.length || 0} tiện ích khác</span>
                      <ul className="list-inside list-disc pl-4">
                        {others?.map((place) => (
                          <li key={place.id} className="font-medium">
                            {place.name}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectComparison;

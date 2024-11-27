import useProjectStore from '@/stores/project.store';
import { useEffect, useState } from 'react';
import HomepageBackground from '@/assets/images/homepage-bg.webp';
import PickImage from '@/assets/images/pick-image.jpg';
import { Building, Check, CirclePlus, Plus, X } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project.type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getPropertyTypesOfProject } from '@/services/property-type.service';
// import { PropertyType } from '@/types/property-type.type';
import { Input } from '@/components/ui/input';
import LoadingScreen from '@/components/LoadingScreen';
import ProjectComparison from '@/components/ProjectComparison';
import { getPlacesOfProject } from '@/services/place.service';
import ProjectPriceComparison from '@/components/ProjectPriceComparison';
import { getPricesOfProject } from '@/services/price.service';

const Homepage = () => {
  const { projects, fetchProjects, loading } = useProjectStore();
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([null, null, null]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchValue) {
      setVisibleProjects(
        projects?.filter(
          (project) =>
            project?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            project?.address.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setVisibleProjects(projects);
    }
  }, [searchValue, projects]);

  useEffect(() => {
    const fetchData = async () => {
      const projectsToFetch = selectedProjects.filter(
        (project) => project && !project.properties && !project.places && !project.prices,
      );

      for (const project of projectsToFetch) {
        const propertyTypes = await getPropertyTypesOfProject(project.id);
        const places = await getPlacesOfProject(project.id);
        const prices = await getPricesOfProject(project.id);
        setSelectedProjects((prev) =>
          prev.map((p) => (p?.id === project.id ? { ...project, properties: propertyTypes, places, prices } : p)),
        );
      }
    };

    fetchData();
  }, [selectedProjects]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     for (const project of selectedProjects) {
  //       if (project) {
  //         const propertyTypes = await getPropertyTypesOfProject(project.id);
  //         propertyTypes.forEach((propertyType) => {
  //           propertyType.projectId = project.id;
  //         });
  //         propertyTypes.sort((a, b) => a.numberOfBedroom - b.numberOfBedroom);
  //         setSelectedPropertyTypes((prev) => [...prev, ...propertyTypes]);
  //       }
  //     }
  //   };

  //   setSelectedPropertyTypes([]);
  //   fetchData();
  // }, [selectedProjects]);

  // const handleChangePropertyType = (projectId: string, propertyTypeId: string) => {
  //   setSelectedProjects((prev) =>
  //     prev.map((project) =>
  //       project?.id === projectId
  //         ? {
  //             ...project,
  //             minSellingPrice: selectedPropertyTypes.find((property) => property.id === propertyTypeId)?.minPrice,
  //             maxSellingPrice: selectedPropertyTypes.find((property) => property.id === propertyTypeId)?.maxPrice,
  //           }
  //         : project,
  //     ),
  //   );
  // };

  const handleAddProject = (project: Project) => {
    setSelectedProjects((prev) => {
      const updatedProjects = [...prev];
      const firstNullIndex = updatedProjects.indexOf(null);
      if (firstNullIndex !== -1) {
        updatedProjects[firstNullIndex] = project;
      }
      return [...updatedProjects.filter((p) => p !== null), ...updatedProjects.filter((p) => p === null)].slice(0, 3);
    });
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = selectedProjects.map((project) => (project?.id === id ? null : project));
    setSelectedProjects([
      ...updatedProjects.filter((project) => project),
      ...updatedProjects.filter((project) => !project),
    ]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="m-auto flex w-full flex-col pt-16">
      <div className="relative flex h-fit flex-col">
        <div className="absolute left-0 top-0 -z-10 h-full w-full">
          <img src={HomepageBackground} alt="Homepage background" className="w-full" />
        </div>
        <div className="w-full pt-7 *:m-auto *:max-w-[1400px]">
          <div>
            <h1 className="text-5xl font-medium leading-[64px]">So sánh dự án bất động sản</h1>
            <div className="mb-5 mt-2 flex gap-5 *:pr-4 [&>:not(:last-child)]:border-r">
              <div>
                <span className="mr-2 text-2xl font-medium">14</span>
                <span className="text-gray-500">Quận huyện</span>
              </div>
              <div>
                <span className="mr-2 text-2xl font-medium">390+</span>
                <span className="text-gray-500">Dự án</span>
              </div>
              <div>
                <span className="mr-2 text-2xl font-medium">5,692,000+</span>
                <span className="text-gray-500">Căn nhà</span>
              </div>
            </div>
          </div>
          <div className="mt-28 flex min-h-[180px] overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="aspect-square h-[400px]">
              <img src={PickImage} alt="hp-image" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="flex max-w-full flex-1 flex-col">
              <div>
                <span className="block px-5 py-4 text-xl font-semibold text-black">
                  Chọn các dự án bất động sản cần so sánh
                </span>
                <div className="flex divide-x divide-dashed border-b border-t *:min-h-44 *:w-1/3">
                  {selectedProjects.map((project, index) =>
                    project ? (
                      <div key={project.id || index} className="flex flex-1 px-5 py-3">
                        <div className="w-full">
                          <div className="mb-3 flex min-h-[48px] items-start justify-between">
                            <a
                              href="#"
                              className="line-clamp-2 h-14 cursor-pointer text-lg font-semibold text-[#094bf4] underline"
                            >
                              {project.name}
                            </a>
                            <div className="cursor-pointer" onClick={() => handleDeleteProject(project.id)}>
                              <X className="size-6 text-gray-400" />
                            </div>
                          </div>
                          {/* <div>
                            <div className="m-2 ml-0 flex flex-col gap-2">
                              <Label className="text-lg">Loại căn chung cư:</Label>
                              <Select onValueChange={handleChangePropertyType(project.id, property.id)} value={undefined}>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Chọn loại căn chung cư" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedPropertyTypes.map(
                                    (property) =>
                                      property.projectId === project.id && (
                                        <SelectItem key={property.id} value={property.id}>
                                          {property.numberOfBedroom} phòng ngủ
                                        </SelectItem>
                                      ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="relative flex px-5 py-3">
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setIsModalOpen(true)}
                              className="flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-[#094bf4] bg-white text-xl text-[#094bf4] hover:border-solid hover:bg-white"
                            >
                              <CirclePlus />
                              <div>Thêm dự án</div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="no-scrollbar max-h-[400px] max-w-[800px] overflow-y-auto p-0">
                            <DialogHeader className="p-6 pb-2">
                              <DialogTitle className="mb-2">Chọn dự án</DialogTitle>
                              <DialogDescription>
                                <Input
                                  placeholder="Tìm kiếm dự án"
                                  className="w-full px-3 py-6"
                                  onChange={(e) => {
                                    setSearchValue(e.target.value);
                                  }}
                                  value={searchValue}
                                />
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col">
                              {visibleProjects?.map((project) => (
                                <div
                                  key={project?.id}
                                  onClick={() => {
                                    setIsModalOpen(false);
                                    handleAddProject(project);
                                  }}
                                >
                                  <div className="flex cursor-pointer items-center px-5 py-3 hover:bg-[#f4f4f4]">
                                    <Building />
                                    <div className="ml-3 font-medium text-black">
                                      <span>{project?.name}</span>
                                      <span className="ml-4 text-sm text-gray-500">{project?.address}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ),
                  )}
                </div>
                <div></div>
              </div>
              <div className="flex flex-1 flex-wrap gap-2 px-5 py-3">
                {projects?.slice(0, 10).map((project) => {
                  const addClasses = `${selectedProjects.find((p) => p?.id === project.id) ? 'border-[#094bf4] bg-[#eff3ff] text-[#094bf4] hover:bg-[#d7e2ff]' : 'border-gray-300 bg-white text-black hover:bg-[#f4f4f4]'} ${selectedProjects[2] != null && (!selectedProjects.find((p) => p?.id === project.id) ? 'cursor-not-allowed bg-[#f4f4f4] text-[#9f9faa]' : 'cursor-pointer')}`;
                  return (
                    <Button
                      key={project.id}
                      onClick={() => handleAddProject(project)}
                      className={`rounded-full border text-base font-semibold ${addClasses}`}
                    >
                      {project.name}
                      {selectedProjects.find((p) => p?.id === project.id) ? <Check /> : <Plus />}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectComparison projects={selectedProjects} />
      <ProjectPriceComparison projects={selectedProjects} />
    </main>
  );
};

export default Homepage;

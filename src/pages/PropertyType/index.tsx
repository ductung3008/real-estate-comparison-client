import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TablePage from '@/components/ui/TablePage/TablePage';
import useProjectStore from '@/stores/project.store';
import usePropertyTypeStore from '@/stores/property-type.store';
import { useEffect, useState } from 'react';
import { columns } from './column';
import PropertyTypesModal from './property-type-modal';

const PropertyTypes = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { fetchProjects, projects } = useProjectStore();
  const { fetchPropertyTypes, propertyTypes, loading } = usePropertyTypeStore();

  useEffect(() => {
    const loadProjects = async () => {
      if (!projects.length) {
        try {
          await fetchProjects();
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadProjects();
  }, [projects, fetchProjects]);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!selectedProject) return;
      try {
        await fetchPropertyTypes(selectedProject);
      } catch (error) {
        console.error(error);
      }
    };

    loadPlaces();
  }, [selectedProject, fetchPropertyTypes]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };

  return (
    <TablePage
      title="Quản lý loại căn chung cư"
      data={propertyTypes}
      columns={columns}
      Modal={PropertyTypesModal}
      loading={loading}
    >
      <div className="m-2 ml-0 flex items-center gap-2">
        <Label className="text-lg">Dự án: </Label>
        <Select onValueChange={handleProjectChange} value={selectedProject || undefined}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Chọn dự án" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </TablePage>
  );
};

export default PropertyTypes;

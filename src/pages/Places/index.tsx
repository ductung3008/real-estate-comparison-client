import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TablePage from '@/components/ui/TablePage/TablePage';
import usePlaceStore from '@/stores/place.store';
import useProjectStore from '@/stores/project.store';
import { columns } from './columns';
import PlaceModal from './place-modal';

const Places = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { fetchProjects, projects } = useProjectStore();
  const { fetchPlaces, places, loading } = usePlaceStore();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!selectedProject) return;
      try {
        await fetchPlaces(selectedProject);
      } catch (error) {
        console.error(error);
      }
    };

    loadPlaces();
  }, [selectedProject, fetchPlaces]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };

  return (
    <TablePage title="Quản lý địa điểm" data={places} columns={columns} Modal={PlaceModal} loading={loading}>
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

export default Places;

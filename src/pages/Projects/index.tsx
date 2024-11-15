import { useEffect } from 'react';

import TablePage from '@/components/ui/TablePage/TablePage';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';
import { columns } from './columns';
import ProjectModal from './project-modal';

const Projects = () => {
  const { projects, loading, fetchProjects } = useProjectStore();

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

  return (
    <TablePage<Project>
      title="Quản lý dự án bất động sản"
      data={projects}
      columns={columns}
      Modal={ProjectModal}
      loading={loading}
    />
  );
};

export default Projects;

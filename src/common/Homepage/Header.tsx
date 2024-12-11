import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '@/assets/images/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';
import { Building, Search } from 'lucide-react';

const Header = () => {
  const { projects, fetchProjects } = useProjectStore();
  const [searchValue, setSearchValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects);

  useEffect(() => {
    if (!projects.length) {
      fetchProjects();
    }
  }, [fetchProjects, projects]);

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

  return (
    <header className="fixed z-[2000] flex h-16 w-full items-center justify-between bg-white px-8 shadow-sm">
      <Link to={'/'}>
        <img src={Logo} alt="Logo" className="size-10" />
      </Link>
      <div>
        <div className="relative w-full">
          <Button className="absolute right-0 top-1/2 aspect-square h-full -translate-y-1/2 transform bg-[#094bf4] hover:bg-[#0635ad]">
            <Search className="text-white hover:cursor-pointer" />
          </Button>
          <Input
            placeholder="Tìm kiếm dự án..."
            className="h-10 w-[400px] border focus:border-[#094bf4]"
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isFocused && (
            <div
              className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-white shadow-md"
              onMouseDown={(e) => e.preventDefault()}
            >
              {visibleProjects.length > 0 ? (
                visibleProjects.slice(0, 20).map((project) => (
                  <Link
                    to={`/project/${encodeURIComponent(project?.name)}`}
                    key={project?.id}
                    state={{ id: project?.id }}
                    className="flex cursor-pointer items-center px-5 py-3 hover:bg-[#f4f4f4]"
                    onClick={() => setIsFocused(false)}
                  >
                    <Building />
                    <div className="ml-3 font-medium text-black">
                      <span>{project?.name}</span>
                      <span className="flex text-sm text-gray-500">{project?.address}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-5 py-3 text-gray-500">Không tìm thấy dự án</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

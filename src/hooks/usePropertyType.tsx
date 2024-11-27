import { useEffect, useState } from 'react';
import { getPropertyTypesOfProject } from '@/services/property-type.service';

export const usePropertyType = (projectId: string) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPropertyTypesOfProject(projectId);
        setPropertyTypes(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { propertyTypes, loading, error };
};

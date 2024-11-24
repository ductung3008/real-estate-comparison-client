import {
  getAreaStatistic,
  getDistrictStatistic,
  getParkingStatistic,
  getPriceStatistic,
} from '@/services/statistic.service';
import { useEffect, useState } from 'react';

export const useStatistic = () => {
  const [data, setData] = useState({
    price: [],
    parking: [],
    district: [],
    area: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [price, parking, district, area] = await Promise.all([
          getPriceStatistic(),
          getParkingStatistic(),
          getDistrictStatistic(),
          getAreaStatistic(),
        ]);

        setData({ price, parking, district, area });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

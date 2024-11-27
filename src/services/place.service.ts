import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';

export const getPlacesOfProject = async (projectId: string) => {
  try {
    const { data: response } = await axios.get(
      ApiConstant.places.list.replace(':projectId', projectId).replace(':size', '1000').replace(':page', '0'),
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

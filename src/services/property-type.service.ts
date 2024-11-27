import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';

export const getPropertyTypesOfProject = async (projectId: string) => {
  try {
    const { data: response } = await axios.get(ApiConstant.propertyTypes.list.replace(':projectId', projectId));
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

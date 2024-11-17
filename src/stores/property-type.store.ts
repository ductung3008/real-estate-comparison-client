import { create } from 'zustand';

import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';
import { ApiResponse } from '@/types/apiResponse.type';
import { PropertyType } from '@/types/property-type.type';

interface PropertyTypeState {
  propertyTypes: PropertyType[];
  loading: boolean;
  error: string | null;
  fetchPropertyTypes: (projectId: string) => Promise<PropertyType[]>;
  createPropertyType: (propertyTypeData: Partial<PropertyType>) => Promise<PropertyType>;
  updatePropertyType: (id: string, propertyTypeData: Partial<PropertyType>) => Promise<PropertyType>;
  deletePropertyType: (id: string) => Promise<void>;
}

const usePropertyTypeStore = create<PropertyTypeState>((set) => ({
  propertyTypes: [],
  loading: false,
  error: null,
  fetchPropertyTypes: async (projectId) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.get<ApiResponse<PropertyType[]>>(
        ApiConstant.propertyTypes.list.replace(':projectId', projectId),
      );
      response.data.sort((a, b) => a.numberOfBedroom - b.numberOfBedroom);
      set({ propertyTypes: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createPropertyType: async (propertyTypeData) => {
    set({ loading: true });
    try {
      const { projectId, ...data } = propertyTypeData;
      const { data: response } = await axios.post<ApiResponse<PropertyType>>(
        ApiConstant.propertyTypes.create.replace(':projectId', projectId),
        data,
      );

      set((state) => ({
        propertyTypes: [...state.propertyTypes, { ...response.data }],
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  updatePropertyType: async (id, propertyTypeData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.put<ApiResponse<PropertyType>>(
        ApiConstant.propertyTypes.update.replace(':id', id),
        propertyTypeData,
      );
      set((state) => ({
        propertyTypes: state.propertyTypes.map((place) =>
          place.id === id ? { ...place, ...propertyTypeData } : place,
        ),
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  deletePropertyType: async (id) => {
    set({ loading: true });
    try {
      await axios.delete<ApiResponse<PropertyType>>(ApiConstant.propertyTypes.delete.replace(':id', id));
      set((state) => ({
        propertyTypes: state.propertyTypes.filter((place) => place.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default usePropertyTypeStore;

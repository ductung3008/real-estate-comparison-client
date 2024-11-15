import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';
import { ApiResponse } from '@/types/apiResponse.type';
import { Place } from '@/types/place.type';
import { create } from 'zustand';

interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
  fetchPlaces: (projectId: string, size?: number, page?: number) => Promise<Place[]>;
  createPlace: (placeData: Partial<Place>) => Promise<Place>;
  updatePlace: (id: string, placeData: Partial<Place>) => Promise<Place>;
  deletePlace: (id: string) => Promise<void>;
}

const usePlaceStore = create<PlaceState>((set) => ({
  places: [],
  loading: false,
  error: null,
  fetchPlaces: async (projectId, size = 100, page = 0) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.get<ApiResponse<Place[]>>(
        ApiConstant.places.list
          .replace(':projectId', projectId)
          .replace(':size', size.toString())
          .replace(':page', page.toString()),
      );
      set({ places: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createPlace: async (placeData) => {
    set({ loading: true });
    try {
      const { project_id: projectId, ...data } = placeData;
      const { data: response } = await axios.post<ApiResponse<Place>>(
        ApiConstant.places.create.replace(':projectId', projectId),
        data,
      );
      console.log({ ...response.data, project_id: projectId });

      set((state) => ({
        places: [...state.places, { ...response.data, project_id: projectId }],
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  updatePlace: async (id, placeData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.put<ApiResponse<Place>>(
        ApiConstant.places.update.replace(':id', id),
        placeData,
      );
      set((state) => ({
        places: state.places.map((p) => (p.id === projectId ? response.data : p)),
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  deletePlace: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(ApiConstant.places.delete.replace(':id', id));
      set((state) => ({
        places: state.places.filter((p) => p.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default usePlaceStore;

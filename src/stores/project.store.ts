import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';
import { ApiResponse } from '@/types/apiResponse.type';
import { Project } from '@/types/project.type';
import { create } from 'zustand';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<Project[]>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  getProject: (id: string) => Promise<Project>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data: response } = await axios.get<ApiResponse<Project[]>>(ApiConstant.projects.list);
      set({ projects: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createProject: async (projectData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.post<ApiResponse<Project>>(ApiConstant.projects.create, projectData);
      set((state) => ({
        projects: [...state.projects, response.data],
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  getProject: async (id) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.get<ApiResponse<Project>>(ApiConstant.projects.get.replace(':id', id));
      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  updateProject: async (id, projectData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.put<ApiResponse<Project>>(
        ApiConstant.projects.update.replace(':id', id),
        projectData,
      );
      set((state) => ({
        projects: state.projects.map((u) => (u.id === id ? response.data : u)),
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  deleteProject: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(ApiConstant.projects.delete.replace(':id', id));
      set((state) => ({
        projects: state.projects.filter((u) => u.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default useProjectStore;

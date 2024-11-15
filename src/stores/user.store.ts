import { create } from 'zustand';

import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';
import { User } from '@/types/user.type';
import { ApiResponse } from '@/types/apiResponse.type';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<User[]>;
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data: response } = await axios.get<ApiResponse<User[]>>(ApiConstant.users.list);

      set({ users: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createUser: async (userData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.post<ApiResponse<User>>(ApiConstant.users.create, userData);
      set((state) => ({
        users: [...state.users, response.data],
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    set({ loading: true });
    try {
      const { data: response } = await axios.put<ApiResponse<User>>(
        ApiConstant.users.update.replace(':id', id),
        userData,
      );
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? response.data : u)),
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  deleteUser: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(ApiConstant.users.delete.replace(':id', id));
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default useUserStore;

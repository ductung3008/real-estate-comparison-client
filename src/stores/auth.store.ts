import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';
import { LoginResponse } from '@/types/auth.type';
import { User } from '@/types/user.type';
import { ApiResponse } from '@/types/apiResponse.type';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<LoginResponse | undefined>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async (credentials) => {
        set({ loading: true });
        try {
          const { data: response } = await axios.post<LoginResponse>(ApiConstant.auth.login, credentials);

          if (response.meta?.status !== 'SUCCESS') {
            set({ error: response.meta.message, loading: false });
            return;
          }

          localStorage.setItem('token', response.data.token);

          const { data: meResponse } = await axios.get<ApiResponse<User>>(ApiConstant.users.me);
          set({
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          set({ user: meResponse.data });
          return response;
        } catch (error) {
          set({ error: error.meta.message, loading: false });
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        try {
          const { data: response } = await axios.get<ApiResponse<User>>(ApiConstant.users.me);
          const user = response.data;
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;

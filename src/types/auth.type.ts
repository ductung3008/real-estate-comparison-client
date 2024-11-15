import { ApiResponse } from '@/types/apiResponse.type';

export type LoginRequest = {
  readonly username: string;
  readonly password: string;
};

export type LoginResponse = ApiResponse<{
  readonly token: string;
}>;

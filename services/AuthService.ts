// src/services/AuthService.ts
import { useNuxtApp } from '#app';
import type { AuthPayload, LoginResponse } from '@/types/AuthTypes';

export const loginUser = async (payload: AuthPayload): Promise<LoginResponse> => {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/auth/login', payload);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  const { $axios } = useNuxtApp();
  await $axios.post('/auth/logout');
};

export const fetchUserData = async (): Promise<{
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}> => {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/auth/me');
  return {
    id: response.data.id || 0,
    name: response.data.name || '',
    email: response.data.email || '',
    roles: response.data.roles || [],
    permissions: response.data.permissions || [],
  };
};

export const registerUser = async (payload: AuthPayload): Promise<LoginResponse> => {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/auth/register', payload);
  return response.data;
};

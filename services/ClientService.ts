import { useNuxtApp } from '#app';
import type { ClientPayload } from '@/types/ClientType';

/**
 * Crea una nueva tarea.
 */
export async function createClient(data: ClientPayload): Promise<ClientPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/tasks', data);
  return response.data;
}
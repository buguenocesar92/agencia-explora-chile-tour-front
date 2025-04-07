import { useNuxtApp } from '#app';
import type { ClientPayload } from '@/types/ClientTypes';

/**
 * Obtiene todos los clientes.
 */
export async function fetchClients(search?: string): Promise<ClientPayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/clients', {
    params: {
      search: search || undefined
    }
  });
  return response.data;
}

/**
 * Obtiene un cliente por ID.
 */
export async function fetchClient(id: number): Promise<ClientPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/clients/${id}`);
  return response.data;
}

/**
 * Crea un nuevo cliente.
 */
export async function createClient(data: ClientPayload): Promise<ClientPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/clients', data);
  return response.data.client;
}

/**
 * Actualiza un cliente existente.
 */
export async function updateClient(id: number, data: ClientPayload): Promise<ClientPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put(`/clients/${id}`, data);
  return response.data.client;
}

/**
 * Elimina un cliente.
 */
export async function deleteClient(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/clients/${id}`);
}
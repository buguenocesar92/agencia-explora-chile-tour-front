// src/services/TripService.ts
import { useNuxtApp } from '#app';
import type { TripPayload } from '@/types/TripType';

/**
 * Obtiene todos los viajes.
 */
export async function fetchTrips(filters?: { tour_template_id?: number }): Promise<TripPayload[]> {
  const { $axios } = useNuxtApp();
  
  // Si hay filtros, añadirlos como query params
  const params = filters || {};
  
  const response = await $axios.get('/trips', { params });
  // Se asume que el endpoint retorna un objeto con la propiedad "trips"
  return response.data.trips || response.data;
}

/**
 * Obtiene un viaje por ID.
 */
export async function fetchTrip(id: number): Promise<TripPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/trips/${id}`);
  return response.data.trip || response.data;
}

/**
 * Crea un nuevo viaje.
 */
export async function createTrip(data: TripPayload): Promise<TripPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/trips', data);
  return response.data.trip || response.data;
}

/**
 * Actualiza un viaje existente.
 */
export async function updateTrip(id: number, data: TripPayload): Promise<TripPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put(`/trips/${id}`, data);
  return response.data.trip || response.data;
}

/**
 * Elimina un viaje.
 */
export async function deleteTrip(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/trips/${id}`);
}

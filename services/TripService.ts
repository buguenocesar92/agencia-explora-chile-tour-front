// src/services/TripService.ts
import { useNuxtApp } from '#app';
import type { TripPayload } from '@/types/TripTypes';

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
  
  // Si hay un archivo PDF adjunto, usar FormData para enviarlo
  if (data.pdf_file) {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('tour_template_id', data.tour_template_id.toString());
    formData.append('departure_date', data.departure_date);
    formData.append('return_date', data.return_date);
    formData.append('pdf_file', data.pdf_file);
    
    const response = await $axios.post('/trips', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.trip || response.data;
  }
  
  // Si no hay archivo, proceder normalmente
  const response = await $axios.post('/trips', data);
  return response.data.trip || response.data;
}

/**
 * Actualiza un viaje existente.
 */
export async function updateTrip(id: number, data: TripPayload): Promise<TripPayload> {
  const { $axios } = useNuxtApp();
  
  // Si hay un archivo PDF adjunto, usar FormData para enviarlo
  if (data.pdf_file) {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('tour_template_id', data.tour_template_id.toString());
    formData.append('departure_date', data.departure_date);
    formData.append('return_date', data.return_date);
    formData.append('pdf_file', data.pdf_file);
    formData.append('_method', 'PUT'); // Para servidores que no soportan PUT con FormData
    
    const response = await $axios.post(`/trips/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.trip || response.data;
  }
  
  // Si no hay archivo, proceder normalmente
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

/**
 * Obtiene la URL del archivo PDF del programa de un viaje.
 */
export async function getProgramaFileUrl(id: number): Promise<{ file_url: string, file_name: string }> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/trips/${id}/programa`);
  return response.data;
}

/**
 * Obtiene la URL para descargar directamente el archivo PDF del programa.
 */
export function getProgramaDownloadUrl(id: number): string {
  const { $axios } = useNuxtApp();
  return $axios.defaults.baseURL + `/trips/${id}/programa/download`;
}

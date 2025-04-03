// src/services/TourTemplateService.ts
import { useNuxtApp } from '#app';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

/**
 * Obtiene todos los tour templates.
 */
export async function fetchTourTemplates(): Promise<TourTemplatePayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/tour-templates');
  return response.data.tourTemplates;  // Asegúrate de retornar el array correcto
}

/**
 * Obtiene un tour template por ID.
 */
export async function fetchTourTemplate(id: number): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/tour-templates/${id}`);
  return response.data.tourTemplate;
}

/**
 * Crea un nuevo tour template.
 */
export async function createTourTemplate(data: TourTemplatePayload): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/tour-templates', data);
  return response.data.tourTemplate;
}

/**
 * Actualiza un tour template existente.
 */
export async function updateTourTemplate(id: number, data: TourTemplatePayload): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put(`/tour-templates/${id}`, data);
  return response.data.tourTemplate;
}

/**
 * Elimina un tour template.
 */
export async function deleteTourTemplate(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/tour-templates/${id}`);
}

// src/services/TourTemplateService.ts
import { useNuxtApp } from '#app';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

export async function fetchTourTemplates(): Promise<TourTemplatePayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/tour-templates');
  return response.data.tourTemplates;
}

export async function createTourTemplate(data: FormData): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/tour-templates', data);
  return response.data.tourTemplate;
}

export async function deleteTourTemplate(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/tour-templates/${id}`);
}

export async function fetchTourTemplate(id: number): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/tour-templates/${id}`);
  return response.data.tourTemplate;
}

export async function updateTourTemplate(id: number, data: FormData): Promise<TourTemplatePayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.put(`/tour-templates/${id}`, data);
  return response.data.tourTemplate;
}

// src/services/ToursService.ts
import { useNuxtApp } from '#app';
import type { Tour, TripDate } from '@/types/TourTypes';

export async function fetchTours(): Promise<Tour[] | { tours: Tour[] }> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/tours');
  return response.data;
}

export async function fetchDatesTours(id: number): Promise<TripDate[] | { trips: TripDate[] }> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/tours/${id}/dates`);
  return response.data;
}

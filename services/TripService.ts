import { useNuxtApp } from '#app';
import type { TripPayload } from '@/types/TripType';

export async function createTrip(data: TripPayload): Promise<TripPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/trip', data);
  return response.data;
}

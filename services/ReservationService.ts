// services/ReservationService.ts
import { useNuxtApp } from '#app';
import type { ReservationPayload } from '@/types/ReservationTypes';

export async function fetchReservations(): Promise<ReservationPayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/reservations');
  return response.data.reservations;
}

export async function updateReservationStatusService(id: number, status: string): Promise<ReservationPayload> {
  const { $axios } = useNuxtApp();
  // Se asume que el endpoint PUT /reservations/{id} actualiza la reserva
  const response = await $axios.put(`/reservations/${id}`, { status });
  return response.data.reservation;
}

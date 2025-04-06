// services/ReservationService.ts
import { useNuxtApp } from '#app';
import type { ReservationPayload } from '@/types/ReservationTypes';

export async function fetchReservations(search?: string): Promise<ReservationPayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/reservations', {
    params: {
      search: search || undefined
    }
  });
  return response.data.reservations;
}

export async function updateReservationStatusService(id: number, status: string): Promise<ReservationPayload> {
  const { $axios } = useNuxtApp();
  // Se asume que el endpoint PUT /reservations/{id} actualiza la reserva
  const response = await $axios.put(`/reservations/status/${id}`, { status });
  return response.data.reservation;
}

export async function createReservation(data: FormData): Promise<ReservationPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/reservations', data);
  return response.data.reservation;
}

export async function fetchReservation(id: number): Promise<ReservationPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get(`/reservations/${id}`);
  return response.data.reservation;
}

export async function updateReservation(id: number, data: FormData): Promise<ReservationPayload> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post(`/reservations/${id}`, data);
  return response.data.reservation;
}

export async function deleteReservation(id: number): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.delete(`/reservations/${id}`);
}
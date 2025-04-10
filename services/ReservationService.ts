// services/ReservationService.ts
import { useNuxtApp } from '#app';
import type { ReservationPayload } from '@/types/ReservationTypes';

interface ReservationFilters {
  tour_id?: number;
  status?: string;
}

export async function fetchReservations(search?: string, filters?: ReservationFilters): Promise<ReservationPayload[]> {
  const { $axios } = useNuxtApp();
  
  // Construir los parámetros de consulta
  const params: any = {};
  
  // Agregar parámetro de búsqueda si existe
  if (search) {
    params.search = search;
  }
  
  // Agregar filtros si existen
  if (filters) {
    if (filters.tour_id) {
      params.tour_id = filters.tour_id;
    }
    
    if (filters.status) {
      params.status = filters.status;
    }
    // Aquí se pueden agregar más filtros en el futuro
  }
  
  console.log("ReservationService - Enviando parámetros:", params);
  const response = await $axios.get('/reservations', { params });
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
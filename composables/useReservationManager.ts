// composables/useReservationManager.ts
import { ref } from 'vue';
import { fetchReservations, updateReservationStatusService } from '@/services/ReservationService';
import type { ReservationPayload } from '@/types/ReservationTypes';

export function useReservationManager() {
  const reservations = ref<ReservationPayload[]>([]);
  const isLoading = ref(false);

  async function loadReservations() {
    isLoading.value = true;
    try {
      reservations.value = await fetchReservations();
    } catch (error) {
      console.error("Error al cargar reservas", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Método para actualizar el status de una reserva
  async function updateReservationStatus(id: number, status: string) {
    isLoading.value = true;
    try {
      await updateReservationStatusService(id, status);
      await loadReservations(); // Recargar la lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar el status", error);
    } finally {
      isLoading.value = false;
    }
  }

  return { reservations, isLoading, loadReservations, updateReservationStatus };
}

// composables/useReservationManager.ts
import { ref } from 'vue';
import { fetchReservations, updateReservationStatusService, deleteReservation } from '@/services/ReservationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ReservationPayload } from '@/types/ReservationTypes';

export function useReservationManager() {
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();
  const reservations = ref<ReservationPayload[]>([]);
  const isLoading = ref(false);
  

  async function loadReservations(search = '') {
    isLoading.value = true;
    try {
      reservations.value = await fetchReservations(search); // Pasar parámetro de búsqueda
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function updateReservationStatus(id: number, status: string) {
    isLoading.value = true;
    try {
      await updateReservationStatusService(id, status);
      showSuccessNotification('Éxito', 'Reserva actualizada correctamente');
      await loadReservations(); 
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteReservation(id);
      showSuccessNotification('Éxito', 'Reserva eliminada correctamente');
      await loadReservations();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  }
  
  return { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete };
}

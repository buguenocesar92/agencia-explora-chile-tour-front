// composables/useReservationManager.ts
import { ref } from 'vue';
import { fetchReservations, updateReservationStatusService, deleteReservation } from '@/services/ReservationService';
import type { ReservationPayload } from '@/types/ReservationTypes';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';

export function useReservationManager() {
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();
  const reservations = ref<ReservationPayload[]>([]);
  const isLoading = ref(false);

  async function loadReservations() {
    isLoading.value = true;
    try {
      reservations.value = await fetchReservations();
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

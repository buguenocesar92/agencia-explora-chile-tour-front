// composables/useReservationManager.ts
import { ref } from 'vue';
import { fetchReservations, updateReservationStatusService, deleteReservation } from '@/services/ReservationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ReservationPayload } from '@/types/ReservationTypes';

interface ReservationFilters {
  tour_id?: number;
}

export function useReservationManager() {
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();
  const reservations = ref<ReservationPayload[]>([]);
  const isLoading = ref(false);
  const currentFilters = ref<ReservationFilters>({});
  

  async function loadReservations(search = '', filters?: ReservationFilters) {
    isLoading.value = true;
    
    // Si se proporcionan filtros, actualiza los filtros actuales
    if (filters) {
      console.log("useReservationManager - Actualizando filtros:", filters);
      
      // Si tour_id es null o undefined, lo eliminamos del objeto de filtros
      if (filters.tour_id === null || filters.tour_id === undefined) {
        const { tour_id, ...restFilters } = { ...currentFilters.value };
        currentFilters.value = restFilters; // Asignación directa para reemplazar el objeto
        console.log("useReservationManager - Filtro tour_id eliminado, nuevos filtros:", currentFilters.value);
      } else {
        currentFilters.value = { ...currentFilters.value, ...filters };
      }
    }
    
    console.log("useReservationManager - Filtros finales aplicados:", currentFilters.value);
    
    try {
      reservations.value = await fetchReservations(search, currentFilters.value);
      console.log("useReservationManager - Reservas cargadas:", reservations.value.length);
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
    
    return reservations.value;
  }

  function setTourFilter(tourId: number | null) {
    console.log("useReservationManager - setTourFilter:", tourId);
    
    if (tourId === null || tourId === undefined) {
      // Si tourId es null, eliminamos el filtro
      const { tour_id, ...restFilters } = currentFilters.value;
      currentFilters.value = { ...restFilters };
    } else {
      // Si tourId tiene valor, lo agregamos a los filtros
      currentFilters.value.tour_id = tourId;
    }
    
    console.log("useReservationManager - Filtros después de setTourFilter:", currentFilters.value);
    return loadReservations();
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
  
  return { 
    reservations, 
    isLoading, 
    loadReservations, 
    setTourFilter,
    updateReservationStatus, 
    handleDelete 
  };
}

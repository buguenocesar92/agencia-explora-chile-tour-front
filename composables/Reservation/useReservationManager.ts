// composables/useReservationManager.ts
import { ref } from 'vue';
import { fetchReservations, updateReservationStatusService, deleteReservation } from '@/services/ReservationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ReservationPayload } from '@/types/ReservationTypes';

interface ReservationFilters {
  tour_id?: number;
  status?: string;
  date?: string;
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
      
      // Creamos una copia de los filtros actuales para manipularla
      let newFilters = { ...currentFilters.value };
      
      // Manejamos el filtro de tour_id
      if (filters.tour_id === null || filters.tour_id === undefined) {
        // Si tour_id es null, lo eliminamos del objeto
        const { tour_id, ...restFilters } = newFilters;
        newFilters = restFilters;
        console.log("useReservationManager - Filtro tour_id eliminado");
      } else {
        // Si tour_id tiene valor, lo agregamos
        newFilters.tour_id = filters.tour_id;
      }
      
      // Manejamos el filtro de status
      if (filters.status === null || filters.status === undefined || filters.status === '') {
        // Si status es null o vacío, lo eliminamos del objeto
        const { status, ...restFilters } = newFilters;
        newFilters = restFilters;
        console.log("useReservationManager - Filtro status eliminado");
      } else {
        // Si status tiene valor, lo agregamos
        newFilters.status = filters.status;
      }
      
      // Manejamos el filtro de date
      if (filters.date === null || filters.date === undefined || filters.date === '') {
        // Si date es null o vacío, lo eliminamos del objeto
        const { date, ...restFilters } = newFilters;
        newFilters = restFilters;
        console.log("useReservationManager - Filtro date eliminado");
      } else {
        // Si date tiene valor, lo agregamos
        newFilters.date = filters.date;
      }
      
      // Asignamos los nuevos filtros
      currentFilters.value = newFilters;
      console.log("useReservationManager - Filtros finales aplicados:", currentFilters.value);
    }
    
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

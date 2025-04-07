// src/composables/useTripForm.ts
import { ref, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ITrip } from '@/types/tour.interface';
import { useRouter } from 'vue-router';

export function useTripForm() {
  // Inicializamos el objeto 'trip' con valores por defecto
  const trip = ref<ITrip>({
    tourId: null,
    dateId: null,
    trip_date_id: null  // Añadimos este campo para compatibilidad con el backend
  });

  const router = useRouter();
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] | null }>({});

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Cargar datos del localStorage al montar el composable
  onMounted(() => {
    const savedData = localStorage.getItem('tripData');
    if (savedData) {
      trip.value = JSON.parse(savedData);
      // Asegurar compatibilidad con el backend
      if (trip.value.dateId && !trip.value.trip_date_id) {
        trip.value.trip_date_id = trip.value.dateId;
      }
    }
  });

  // Método de validación específico para el formulario de viaje
  async function validateTrip() {
    errors.value = {};
    
    // Validar que se haya seleccionado un tour y una fecha
    if (!trip.value.tourId) {
      errors.value.tourSelect = ['Debe seleccionar un tour'];
    } else {
      errors.value.tourSelect = null;
    }
    
    if (!trip.value.dateId) {
      errors.value.dateSelect = ['Debe seleccionar una fecha'];
    } else {
      errors.value.dateSelect = null;
      // Asegurar que trip_date_id siempre está sincronizado con dateId
      trip.value.trip_date_id = trip.value.dateId;
    }
    
    // Si hay errores, retornar false
    const hasErrors = Object.values(errors.value).some(error => error !== null && error.length > 0);
    if (hasErrors) {
      return false;
    }
    
    // Guardar en localStorage y retornar true
    localStorage.setItem('tripData', JSON.stringify(trip.value));
    return true;
  }

  async function handleSubmit() {
    // Primero validamos
    const isValid = await validateTrip();
    if (!isValid) return false;
    
    isLoading.value = true;
    errors.value = {};
    try {
      // Asegurar que trip_date_id está sincronizado con dateId
      if (trip.value.dateId) {
        trip.value.trip_date_id = trip.value.dateId;
      }
      
      // Guarda la selección del viaje en localStorage
      localStorage.setItem('tripData', JSON.stringify(trip.value));
      showSuccessNotification('Éxito', 'Selección del viaje guardada correctamente');
      router.push('/reserva/pago');
      return true;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar la selección del viaje', errorMessage.value);
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return { trip, isLoading, errors, handleSubmit, validateTrip };
}

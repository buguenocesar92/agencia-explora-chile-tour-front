import { ref, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TripPayload } from '@/types/TripType';
import { useRouter } from 'vue-router';

export function useTripForm() {
  // Inicializamos el objeto 'trip'
  const trip = ref<TripPayload>({
    id: 0, // Default value for id
    destination: '',
    departure_date: '',
    return_date: '',
    service_type: ''
  });

  const router = useRouter();
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Cargar datos del localStorage al montar el composable
  onMounted(() => {
    const savedData = localStorage.getItem('tripData');
    if (savedData) {
      trip.value = JSON.parse(savedData);
    }
  });

  // Método de validación específico para el formulario de viaje
  async function validateTrip() {
    errors.value = {};
    
    // Validar campos requeridos
    if (!trip.value.destination) {
      errors.value.destination = ['El destino es requerido'];
    }
    
    if (!trip.value.departure_date) {
      errors.value.departure_date = ['La fecha de salida es requerida'];
    }
    
    if (!trip.value.return_date) {
      errors.value.return_date = ['La fecha de regreso es requerida'];
    }
    
    // Si hay errores, retornar false
    if (Object.keys(errors.value).length > 0) {
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
      // Guarda la selección del viaje en localStorage
      localStorage.setItem('tripData', JSON.stringify(trip.value));
      /* showSuccessNotification('Éxito', 'Selección del viaje guardada correctamente'); */
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
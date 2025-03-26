import { ref, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TripPayload } from '@/types/TripType';
import { useRouter } from 'vue-router';

export function useTripForm() {
  // Inicializamos el objeto 'trip'
  const trip = ref<TripPayload>({
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

  async function handleSubmit() {
    isLoading.value = true;
    errors.value = {};
    try {
      // Guarda la selección del viaje en localStorage
      localStorage.setItem('tripData', JSON.stringify(trip.value));
      /* showSuccessNotification('Éxito', 'Selección del viaje guardada correctamente'); */
      router.push('/reserva/pago');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar la selección del viaje', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { trip, isLoading, errors, handleSubmit };
}

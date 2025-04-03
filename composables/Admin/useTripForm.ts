// src/composables/useTripForm.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchTrip, createTrip, updateTrip } from '@/services/TripService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TripPayload } from '@/types/TripTypes';

export function useTripForm() {
  // Inicializamos el objeto 'trip' con los campos necesarios
  const trip = ref<TripPayload>({
    id: 0,
    tour_template_id: 0,
    departure_date: '',
    return_date: ''
  });
  const isEditing = ref(false);
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});
  const router = useRouter();

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  async function loadTrip(id: number) {
    isLoading.value = true;
    try {
      const fetchedTrip = await fetchTrip(id);
      trip.value = fetchedTrip;
      isEditing.value = true;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al cargar el viaje', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSubmit() {
    isLoading.value = true;
    errors.value = {};
    try {
      if (isEditing.value) {
        await updateTrip(trip.value.id, trip.value);
        showSuccessNotification('Éxito', 'Viaje actualizado correctamente');
      } else {
        await createTrip(trip.value);
        showSuccessNotification('Éxito', 'Viaje creado correctamente');
      }
      router.push('/viajes');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar el viaje', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { trip, isEditing, isLoading, errors, handleSubmit, loadTrip };
}

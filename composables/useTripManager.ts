// src/composables/useTripManager.ts
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchTrips, deleteTrip } from '@/services/TripService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TripPayload } from '@/types/TripType';

export function useTripManager() {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Estado reactivo para los viajes.
  const trips = ref<TripPayload[]>([]);
  const isLoading = ref(false);

  // Encabezados para la tabla de viajes.
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Tour', value: 'tour_template.name' },
    { title: 'Fecha de Salida', value: 'departure_date' },
    { title: 'Fecha de Regreso', value: 'return_date' },
    { title: 'Acciones', value: 'actions', sortable: false },
  ];

  // Función para cargar los viajes.
  async function loadTrips() {
    try {
      isLoading.value = true;
      trips.value = await fetchTrips();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Función para eliminar un viaje y recargar la lista.
  async function handleDelete(id: number) {
    try {
      await deleteTrip(id);
      showSuccessNotification('Éxito', 'Viaje eliminado correctamente');
      await loadTrips();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  }

  // Navegación a la vista de creación.
  function goToCreate() {
    router.push('/viajes/crear');
  }

  // Navegación a la vista de edición.
  function goToEdit(id: number) {
    router.push(`/viajes/editar/${id}`);
  }

  onMounted(() => {
    loadTrips();
  });

  return { trips, isLoading, headers, loadTrips, handleDelete, goToCreate, goToEdit };
}

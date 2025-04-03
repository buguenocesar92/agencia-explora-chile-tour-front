// src/composables/useTourTemplateManager.ts
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchTourTemplates, deleteTourTemplate } from '@/services/TourTemplateService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

export function useTourTemplateManager() {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  const tourTemplates = ref<TourTemplatePayload[]>([]);
  const isLoading = ref(false);

  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Nombre', value: 'name' },
    { title: 'Destino', value: 'destination' },
    { title: 'Descripción', value: 'description' },
    { title: 'Acciones', value: 'actions', sortable: false }
  ];

  async function loadTourTemplates() {
    try {
      isLoading.value = true;
      tourTemplates.value = await fetchTourTemplates();
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
      await deleteTourTemplate(id);
      showSuccessNotification('Éxito', 'Tour eliminado correctamente');
      await loadTourTemplates();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  }

  function goToCreate() {
    router.push('/tours/crear');
  }

  function goToEdit(id: number) {
    router.push(`/tours/editar/${id}`);
  }

  onMounted(() => {
    loadTourTemplates();
  });

  return { tourTemplates, isLoading, headers, loadTourTemplates, handleDelete, goToCreate, goToEdit };
}

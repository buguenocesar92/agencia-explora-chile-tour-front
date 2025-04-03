// src/composables/useTourTemplateForm.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchTourTemplate, createTourTemplate, updateTourTemplate } from '@/services/TourTemplateService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

export function useTourTemplateForm() {
  const tourTemplate = ref<TourTemplatePayload>({
    id: 0,
    name: '',
    destination: '',
    description: ''
  });
  const isEditing = ref(false);
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});
  const router = useRouter();

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  async function loadTourTemplate(id: number) {
    isLoading.value = true;
    try {
      const fetchedTourTemplate = await fetchTourTemplate(id);
      tourTemplate.value = fetchedTourTemplate;
      isEditing.value = true;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al cargar el tour template', errorMessage.value);
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
        await updateTourTemplate(tourTemplate.value.id, tourTemplate.value);
        showSuccessNotification('Éxito', 'Tour template actualizado correctamente');
      } else {
        await createTourTemplate(tourTemplate.value);
        showSuccessNotification('Éxito', 'Tour template creado correctamente');
      }
      router.push('/tours');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar el tour template', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { tourTemplate, isEditing, isLoading, errors, handleSubmit, loadTourTemplate };
}

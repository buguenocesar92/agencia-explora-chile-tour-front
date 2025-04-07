import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchClient, createClient, updateClient } from '@/services/ClientService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ClientPayload } from '@/types/ClientTypes';

export function useClientForm() {
  const client = ref<ClientPayload>({
    id: 0,
    name: '',
    rut: '',
    date_of_birth: '',
    nationality: '',
    email: '',
    phone: ''
  });
  const isEditing = ref(false);
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});
  const router = useRouter();

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  async function loadClient(id: number) {
    isLoading.value = true;
    try {
      const fetchedClient = await fetchClient(id);
      client.value = fetchedClient;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al cargar el cliente', errorMessage.value);
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
        await updateClient(client.value.id, client.value);
        showSuccessNotification('Éxito', 'Cliente actualizado correctamente');
      } else {
        await createClient(client.value);
        showSuccessNotification('Éxito', 'Cliente creado correctamente');
      }
      router.push('/clientes');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar el cliente', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { client, isEditing, isLoading, errors, handleSubmit, loadClient };
}

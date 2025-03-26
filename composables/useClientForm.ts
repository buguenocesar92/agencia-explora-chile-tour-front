import { ref, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ClientPayload } from '@/types/ClientType';
import { useRouter } from 'vue-router';

export function useClientForm() {
  // Inicializamos el objeto cliente
  const client = ref<ClientPayload>({
    id: 0,
    name: '',
    rut: '',
    date_of_birth: '',
    nationality: '',
    email: '',
    phone: ''
  });

  const router = useRouter();
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Cargar datos del localStorage al montar el componente
  onMounted(() => {
    const savedData = localStorage.getItem('clientData');
    if (savedData) {
      client.value = JSON.parse(savedData);
    }
  });

  async function handleSubmit() {
    isLoading.value = true;
    errors.value = {};
    try {
      // Guardamos la data en localStorage en lugar de enviarla a la BD
      localStorage.setItem('clientData', JSON.stringify(client.value));
      /* showSuccessNotification('Éxito', 'Datos guardados correctamente'); */
      // Navegamos a la siguiente parte del flujo (por ejemplo, Selección del Viaje)
      router.push('/reserva');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar los datos', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  return { client, isLoading, errors, handleSubmit };
}

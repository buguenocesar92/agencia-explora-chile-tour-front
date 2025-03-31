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

  // Método de validación específico para el formulario de cliente
  async function validateClient() {
    errors.value = {};
    
    // Validar campos requeridos
    if (!client.value.name) {
      errors.value.name = ['El nombre es requerido'];
    }
    
    if (!client.value.rut) {
      errors.value.rut = ['El RUT es requerido'];
    }
    
    if (!client.value.date_of_birth) {
      errors.value.date_of_birth = ['La fecha de nacimiento es requerida'];
    }
    
    if (!client.value.email) {
      errors.value.email = ['El correo electrónico es requerido'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.value.email)) {
      errors.value.email = ['El formato del correo electrónico no es válido'];
    }
    
    // Si hay errores, retornar false
    if (Object.keys(errors.value).length > 0) {
      return false;
    }
    
    // Guardar en localStorage y retornar true
    localStorage.setItem('clientData', JSON.stringify(client.value));
    return true;
  }

  async function handleSubmit() {
    // Primero validamos
    const isValid = await validateClient();
    if (!isValid) return false;
    
    isLoading.value = true;
    try {
      // Guardamos la data en localStorage en lugar de enviarla a la BD
      localStorage.setItem('clientData', JSON.stringify(client.value));
      /* showSuccessNotification('Éxito', 'Datos guardados correctamente'); */
      // Navegamos a la siguiente parte del flujo (por ejemplo, Selección del Viaje)
      router.push('/reserva');
      return true;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar los datos', errorMessage.value);
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return { client, isLoading, errors, handleSubmit, validateClient };
}

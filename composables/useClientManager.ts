import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchClients, deleteClient } from '@/services/ClientService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ClientPayload } from '@/types/ClientTypes';

/**
 * useClientManager: Encapsula la lógica de la gestión de clientes.
 * Incluye el estado, la carga de datos, manejo de errores y navegación.
 */
export function useClientManager() {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Estado reactivo para los clientes y la carga.
  const clients = ref<ClientPayload[]>([]);
  const isLoading = ref(false);

  // Encabezados para la tabla de clientes.
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Nombre', value: 'name' },
    { title: 'RUT', value: 'rut' },
    { title: 'Fecha de Nacimiento', value: 'date_of_birth' },
    { title: 'Nacionalidad', value: 'nationality' },
    { title: 'Email', value: 'email' },
    { title: 'Teléfono', value: 'phone' },
    { title: 'Acciones', value: 'actions', sortable: false },
  ];

  // Función para cargar los clientes.
  async function loadClients(search = '') {
    try {
      isLoading.value = true;
      clients.value = await fetchClients(search);
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Función para eliminar un cliente y recargar la lista.
  async function handleDelete(id: number) {
    try {
      await deleteClient(id);
      showSuccessNotification('Éxito', 'Cliente eliminado correctamente');
      await loadClients();
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  }

  // Navegación a la vista de creación.
  function goToCreate() {
    router.push('/clientes/crear');
  }

  // Navegación a la vista de edición.
  function goToEdit(id: number) {
    router.push(`/clientes/editar/${id}`);
  }

  onMounted(() => {
    loadClients();
  });

  return { clients, isLoading, headers, loadClients, handleDelete, goToCreate, goToEdit };
} 
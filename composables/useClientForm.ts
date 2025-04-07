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

  // Función para validar los datos del cliente
  async function validateClient() {
    errors.value = {};
    
    // Validar nombre
    if (!client.value.name || client.value.name.trim() === '') {
      errors.value.name = ['El nombre es obligatorio'];
    }
    
    // Validar RUT chileno
    if (!client.value.rut || client.value.rut.trim() === '') {
      errors.value.rut = ['El RUT es obligatorio'];
    } else if (!validateRut(client.value.rut)) {
      errors.value.rut = ['El RUT no es válido'];
    }
    
    // Validar fecha de nacimiento
    if (!client.value.date_of_birth) {
      errors.value.date_of_birth = ['La fecha de nacimiento es obligatoria'];
    }
    
    // Validar nacionalidad
    if (!client.value.nationality || client.value.nationality.trim() === '') {
      errors.value.nationality = ['La nacionalidad es obligatoria'];
    }
    
    // Validar email
    if (!client.value.email || client.value.email.trim() === '') {
      errors.value.email = ['El email es obligatorio'];
    } else if (!validateEmail(client.value.email)) {
      errors.value.email = ['El email no es válido'];
    }
    
    // Validar teléfono
    if (!client.value.phone || client.value.phone.trim() === '') {
      errors.value.phone = ['El teléfono es obligatorio'];
    }
    
    // Guardar cliente en localStorage para el proceso de reserva
    localStorage.setItem('clientData', JSON.stringify(client.value));
    
    // Si hay errores, retornar false
    return Object.keys(errors.value).length === 0;
  }
  
  // Función auxiliar para validar un RUT chileno
  function validateRut(rut: string) {
    if (typeof rut !== 'string') return false;
    
    // Eliminar puntos y guiones
    const rutLimpio = rut.replace(/[.-]/g, '');
    
    if (rutLimpio.length < 2) return false;
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
    
    return dvCalculado === dv;
  }
  
  // Función auxiliar para validar un email
  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  return { 
    client, 
    isEditing, 
    isLoading, 
    errors, 
    handleSubmit, 
    loadClient,
    validateClient
  };
}

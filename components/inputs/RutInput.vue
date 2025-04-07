<template>
  <div>
    <label v-if="label" class="block text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        type="text"
        placeholder="12.345.678-9"
        class="w-full px-3 py-2 border rounded"
        :class="{ 
          'border-red-500': error, 
          'border-green-500': isRutValid && !error 
        }"
        @input="onInput"
        @blur="onBlur"
      />
      <div v-if="isLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p v-if="clientFound" class="text-green-500 text-sm mt-1">Cliente encontrado. Datos cargados automáticamente.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { cleanRut, formatRut, validateRut } from '@/utils/rut-validator';
import { fetchClientByRut } from '@/services/ClientService';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'RUT'
  },
  autoFill: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'validation', isValid: boolean): void;
  (e: 'client-found', clientData: any): void;
}>();

const error = ref<string | null>(null);
const isRutValid = ref(false);
const isLoading = ref(false);
const clientFound = ref(false);
let typingTimer: ReturnType<typeof setTimeout> | null = null;
let lastSearchedRut = ref(''); // Para evitar buscar el mismo RUT múltiples veces

// Función para manejar la entrada de texto y formatear el RUT
function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  
  // Limpiar el RUT y obtener su formato
  const cleanedValue = cleanRut(input.value);
  const formattedValue = formatRut(cleanedValue);
  
  // Calculamos la diferencia de longitud entre el valor limpio y formateado
  const posDiff = formattedValue.length - cleanedValue.length;
  
  // Actualizar el valor y emitir el evento
  emit('update:modelValue', formattedValue);
  
  // Restaurar la posición del cursor considerando el formato
  setTimeout(() => {
    // Ajustamos la posición según los caracteres adicionales (puntos, guiones)
    let newPos = cursorPosition + posDiff;
    // Si estamos justo antes de un punto o guión, avanzamos un carácter más
    if ([4, 8, 12].includes(newPos)) newPos++;
    input.setSelectionRange(newPos, newPos);
  }, 0);

  // Validar RUT mientras se escribe
  if (validateRut(formattedValue)) {
    isRutValid.value = true;
    
    // Limpiar el temporizador anterior si existe
    if (typingTimer) clearTimeout(typingTimer);
    
    // Iniciar un temporizador para buscar el cliente después de dejar de escribir
    typingTimer = setTimeout(() => {
      if (props.autoFill && !clientFound.value && !isLoading.value) {
        searchClientByRut(formattedValue);
      }
    }, 1000); // Esperar 1 segundo después de dejar de escribir
  } else {
    isRutValid.value = false;
    clientFound.value = false;
  }
}

// Validar el RUT al perder el foco
async function onBlur() {
  if (!props.modelValue) {
    error.value = 'El RUT es requerido';
    isRutValid.value = false;
    emit('validation', false);
    return;
  }
  
  if (!validateRut(props.modelValue)) {
    error.value = 'El RUT ingresado no es válido';
    isRutValid.value = false;
    emit('validation', false);
  } else {
    error.value = null;
    isRutValid.value = true;
    emit('validation', true);
    
    // Buscar cliente por RUT si está habilitado y aún no se ha encontrado
    if (props.autoFill && !clientFound.value && !isLoading.value) {
      // Cancelar cualquier búsqueda pendiente por temporizador
      if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
      }
      await searchClientByRut(props.modelValue);
    }
  }
}

// Función para buscar cliente por RUT
async function searchClientByRut(rut: string) {
  // Evitar búsqueda duplicada del mismo RUT
  const normalizedRut = rut.replace(/[.-]/g, '');
  if (normalizedRut === lastSearchedRut.value) {
    console.log('RUT ya buscado, omitiendo búsqueda duplicada');
    return;
  }

  isLoading.value = true;
  clientFound.value = false;
  
  try {
    lastSearchedRut.value = normalizedRut; // Guardar el RUT que estamos buscando
    const client = await fetchClientByRut(rut);
    
    if (client) {
      clientFound.value = true;
      emit('client-found', client);
    } else {
      clientFound.value = false;
      console.log('No se encontró un cliente con el RUT exacto');
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    clientFound.value = false;
  } finally {
    isLoading.value = false;
  }
}

// Validar al montar o cambiar el valor
onMounted(() => {
  if (props.modelValue) {
    emit('update:modelValue', formatRut(props.modelValue));
    const isValid = validateRut(props.modelValue);
    isRutValid.value = isValid;
    
    if (!isValid) {
      error.value = 'El RUT ingresado no es válido';
      emit('validation', false);
    } else {
      error.value = null;
      emit('validation', true);
      
      // Buscar cliente por RUT al montar solo si está habilitado
      // y no se ha encontrado un cliente aún
      if (props.autoFill && !clientFound.value) {
        // Asegurarse de que el RUT no ha sido buscado antes
        const normalizedRut = props.modelValue.replace(/[.-]/g, '');
        if (normalizedRut !== lastSearchedRut.value) {
          searchClientByRut(props.modelValue);
        }
      }
    }
  }
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const isValid = validateRut(newVal);
    isRutValid.value = isValid;
    
    if (!isValid) {
      error.value = 'El RUT ingresado no es válido';
      emit('validation', false);
    } else {
      error.value = null;
      emit('validation', true);
    }
  } else {
    error.value = 'El RUT es requerido';
    isRutValid.value = false;
    emit('validation', false);
  }
});
</script> 
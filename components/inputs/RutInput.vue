<template>
  <div>
    <label v-if="label" class="block text-gray-700 mb-2">{{ label }}</label>
    <input
      :value="modelValue"
      type="text"
      placeholder="12.345.678-9"
      class="w-full px-3 py-2 border rounded"
      :class="{ 'border-red-500': error }"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { cleanRut, formatRut, validateRut } from '@/utils/rut-validator';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'RUT'
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'validation', isValid: boolean): void;
}>();

const error = ref<string | null>(null);

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
}

// Validar el RUT al perder el foco
function onBlur() {
  if (!props.modelValue) {
    error.value = 'El RUT es requerido';
    emit('validation', false);
    return;
  }
  
  if (!validateRut(props.modelValue)) {
    error.value = 'El RUT ingresado no es válido';
    emit('validation', false);
  } else {
    error.value = null;
    emit('validation', true);
  }
}

// Validar al montar o cambiar el valor
onMounted(() => {
  if (props.modelValue) {
    emit('update:modelValue', formatRut(props.modelValue));
    if (!validateRut(props.modelValue)) {
      error.value = 'El RUT ingresado no es válido';
      emit('validation', false);
    } else {
      error.value = null;
      emit('validation', true);
    }
  }
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (!validateRut(newVal)) {
      error.value = 'El RUT ingresado no es válido';
      emit('validation', false);
    } else {
      error.value = null;
      emit('validation', true);
    }
  } else {
    error.value = 'El RUT es requerido';
    emit('validation', false);
  }
});
</script> 
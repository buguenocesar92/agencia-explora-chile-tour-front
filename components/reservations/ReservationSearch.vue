<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <i class="mdi mdi-magnify text-gray-400"></i>
    </div>
    <input
      type="text"
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Buscar por nombre o RUT"
    />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Estado local para indicar si estamos en espera de debounce
const isDebouncing = ref(false);
const localValue = ref(props.modelValue);

// Aumentar el tiempo de debounce a 800ms para permitir una escritura más fluida
const debouncedSearch = useDebounceFn((value: string) => {
  emit('update:modelValue', value);
  isDebouncing.value = false;
}, 800);

// Observar cambios en el valor local y aplicar debounce
watch(localValue, (newValue) => {
  isDebouncing.value = true;
  debouncedSearch(newValue);
});

// Sincronizar el valor local cuando cambia la prop modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue;
  }
});
</script> 
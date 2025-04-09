<template>
  <v-text-field
    v-model="localValue"
    label="Buscar por nombre o RUT"
    prepend-inner-icon="mdi-magnify"
    clearable
    outlined
    dense
    class="max-w-md"
    :loading="isDebouncing"
  ></v-text-field>
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
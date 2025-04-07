<template>
  <v-text-field
    :value="modelValue"
    label="Buscar por nombre o RUT"
    prepend-inner-icon="mdi-magnify"
    clearable
    outlined
    dense
    class="max-w-md"
    @update:model-value="handleSearchInput"
  ></v-text-field>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

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

// Debounce con cancelación para evitar múltiples llamadas
const debouncedSearch = useDebounceFn((value: string) => {
  emit('update:modelValue', value);
}, 300);

function handleSearchInput(value: string): void {
  debouncedSearch(value);
}
</script> 
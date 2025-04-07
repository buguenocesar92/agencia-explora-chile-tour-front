<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import type { PropType } from 'vue';

interface SelectOption {
  text: string;
  value: string;
}

// Para mantener compatibilidad con el formato anterior
interface LegacyOption {
  id: number;
  name: string;
}

const props = defineProps({
  id: { 
    type: String, 
    required: true 
  },
  label: { 
    type: String, 
    required: true 
  },
  options: {
    type: Array as PropType<SelectOption[] | LegacyOption[]>,
    default: () => [],
  },
  modelValue: {
    type: [String, Number, null, undefined] as PropType<string | number | null | undefined>,
    default: undefined
  },
  placeholder: { 
    type: String, 
    default: 'Seleccione una opción' 
  },
  placeholderValue: { 
    type: [String, Number] as PropType<string | number>, 
    default: '' 
  },
  required: { 
    type: Boolean, 
    default: false 
  },
  error: { 
    type: String, 
    default: '' 
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// Determina si el valor actual es el placeholder
const isPlaceholder = computed(() => {
  return props.modelValue === undefined || 
         props.modelValue === null || 
         props.modelValue === props.placeholderValue ||
         props.modelValue === '';
});

// Formatea las opciones para asegurar que todas tienen el formato {text, value}
const formattedOptions = computed(() => {
  return props.options.map(option => {
    // Verifica si la opción tiene el formato antiguo {id, name}
    if ('id' in option && 'name' in option) {
      return {
        text: option.name,
        value: String(option.id)
      };
    }
    // Si ya tiene el formato {text, value}
    return option as SelectOption;
  });
});

// Valor computado para mostrar en el select
const computedValue = computed({
  get() {
    if (isPlaceholder.value) {
      return props.placeholderValue;
    }
    return props.modelValue;
  },
  set(value) {
    if (value === props.placeholderValue) {
      emit('update:modelValue', null);
    } else {
      emit('update:modelValue', value);
    }
  }
});

// Para depuración
watchEffect(() => {
  console.log(`[FormSelect ${props.id}] Opciones:`, formattedOptions.value);
  console.log(`[FormSelect ${props.id}] Valor actual:`, props.modelValue);
});
</script>

<template>
  <div class="form-select-container mb-4">
    <label :for="id" class="block font-medium mb-1 text-gray-700">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="id"
        v-model="computedValue"
        class="appearance-none block w-full px-3 py-2 border rounded transition focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        :class="[
          {'border-red-500': error},
          {'text-gray-400': isPlaceholder},
          {'bg-white': !disabled},
          {'bg-gray-100': disabled},
          {'cursor-not-allowed': disabled}
        ]"
        :required="required"
        :disabled="disabled"
      >
        <option :value="placeholderValue" class="text-gray-400">
          {{ placeholder }}
        </option>

        <option
          v-for="option in formattedOptions"
          :key="option.value"
          :value="option.value"
          class="text-gray-800"
        >
          {{ option.text }}
        </option>
      </select>
      
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.form-select-container select {
  appearance: none;
}

.form-select-container select option {
  color: #1f2937; /* text-gray-800 */
  padding: 0.5rem;
}

.form-select-container select option:first-child {
  color: #9ca3af; /* text-gray-400 */
  font-style: italic;
}
</style>

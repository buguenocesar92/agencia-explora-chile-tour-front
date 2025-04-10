<template>
  <div>
    <FormSelect
      id="tourTemplateFilter"
      v-model="selectedTourId"
      :options="tourOptions"
      :placeholder="placeholder"
      :label="label"
      :error="error"
      :disabled="isLoading"
    />
    <div v-if="isLoading" class="mt-2">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import FormSelect from '@/components/FormSelect.vue';
import { fetchTourTemplates } from '@/services/TourTemplateService';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  label: {
    type: String,
    default: 'Tour'
  },
  placeholder: {
    type: String,
    default: 'Seleccionar tour'
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'tour-selected', 'loaded']);

// Data
const tourTemplates = ref<TourTemplatePayload[]>([]);
const isLoading = ref(false);

// Computed
const tourOptions = computed(() => {
  return tourTemplates.value.map(tour => ({
    text: tour.name,
    value: tour.id.toString()
  }));
});

// Este proxy nos permitirá emitir el evento update:modelValue
const selectedTourId = computed({
  get: () => props.modelValue,
  set: (value) => {
    // Si el valor es el placeholder (string vacío probablemente)
    // asegurémonos de emitir null
    if (value === '' || value === undefined) {
      emit('update:modelValue', null);
      emit('tour-selected', null);
      return;
    }
    
    emit('update:modelValue', value);
    
    // También emitimos un evento con el tour seleccionado completo
    // para que el componente padre pueda acceder a todos los datos del tour
    const selectedTour = tourTemplates.value.find(
      tour => tour.id.toString() === value?.toString()
    );
    emit('tour-selected', selectedTour || null);
  }
});

// Métodos
async function loadTourTemplates() {
  isLoading.value = true;
  try {
    tourTemplates.value = await fetchTourTemplates();
    emit('loaded', tourTemplates.value);
  } catch (error) {
    console.error('Error al cargar los tours:', error);
  } finally {
    isLoading.value = false;
  }
}

// Cuando cambia el modelo desde afuera, actualizamos el estado interno
watch(() => props.modelValue, (newValue) => {
  console.log("TourFilterSelect - modelValue changed:", newValue);
}, { immediate: true });

// Lifecycle
onMounted(() => {
  console.log("TourFilterSelect - onMounted, modelValue:", props.modelValue);
  loadTourTemplates();
});

// Exponemos el método de carga para que el componente padre pueda recargar los datos
defineExpose({
  loadTourTemplates,
  tourTemplates
});
</script> 
<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h3 class="text-lg font-medium mb-4">Filtros</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <!-- Filtro por Tour -->
      <div>
        <TourFilterSelect
          v-model="selectedTourId"
          label="Filtrar por Tour"
          placeholder="Todos los tours"
          @tour-selected="onTourSelected"
        />
      </div>
      
      <!-- Otros filtros pueden agregarse aquí -->
      
      <!-- Botón para limpiar filtros -->
      <div v-if="hasActiveFilters">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TourFilterSelect from './TourFilterSelect.vue';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

// Props
const props = defineProps({
  modelValue: {
    type: Object as () => {
      tourId: number | null;
      // Otros filtros se pueden agregar aquí
    },
    default: () => ({
      tourId: null,
      // Valores default para otros filtros
    })
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'filter-changed']);

// Datos reactivos
const selectedTourId = ref<number | null>(props.modelValue.tourId);
const selectedTour = ref<TourTemplatePayload | null>(null);

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedTourId.value !== null && selectedTourId.value !== undefined;
  // Añadir más condiciones aquí cuando se agreguen más filtros
});

// Filtro cuando cambia el tour seleccionado
function onTourSelected(tour: TourTemplatePayload | null): void {
  console.log("Tour seleccionado:", tour);
  selectedTour.value = tour;
  selectedTourId.value = tour?.id || null;
  updateFilters();
}

// Actualiza los filtros y emite el evento
function updateFilters(): void {
  console.log("Actualizando filtros, tourId:", selectedTourId.value);
  const filters = {
    tourId: selectedTourId.value,
    // Otros filtros se pueden agregar aquí
  };
  
  emit('update:modelValue', filters);
  emit('filter-changed', filters);
}

// Resetea todos los filtros
function resetFilters(): void {
  console.log("Reseteando filtros");
  selectedTourId.value = null;
  selectedTour.value = null;
  updateFilters();
}

// Expone funciones y datos para acceder desde el componente padre
defineExpose({
  resetFilters,
  selectedTour
});
</script> 
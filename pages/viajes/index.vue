<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Viajes</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Viaje
        </v-btn>
      </div>

      <!-- Filtro por tour template -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-gray-700 mb-2">Filtrar por Tour</label>
            <FormSelect
              id="tourTemplateFilter"
              v-model="selectedTourTemplate"
              :options="tourTemplateOptions"
              placeholder="Todos los tours"
              label="Tour"
              @update:modelValue="filterTrips"
            />
          </div>
          <div>
            <button 
              @click="resetFilters" 
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="trips"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <div class="flex gap-2">
            <v-btn color="info" @click="openTripDetails(item)" class="ma-2 mr-2">
              <v-icon start>mdi-eye</v-icon>
              Ver Detalles
            </v-btn>
            <v-btn color="primary" @click="goToEdit(item.id)" class="ma-2 mr-2">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn color="error" @click="handleDelete(item.id)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron viajes
          </div>
        </template>
      </v-data-table>

      <!-- Modal para ver detalles del viaje -->
      <TripModal
        v-model="showTripModal"
        :trip="selectedTrip"
      />
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import FormSelect from '@/components/FormSelect.vue';
import TripModal from '@/components/reservations/modals/TripModal.vue';
import { useTripManager } from '@/composables/useTripManager';
import { fetchTourTemplates } from '@/services/TourTemplateService';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';
import type { TripPayload } from '@/types/TripTypes';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Viajes',
  icon: 'mdi-calendar-clock'
});

// Extraemos la lógica del composable de gestión de viajes.
const { trips, isLoading, headers, handleDelete, goToCreate, goToEdit, loadTrips } = useTripManager();

// Estado para el filtro de tour template
const selectedTourTemplate = ref();

// Estado para el modal de detalles del viaje
const showTripModal = ref(false);
const selectedTrip = ref<any>(null);

// Función para abrir el modal con los detalles del viaje
function openTripDetails(trip: any) {
  selectedTrip.value = trip;
  showTripModal.value = true;
}

// Cargar los tour templates para el select
const tourTemplates = ref<TourTemplatePayload[]>([]);
const tourTemplateOptions = computed(() =>
  tourTemplates.value.map(template => ({
    id: template.id,
    name: template.name
  }))
);

// Función para aplicar filtros
async function filterTrips() {
  if (selectedTourTemplate.value) {
    await loadTrips({ tour_template_id: Number(selectedTourTemplate.value) });
  } else {
    await loadTrips();
  }
}

// Función para resetear filtros
async function resetFilters() {
  selectedTourTemplate.value = null;
  await loadTrips(); // Cargar todos los viajes sin filtro
}

onMounted(async () => {
  // Cargamos los tour templates y todos los viajes inicialmente
  tourTemplates.value = await fetchTourTemplates();
  await loadTrips();
});
</script>

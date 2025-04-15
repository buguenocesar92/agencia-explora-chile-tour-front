<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado con título -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="mdi mdi-calendar-check text-blue-600 mr-2"></i>
          Gestión de Reservas
        </h1>
        
        <!-- Botón para exportar a Excel -->
        <button 
          @click="exportToExcel" 
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
          :disabled="isExporting"
        >
          <i class="mdi mdi-file-excel mr-2"></i>
          {{ isExporting ? 'Exportando...' : 'Exportar a Excel' }}
        </button>
      </div>

      <!-- Sección de filtros y búsqueda -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <!-- Buscador por nombre o RUT -->
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre o RUT</label>
            <ReservationSearch 
              :model-value="searchQuery"
              @update:model-value="updateSearch"
            />
          </div>
          
          <!-- Filtro por Tour -->
          <div class="w-full md:w-1/4">
            <TourFilterSelect
              v-model="filters.tourId"
              label="Filtrar por Tour"
              placeholder="Todos los tours"
              @tour-selected="onTourSelected"
            />
          </div>
          
          <!-- Filtro por Estado de Pago -->
          <div class="w-full md:w-1/4">
            <FormSelect
              id="statusFilter"
              v-model="filters.status"
              :options="statusOptions"
              label="Estado de Pago"
              placeholder="Todos los estados"
              @update:model-value="onStatusSelected"
            />
          </div>
          
          <!-- Filtro por Fecha -->
          <div class="w-full md:w-1/4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Reserva</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="mdi mdi-calendar text-gray-400"></i>
              </div>
              <input
                type="date"
                v-model="filters.date"
                @change="onDateSelected"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Botón para limpiar filtros -->
        <div class="flex justify-end">
          <button 
            v-if="hasActiveFilters"
            @click="resetAllFilters" 
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            <span class="flex items-center">
              <i class="mdi mdi-filter-remove mr-1"></i>
              Limpiar filtros
            </span>
          </button>
        </div>
      </div>

      <!-- Tabla de reservas -->
      <ReservationTable
        :reservations="reservations"
        :isLoading="isLoading"
        @open-client-modal="openClientModal"
        @open-trip-modal="openTripModal"
        @open-receipt-modal="openModal"
        @mark-as-paid="markAsPaid"
        @delete-reservation="handleDelete"
      />
    </div>

    <!-- Modales -->
    <ClientModal 
      :model-value="showClientModal"
      @update:model-value="showClientModal = $event"
      :client="selectedClient || {} as Client"
    />
    
    <TripModal 
      :model-value="showTripModal"
      @update:model-value="showTripModal = $event"
      :trip="selectedTrip || {} as Trip"
    />
    
    <ReceiptModal 
      :model-value="showModal"
      @update:model-value="showModal = $event"
      :image-url="modalImageUrl"
    />
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import ReservationSearch from '@/components/reservations/ReservationSearch.vue';
import ReservationTable from '@/components/reservations/ReservationTable.vue';
import TourFilterSelect from '@/components/reservations/TourFilterSelect.vue';
import FormSelect from '@/components/FormSelect.vue';
import ClientModal from '@/components/reservations/modals/ClientModal.vue';
import TripModal from '@/components/reservations/modals/TripModal.vue';
import ReceiptModal from '@/components/reservations/modals/ReceiptModal.vue';
import { useReservationManager } from '@/composables/Reservation/useReservationManager';
import { exportReservationsToExcel } from '@/services/ReservationService';
import type { ReservationPayload } from '@/types/ReservationTypes';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

// Define interfaces for the data types
interface Client {
  id?: number;
  name?: string;
  email?: string;
  rut?: string;
  date_of_birth?: string | null;
  nationality?: string | null;
  phone?: string | null;
}

interface TourTemplate {
  id?: number;
  name?: string;
  destination?: string | null;
  description?: string | null;
}

interface Trip {
  id?: number;
  tour_id?: number | null;
  trip_date_id?: number | null;
  departure_date?: string | null;
  return_date?: string | null;
  tour_template?: TourTemplate | null;
}

// Interfaz para los filtros
interface Filters {
  tourId: number | null;
  status: string | null;
  date: string | null;
  // Otros filtros en el futuro
}

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

// Referencias a componentes
const filtersRef = ref<{
  resetFilters: () => void,
  selectedTour: any
} | null>(null);

// Estado
const searchQuery = ref('');
const filters = ref<Filters>({ 
  tourId: null,
  status: null,
  date: null
});

// Extraemos la lógica del composable de reservas
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();

// Opciones para el filtro de estado
const statusOptions = ref([
  { text: 'Pagado', value: 'paid' },
  { text: 'No Pagado', value: 'not paid' }
]);

// Computado para saber si hay filtros activos
const hasActiveFilters = computed(() => {
  return (filters.value.tourId !== null && filters.value.tourId !== undefined) || 
         (filters.value.status !== null && filters.value.status !== undefined && filters.value.status !== '') ||
         (filters.value.date !== null && filters.value.date !== undefined && filters.value.date !== '');
});

// Manejar cambios en la búsqueda
function updateSearch(value: string): void {
  searchQuery.value = value;
  
  // Preparamos el objeto de filtros para el backend
  const backendFilters: any = {};
  
  // Al buscar, mantenemos los filtros existentes
  if (filters.value.tourId) {
    backendFilters.tour_id = filters.value.tourId;
  }
  
  if (filters.value.status) {
    backendFilters.status = filters.value.status;
  }
  
  if (filters.value.date) {
    backendFilters.date = filters.value.date;
  }
  
  // Aplicamos la búsqueda con los filtros actuales
  loadReservations(value, backendFilters);
}

// Aplicar filtros desde el componente de filtros
function applyFilters(newFilters: Filters): void {
  console.log("Aplicando nuevos filtros:", newFilters);
  filters.value = newFilters;
  
  // Preparamos el objeto de filtros para el backend
  const backendFilters: any = {};
  
  // Filtro de tour
  if (newFilters.tourId !== null && newFilters.tourId !== undefined) {
    console.log("Filtrando por tour_id:", newFilters.tourId);
    backendFilters.tour_id = newFilters.tourId;
  }
  
  // Filtro de status
  if (newFilters.status !== null && newFilters.status !== undefined && newFilters.status !== '') {
    console.log("Filtrando por status:", newFilters.status);
    backendFilters.status = newFilters.status;
  }
  
  // Filtro de fecha
  if (newFilters.date !== null && newFilters.date !== undefined && newFilters.date !== '') {
    console.log("Filtrando por date:", newFilters.date);
    backendFilters.date = newFilters.date;
  }
  
  // Si hay filtros activos, los aplicamos
  if (Object.keys(backendFilters).length > 0) {
    console.log("Aplicando filtros al backend:", backendFilters);
    loadReservations(searchQuery.value, backendFilters);
  } else {
    console.log("Sin filtros activos, cargando todas las reservas");
    // Pasamos un objeto vacío para asegurarnos que se eliminen todos los filtros
    loadReservations(searchQuery.value, {});
  }
}

// resetAllFilters con el objeto de filtros completo
function resetAllFilters(): void {
  console.log("Reseteando todos los filtros");
  filters.value = { 
    tourId: null, 
    status: null,
    date: null
  };
  
  // Si tenemos una referencia al componente de filtros, usamos su método resetFilters
  if (filtersRef.value && 'resetFilters' in filtersRef.value) {
    filtersRef.value.resetFilters();
  }
  
  // Cargamos las reservas sin filtros
  loadReservations(searchQuery.value, {});
}

// Eventos del ciclo de vida
onMounted(() => {
  loadReservations(searchQuery.value);
});

// Función para actualizar el status a "paid"
function markAsPaid(id: number): void {
  updateReservationStatus(id, 'paid');
}

// Modal para comprobante de pago
const showModal = ref(false);
const modalImageUrl = ref('');
function openModal(url: string): void {
  modalImageUrl.value = url;
  showModal.value = true;
}

// Modal para detalles del cliente
const showClientModal = ref(false);
const selectedClient = ref<Client | null>(null);
function openClientModal(client: Client): void {
  selectedClient.value = client;
  showClientModal.value = true;
}

// Modal para detalles del viaje
const showTripModal = ref(false);
const selectedTrip = ref<Trip | null>(null);
function openTripModal(trip?: Trip): void {
  if (trip) {
    selectedTrip.value = trip;
    showTripModal.value = true;
  }
}

// Filtro cuando cambia el tour seleccionado
function onTourSelected(tour: TourTemplatePayload | null): void {
  console.log("Tour seleccionado:", tour);
  filters.value.tourId = tour?.id || null;
  applyFilters(filters.value);
}

// Filtro cuando cambia el estado seleccionado
function onStatusSelected(status: string | null): void {
  console.log("Estado seleccionado:", status);
  filters.value.status = status;
  applyFilters(filters.value);
}

// Filtro cuando cambia la fecha seleccionada
function onDateSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target) {
    filters.value.date = target.value;
    applyFilters(filters.value);
  }
}

// Estado para exportar a Excel
const isExporting = ref(false);

// Función para exportar a Excel
async function exportToExcel() {
  try {
    isExporting.value = true;
    
    // Preparamos los filtros para la exportación
    const exportFilters: any = {};
    
    if (filters.value.tourId) {
      exportFilters.tour_id = filters.value.tourId;
    }
    
    if (filters.value.status) {
      exportFilters.status = filters.value.status;
    }
    
    if (filters.value.date) {
      exportFilters.date = filters.value.date;
    }
    
    // Llamar al servicio para exportar
    const downloadUrl = await exportReservationsToExcel(exportFilters);
    
    // Crear un elemento <a> para descargar el archivo
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    alert('Error al exportar a Excel. Por favor intente nuevamente.');
  } finally {
    isExporting.value = false;
  }
}
</script>

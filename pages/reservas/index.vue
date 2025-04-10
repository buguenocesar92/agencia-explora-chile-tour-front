<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado con búsqueda -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Reservas</h1>
        <ReservationSearch 
          :model-value="searchQuery"
          @update:model-value="updateSearch"
        />
      </div>

      <!-- Filtros de reservas -->
      <ReservationFilters
        v-model="filters"
        @filter-changed="applyFilters"
        ref="filtersRef"
      />

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
import { ref, onMounted } from 'vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import ReservationSearch from '@/components/reservations/ReservationSearch.vue';
import ReservationTable from '@/components/reservations/ReservationTable.vue';
import ReservationFilters from '@/components/reservations/ReservationFilters.vue';
import ClientModal from '@/components/reservations/modals/ClientModal.vue';
import TripModal from '@/components/reservations/modals/TripModal.vue';
import ReceiptModal from '@/components/reservations/modals/ReceiptModal.vue';
import { useReservationManager } from '@/composables/Reservation/useReservationManager';
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
  status: null 
});

// Extraemos la lógica del composable de reservas
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();

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
    status: null 
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
</script>

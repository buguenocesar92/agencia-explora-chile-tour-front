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
  // Otros filtros en el futuro
}

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

// Referencias a componentes
const filtersRef = ref(null);

// Estado
const searchQuery = ref('');
const filters = ref<Filters>({ tourId: null });

// Extraemos la lógica del composable de reservas
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();

// Manejar cambios en la búsqueda
function updateSearch(value: string): void {
  searchQuery.value = value;
  
  // Al buscar, mantenemos el filtro de tour si existe
  if (filters.value.tourId) {
    loadReservations(value, { tour_id: filters.value.tourId });
  } else {
    loadReservations(value);
  }
}

// Aplicar filtros desde el componente de filtros
function applyFilters(newFilters: Filters): void {
  console.log("Aplicando nuevos filtros:", newFilters);
  filters.value = newFilters;
  
  // Verificar explícitamente si el filtro de tour es null o undefined
  if (newFilters.tourId !== null && newFilters.tourId !== undefined) {
    console.log("Filtrando por tour_id:", newFilters.tourId);
    loadReservations(searchQuery.value, { tour_id: newFilters.tourId });
  } else {
    console.log("Reseteando filtro de tour_id a null, cargando todas las reservas");
    // Pasar explícitamente tour_id: null para asegurarnos que se elimine el filtro
    loadReservations(searchQuery.value, { tour_id: null });
  }
}

// Función para resetear todos los filtros
function resetAllFilters(): void {
  console.log("Reseteando todos los filtros");
  filters.value = { tourId: null };
  
  // Si tenemos una referencia al componente de filtros, usamos su método resetFilters
  if (filtersRef.value && 'resetFilters' in filtersRef.value) {
    (filtersRef.value as any).resetFilters();
  }
  
  // Cargamos las reservas sin filtros
  loadReservations(searchQuery.value);
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

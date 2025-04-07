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
import ClientModal from '@/components/reservations/modals/ClientModal.vue';
import TripModal from '@/components/reservations/modals/TripModal.vue';
import ReceiptModal from '@/components/reservations/modals/ReceiptModal.vue';
import { useReservationManager } from '@/composables/Reservation/useReservationManager';

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

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

const searchQuery = ref('');

// Extraemos la lógica del composable de reservas
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();

// Manejar cambios en la búsqueda
function updateSearch(value: string): void {
  searchQuery.value = value;
  handleSearch(value);
}

function handleSearch(value: string): void {
  loadReservations(value);
}

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

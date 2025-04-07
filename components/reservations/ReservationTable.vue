<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    :loading="isLoading"
    class="elevation-1"
  >
    <!-- Columna Cliente: botón que abre modal de detalles del cliente -->
    <template #item.client="{ item }">
      <span
        v-if="item.client && item.client.name"
        class="text-blue-600 hover:underline cursor-pointer"
        @click="emit('open-client-modal', item.client)"
      >
        {{ item.client.name }}
      </span>
      <span v-else>Sin cliente</span>
    </template>

    <!-- Columna Viaje: botón que abre modal con detalles del viaje -->
    <template #item.trip="{ item }">
      <span
        v-if="item.trip && item.trip.tour_template && item.trip.tour_template.name"
        class="text-blue-600 hover:underline cursor-pointer"
        @click="emit('open-trip-modal', item.trip)"
      >
        {{ item.trip.tour_template.name }}
      </span>
      <span v-else>Sin viaje</span>
    </template>

    <template #item.payment="{ item }">
      <div v-if="item.payment && item.payment.receipt_url">
        <!-- Botón que abre la modal para mostrar el comprobante -->
        <v-btn text color="primary" @click="emit('open-receipt-modal', item.payment.receipt_url)">
          Ver Comprobante
        </v-btn>
      </div>
      <div v-else>
        Sin pago
      </div>
    </template>

    <template #item.status="{ item }">
      <v-chip :color="item.status === 'paid' ? 'green' : 'red'" dark>
        {{ item.status === 'paid' ? 'Pagado' : 'No pagado' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <!-- Botón para marcar como pagado (solo si aún no lo está) -->
      <v-btn
        v-if="item.status !== 'paid'"
        color="success"
        @click="emit('mark-as-paid', item.id)"
      >
        Marcar como Pagado
      </v-btn>
      <!-- Botón para eliminar la reserva -->
      <v-btn class="ml-5" color="error" @click="emit('delete-reservation', item.id)">
        <v-icon start>mdi-delete</v-icon>
        Eliminar
      </v-btn>
    </template>

    <template #no-data>
      <div class="text-center py-4 text-gray-500">
        No se encontraron reservas.
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
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

interface Payment {
  id?: number;
  receipt_url?: string | null;
}

interface Reservation {
  id: number;
  client?: Client;
  trip?: Trip | null;
  payment?: Payment | null;
  date?: string;
  status: string;
}

interface Header {
  title: string;
  value: string;
  sortable?: boolean;
}

defineProps({
  reservations: {
    type: Array as () => Reservation[],
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'open-client-modal', client: Client): void;
  (e: 'open-trip-modal', trip?: Trip): void;
  (e: 'open-receipt-modal', url: string): void;
  (e: 'mark-as-paid', id: number): void;
  (e: 'delete-reservation', id: number): void;
}>();

const headers: Header[] = [
  { title: 'ID', value: 'id' },
  { title: 'Cliente', value: 'client', sortable: false },
  { title: 'Rut', value: 'client.rut', sortable: false }, 
  { title: 'Viaje', value: 'trip', sortable: false },
  { title: 'Comprobante de Pago', value: 'payment', sortable: false },
  { title: 'Fecha', value: 'date' },
  { title: 'Status', value: 'status' },
  { title: 'Acciones', value: 'actions', sortable: false },
];
</script> 
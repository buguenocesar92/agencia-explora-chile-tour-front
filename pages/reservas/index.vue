<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado con botón para crear una nueva reserva -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Reservas</h1>
        <v-text-field
          v-model="searchQuery"
          label="Buscar por nombre o RUT"
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
          dense
          class="max-w-md"
          @update:model-value="handleSearch"
        ></v-text-field>
        <!-- Botón para crear nueva reserva (opcional) -->
        <!-- <v-btn color="primary" @click="goToCreate">Nueva Reserva</v-btn> -->
      </div>

      <v-data-table
        :headers="headers"
        :items="reservations"
        :loading="isLoading"
        class="elevation-1"
      >
        <!-- Columna Cliente: botón que abre modal de detalles del cliente -->
        <template #item.client="{ item }">
          <span
            class="text-blue-600 hover:underline cursor-pointer"
            @click="openClientModal(item.client)"
          >
            {{ item.client ? item.client.name : 'Sin cliente' }}
          </span>
        </template>

        <!-- Columna Viaje: botón que abre modal con detalles del viaje -->
        <template #item.trip="{ item }">
        <span
          class="text-blue-600 hover:underline cursor-pointer"
          @click="openTripModal(item.trip)"
        >
           {{ item.trip ? item.trip.tour_template.name : 'Sin viaje' }}
        </span>
      </template>


        <template #item.payment="{ item }">
          <div v-if="item.payment">
            <!-- Botón que abre la modal para mostrar el comprobante -->
            <v-btn text color="primary" @click="openModal(item.payment.receipt_url || '')">
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
            @click="markAsPaid(item.id)"
          >
            Marcar como Pagado
          </v-btn>
          <!-- Botón para eliminar la reserva -->
          <v-btn class="ml-5" color="error" @click="handleDelete(item.id)">
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
    </div>

    <!-- Modal para mostrar la imagen del comprobante -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-img
          :src="modalImageUrl"
          alt="Imagen del comprobante"
          max-height="800"
          contain
        ></v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para mostrar los detalles del cliente -->
    <v-dialog v-model="showClientModal" max-width="600px">
      <v-card>
        <v-card-title>Detalles del Cliente</v-card-title>
        <v-card-text v-if="selectedClient">
          <div><strong>Nombre:</strong> {{ selectedClient.name }}</div>
          <div><strong>Email:</strong> {{ selectedClient.email }}</div>
          <div><strong>RUT:</strong> {{ selectedClient.rut }}</div>
          <div><strong>Fecha de Nacimiento:</strong> {{ selectedClient.date_of_birth }}</div>
          <div><strong>Nacionalidad:</strong> {{ selectedClient.nationality }}</div>
          <div><strong>Teléfono:</strong> {{ selectedClient.phone }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeClientModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para mostrar los detalles del viaje -->
    <v-dialog v-model="showTripModal" max-width="600px">
      <v-card>
        <v-card-title>Detalles del Viaje</v-card-title>
        <v-card-text v-if="selectedTrip">
          <div><strong>ID de Viaje:</strong> {{ selectedTrip.id }}</div>
          <div><strong>Fecha de Salida:</strong> {{ selectedTrip.departure_date }}</div>
          <div><strong>Fecha de Regreso:</strong> {{ selectedTrip.return_date }}</div>
          <!-- Si la relación tour_template está cargada, mostrar detalles del tour -->
          <div v-if="selectedTrip.tour_template">
            <div><strong>Nombre del Tour:</strong> {{ selectedTrip.tour_template.name }}</div>
            <div><strong>Destino:</strong> {{ selectedTrip.tour_template.destination }}</div>
            <div><strong>Descripción:</strong> {{ selectedTrip.tour_template.description }}</div>
          </div>
          <div v-else>
            <em>Detalles del tour no disponibles</em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeTripModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core'
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useReservationManager } from '@/composables/Reservation/useReservationManager';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

const searchQuery = ref('');
const DEBOUNCE_TIME = 300; 
// Extraemos la lógica del composable de reservas
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();


// Debounce con cancelación automática
const debouncedSearch = useDebounceFn((value: string) => {
  loadReservations(value);
}, DEBOUNCE_TIME);

// Manejar cambios limpios
function handleSearch(value: string) {
  debouncedSearch(value);
}


const router = useRouter();

onMounted(() => {
  loadReservations(searchQuery.value);
});

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Cliente', value: 'client', sortable: false },
  { title: 'Rut', value: 'client.rut', sortable: false }, 
  { title: 'Viaje', value: 'trip', sortable: false },
  { title: 'Comprobante de Pago', value: 'payment', sortable: false },
  { title: 'Fecha', value: 'date' },
  { title: 'Status', value: 'status' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

// Función para actualizar el status a "paid"
function markAsPaid(id: number) {
  updateReservationStatus(id, 'paid');
}

// Modal para comprobante de pago
const showModal = ref(false);
const modalImageUrl = ref('');
function openModal(url: string) {
  modalImageUrl.value = url;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

// Modal para detalles del cliente
const showClientModal = ref(false);
const selectedClient = ref<any>(null);
function openClientModal(client: any) {
  selectedClient.value = client;
  showClientModal.value = true;
}
function closeClientModal() {
  showClientModal.value = false;
}

// Modal para detalles del viaje
const showTripModal = ref(false);
const selectedTrip = ref<any>(null);
function openTripModal(trip: any) {
  selectedTrip.value = trip;
  showTripModal.value = true;
}
function closeTripModal() {
  showTripModal.value = false;
}

// Funciones para navegación a crear y editar reservas (si se requieren)
// function goToCreate() {
//   router.push('/reservas/crear');
// }
// function goToUpdate(id: number) {
//   router.push(`/reservas/editar/${id}`);
// }
</script>

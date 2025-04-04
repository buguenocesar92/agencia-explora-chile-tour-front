<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado con botón para crear una nueva reserva -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Lista de Reservas</h1>
        <v-btn color="primary" @click="goToCreate">
          Nueva Reserva
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="reservations"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #item.client="{ item }">
          {{ item.client ? item.client.name : 'Sin cliente' }}
        </template>
        <template #item.trip="{ item }">
          {{ item.trip ? item.trip.tour_template.destination : 'Sin viaje' }}
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
          <!-- Botón para editar la reserva -->
          <v-btn text color="primary" @click="goToUpdate(item.id)">
            Editar
          </v-btn>
          <v-btn color="error" @click="handleDelete(item.id)">
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
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useReservationManager } from '@/composables/Reservation/useReservationManager';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

// Extraemos la lógica del composable
const { reservations, isLoading, loadReservations, updateReservationStatus, handleDelete } = useReservationManager();
const router = useRouter();

onMounted(() => {
  loadReservations();
});

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Cliente', value: 'client', sortable: false },
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

// Variables y métodos para la modal
const showModal = ref(false);
const modalImageUrl = ref('');

function openModal(url: string) {
  modalImageUrl.value = url;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

// Funciones para navegación a crear y editar reservas
function goToCreate() {
  router.push('/reservas/crear');
}

function goToUpdate(id: number) {
  router.push(`/reservas/editar/${id}`);
}

</script>

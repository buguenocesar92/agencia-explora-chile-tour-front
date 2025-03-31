<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Lista de Reservas</h1>
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
          {{ item.trip ? item.trip.destination : 'Sin viaje' }}
        </template>
        <template #item.payment="{ item }">
          <div v-if="item.payment">
            <!-- En lugar de mostrar la imagen, mostramos un botón que abre la modal -->
            <v-btn text color="primary" @click="openModal(item.payment.receipt_url)">
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
          <!-- Solo se muestra el botón si el status es distinto de "paid" -->
          <v-btn
            v-if="item.status !== 'paid'"
            color="success"
            @click="markAsPaid(item.id)"
          >
            Marcar como Pagado
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
        <v-img :src="modalImageUrl" alt="Imagen del comprobante" max-height="800" contain></v-img>
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
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useReservationManager } from '@/composables/useReservationManager';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Reservas',
  icon: 'mdi-format-list-checkbox'
});

// Extraemos la lógica del composable
const { reservations, isLoading, loadReservations, updateReservationStatus } = useReservationManager();

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
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        {{ isEditing ? 'Editar Reserva' : 'Nueva Reserva' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Sección de Cliente -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre del Cliente</label>
          <input
            v-model="reservation.client.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.name'] }"
          />
          <p v-if="errors['client.name']" class="text-red-500 text-sm mt-1">
            {{ errors['client.name'][0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email del Cliente</label>
          <input
            v-model="reservation.client.email"
            type="email"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.email'] }"
          />
          <p v-if="errors['client.email']" class="text-red-500 text-sm mt-1">
            {{ errors['client.email'][0] }}
          </p>
        </div>
        <!-- Campos adicionales del cliente -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">RUT del Cliente</label>
          <input
            v-model="reservation.client.rut"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.rut'] }"
          />
          <p v-if="errors['client.rut']" class="text-red-500 text-sm mt-1">
            {{ errors['client.rut'][0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Nacimiento del Cliente</label>
          <input
            v-model="reservation.client.date_of_birth"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.date_of_birth'] }"
          />
          <p v-if="errors['client.date_of_birth']" class="text-red-500 text-sm mt-1">
            {{ errors['client.date_of_birth'][0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nacionalidad del Cliente</label>
          <input
            v-model="reservation.client.nationality"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.nationality'] }"
          />
          <p v-if="errors['client.nationality']" class="text-red-500 text-sm mt-1">
            {{ errors['client.nationality'][0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Teléfono del Cliente</label>
          <input
            v-model="reservation.client.phone"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors['client.phone'] }"
          />
          <p v-if="errors['client.phone']" class="text-red-500 text-sm mt-1">
            {{ errors['client.phone'][0] }}
          </p>
        </div>

        <!-- Sección de Estado -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Status</label>
          <select
            v-model="reservation.status"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.status }"
          >
            <option value="not paid">No Pagado</option>
            <option value="pass">Pass</option>
            <option value="paid">Pagado</option>
          </select>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">
            {{ errors.status[0] }}
          </p>
        </div>

        <!-- Sección de Pago: Comprobante de Pago -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Comprobante de Pago (Imagen)</label>
          <!-- Mostrar comprobante actual si existe -->
          <div v-if="reservation.payment.receipt_url">
            <img
              :src="reservation.payment.receipt_url"
              alt="Comprobante de Pago"
              class="mb-2 max-h-40 object-contain"
            />
          </div>
          <!-- Input para actualizar comprobante -->
          <input
            type="file"
            accept="image/*"
            @change="handleFileChangeWithPreview"
            class="w-full"
          />
          <!-- Vista previa de la nueva imagen -->
          <div v-if="newPreviewUrl">
            <p class="text-gray-700 mt-1">Nueva imagen seleccionada:</p>
            <img
              :src="newPreviewUrl"
              alt="Nueva vista previa"
              class="mt-2 max-h-40 object-contain"
            />
          </div>
          <p v-if="errors['payment.receipt']" class="text-red-500 text-sm mt-1">
            {{ errors['payment.receipt'][0] }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Reserva' : 'Crear Reserva') }}
        </button>
      </form>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useReservationForm } from '~/composables/Reservation/useReservationForm';

definePageMeta({
  requiresAuth: true,
});

const { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation, handleFileChange } = useReservationForm();
const route = useRoute();

// Para mostrar la vista previa en esta página
const newPreviewUrl = ref('');

// Cargar la reserva al montar la página (si se está editando)
onMounted(() => {
  const reservationId = Number(route.params.id);
  if (reservationId) {
    isEditing.value = true;
    loadReservation(reservationId);
  }
});

// Función "wrapper" para manejar el input file y actualizar la vista previa
function handleFileChangeWithPreview(event: Event) {
  handleFileChange(event);
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newPreviewUrl.value = URL.createObjectURL(target.files[0]);
  }
}

// Función para actualizar los datos del viaje
const tripOptions = ref([
  { id: 1, departure: '2025-04-01', return: '2025-04-10' },
  { id: 2, departure: '2025-05-01', return: '2025-05-10' },
  { id: 3, departure: '2025-06-01', return: '2025-06-10' },
]);
const selectedTripId = ref('');
function onTripChange() {
  const selected = tripOptions.value.find(option => option.id === parseInt(selectedTripId.value));
  if (selected) {
    // Actualiza los datos del viaje en el objeto reservation
    reservation.value.trip.departure_date = selected.departure;
    reservation.value.trip.return_date = selected.return;
  } else {
    reservation.value.trip.departure_date = '';
    reservation.value.trip.return_date = '';
  }
}
</script>

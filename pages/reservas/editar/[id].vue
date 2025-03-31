<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useReservationForm } from '~/composables/useReservationForm';

definePageMeta({
  requiresAuth: true,
});

const { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation } = useReservationForm();
const route = useRoute();

onMounted(() => {
  const reservationId = Number(route.params.id);
  if (reservationId) {
    isEditing.value = true;
    loadReservation(reservationId);
  }
});
</script>

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

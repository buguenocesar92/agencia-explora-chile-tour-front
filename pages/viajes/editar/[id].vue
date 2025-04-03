<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        Editar Viaje
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Campo para seleccionar el Tour Template (ID) -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">ID del Tour Template</label>
          <input
            v-model.number="trip.tour_template_id"
            type="number"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.tour_template_id }"
            placeholder="Ingrese el ID del tour template"
          />
          <p v-if="errors.tour_template_id" class="text-red-500 text-sm mt-1">
            {{ errors.tour_template_id[0] }}
          </p>
        </div>

        <!-- Campo para la Fecha de Salida -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Salida</label>
          <input
            v-model="trip.departure_date"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.departure_date }"
          />
          <p v-if="errors.departure_date" class="text-red-500 text-sm mt-1">
            {{ errors.departure_date[0] }}
          </p>
        </div>

        <!-- Campo para la Fecha de Regreso -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Regreso</label>
          <input
            v-model="trip.return_date"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.return_date }"
          />
          <p v-if="errors.return_date" class="text-red-500 text-sm mt-1">
            {{ errors.return_date[0] }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useTripForm } from '@/composables/Admin/useTripForm';

definePageMeta({
  requiresAuth: true,
});

const route = useRoute();
const { trip, isEditing, isLoading, errors, handleSubmit, loadTrip } = useTripForm();

onMounted(() => {
  const tripId = Number(route.params.id);
  if (tripId) {
    isEditing.value = true;
    loadTrip(tripId);
  }
});
</script>

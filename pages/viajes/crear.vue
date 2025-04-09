<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        Nuevo Viaje
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Select para elegir el Tour Template -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Tour Template</label>
          <FormSelect
            id="tourTemplateSelect"
            v-model="trip.tour_template_id"
            :options="tourTemplateOptions"
            label="Tour Template"
            placeholder="Seleccione un tour template"
            :error="errors.tour_template_id ? errors.tour_template_id[0] : ''"
          />
        </div>
        <!-- Campo para la Fecha de Salida -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Salida</label>
          <input
            v-model="trip.departure_date"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.departure_date }"
            :min="today"
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
            :min="trip.departure_date || today"
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
import { ref, computed, onMounted } from 'vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/Admin/useTripForm';
import { fetchTourTemplates } from '@/services/TourTemplateService';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

definePageMeta({
  requiresAuth: true,
});

const { trip, isLoading, errors, handleSubmit } = useTripForm();

// Fecha actual en formato YYYY-MM-DD para los inputs de tipo date
const today = ref(new Date().toISOString().split('T')[0]);

// Cargar los tour templates para el select
const tourTemplates = ref<TourTemplatePayload[]>([]);
const tourTemplateOptions = computed(() =>
  tourTemplates.value.map(template => ({
    id: template.id,
    name: template.name
  }))
);

onMounted(async () => {
  tourTemplates.value = await fetchTourTemplates();
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        Editar Tour Template
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre</label>
          <input
            v-model="tourTemplate.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.name }"
            placeholder="Ingresa el nombre del tour"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">
            {{ errors.name[0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Destino</label>
          <input
            v-model="tourTemplate.destination"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.destination }"
            placeholder="Ingresa el destino"
          />
          <p v-if="errors.destination" class="text-red-500 text-sm mt-1">
            {{ errors.destination[0] }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Descripción</label>
          <textarea
            v-model="tourTemplate.description"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Ingresa una descripción (opcional)"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">
            {{ errors.description[0] }}
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
import { useTourTemplateForm } from '@/composables/useTourTemplateForm';

definePageMeta({
  requiresAuth: true,
});

const route = useRoute();
const { tourTemplate, isEditing, isLoading, errors, handleSubmit, loadTourTemplate } = useTourTemplateForm();

onMounted(() => {
  const tourId = Number(route.params.id);
  if (tourId) {
    isEditing.value = true;
    loadTourTemplate(tourId);
  }
});
</script>

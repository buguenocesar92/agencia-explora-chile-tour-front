<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Viajes</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Viaje
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="trips"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn color="primary" @click="goToEdit(item.id)" class="ma-2 mr-2">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn color="error" @click="handleDelete(item.id)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron viajes
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useTripManager } from '@/composables/useTripManager';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Viajes',
  icon: 'mdi-calendar-clock'
});

// Extraemos la lógica del composable de gestión de viajes.
const { trips, isLoading, headers, handleDelete, goToCreate, goToEdit } = useTripManager();
</script>

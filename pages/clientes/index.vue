<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Clientes</h1>
        <div class="flex items-center space-x-2">
          <ClientSearch 
            :model-value="searchQuery"
            @update:model-value="updateSearch"
          />
          <v-btn color="primary" @click="goToCreate">
            <i class="fas fa-plus mr-2"></i>
            Nuevo Cliente
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="clients"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #item.date_of_birth="{ item }">
          {{ new Date(item.date_of_birth).toLocaleDateString() }}
        </template>
        
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
            No se encontraron clientes
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useClientManager } from '@/composables/useClientManager';
import AdminWrapper from '@/components/AdminWrapper.vue';
import ClientSearch from '@/components/clients/ClientSearch.vue';

definePageMeta({
    requiresAuth: true,
    sidebar: true,
    label: 'Clientes',
    icon: 'mdi-account-group'
});

const searchQuery = ref('');

// Extraemos la lógica del composable
const { clients, isLoading, headers, loadClients, handleDelete, goToCreate, goToEdit } = useClientManager();

// Función para manejar cambios en la búsqueda
function updateSearch(value: string): void {
  searchQuery.value = value;
  handleSearch(value);
}

// Función para realizar la búsqueda
function handleSearch(value: string): void {
  loadClients(value);
}

onMounted(() => {
  loadClients(searchQuery.value);
});
</script> 
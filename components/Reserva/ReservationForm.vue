<!-- components/reserva/ReservationForm.vue -->
<template>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">1. Ingreso de Datos Personales</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre Completo</label>
          <input
            v-model="client.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Rut</label>
          <input
            v-model="client.rut"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.rut }"
          />
          <p v-if="errors.rut" class="text-red-500 text-sm mt-1">{{ errors.rut[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de nacimiento</label>
          <input
            type="date"
            v-model="client.date_of_birth"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.date_of_birth }"
          />
          <p v-if="errors.date_of_birth" class="text-red-500 text-sm mt-1">{{ errors.date_of_birth[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nacionalidad</label>
          <input
            v-model="client.nationality"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.nationality }"
          />
          <p v-if="errors.nationality" class="text-red-500 text-sm mt-1">{{ errors.nationality[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Correo Electrónico</label>
          <input
            v-model="client.email"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Teléfono</label>
          <input
            v-model="client.phone"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone[0] }}</p>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Siguiente' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useClientForm } from '@/composables/useClientForm';
  
  const { client, isLoading, errors, handleSubmit } = useClientForm();
  </script>
  
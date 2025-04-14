<template>
  <AdminWrapper>
    <div class="p-6">
      <!-- Mensaje de bienvenida -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div class="relative px-8 py-10">
          <!-- Decoración de fondo -->
          <div class="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M39.9,-65.7C51.5,-58.4,60.8,-47.8,67.2,-35.4C73.6,-23,77.1,-8.9,75.8,4.7C74.5,18.3,68.5,31.3,59.8,42.1C51.1,52.9,39.8,61.5,27.1,67.4C14.4,73.3,0.4,76.5,-14.8,76.1C-30,75.7,-46.4,71.7,-57.6,62C-68.8,52.3,-74.8,37,-78.8,21.2C-82.8,5.4,-84.8,-10.9,-79.9,-24.8C-75,-38.7,-63.2,-50.2,-49.7,-57.1C-36.2,-64,-18.1,-66.3,-1.7,-63.8C14.7,-61.3,28.3,-73,39.9,-65.7Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div class="relative z-10">
            <div class="flex items-center mb-4">
              <div class="bg-white/20 backdrop-blur-sm p-3 rounded-full mr-4">
                <v-icon color="white" size="large">mdi-account-circle</v-icon>
              </div>
              <h1 class="text-3xl font-bold text-white">¡Bienvenido, {{ username }}!</h1>
            </div>
            <p class="text-blue-100 text-lg max-w-2xl">
              Administra tus reservas, revisa estadísticas y gestiona toda la información de tus clientes desde este panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import AdminWrapper from '@/components/AdminWrapper.vue';

const authStore = useAuthStore();
const username = ref(authStore.name || 'Administrador');

definePageMeta({
  requiresAuth: true,
});
</script>

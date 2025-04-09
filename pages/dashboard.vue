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
            <div class="mt-6">
              <router-link to="/reservas" class="inline-flex items-center bg-white text-blue-600 font-medium px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <v-icon left size="small" class="mr-2">mdi-calendar-check</v-icon>
                Ver reservas recientes
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 font-medium">Reservas</p>
              <h3 class="text-3xl font-bold mt-1">{{ stats.reservations }}</h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <v-icon color="#1e73be" size="medium">mdi-calendar</v-icon>
            </div>
          </div>
          <p class="text-green-600 text-sm mt-4 flex items-center">
            <v-icon size="x-small" class="mr-1">mdi-arrow-up</v-icon>
            <span>12% más que el mes pasado</span>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-600 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 font-medium">Clientes</p>
              <h3 class="text-3xl font-bold mt-1">{{ stats.clients }}</h3>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <v-icon color="#7ac142" size="medium">mdi-account-group</v-icon>
            </div>
          </div>
          <p class="text-green-600 text-sm mt-4 flex items-center">
            <v-icon size="x-small" class="mr-1">mdi-arrow-up</v-icon>
            <span>8% más que el mes pasado</span>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 font-medium">Tours</p>
              <h3 class="text-3xl font-bold mt-1">{{ stats.tours }}</h3>
            </div>
            <div class="bg-amber-100 p-3 rounded-lg">
              <v-icon color="amber-darken-2" size="medium">mdi-map-marker-path</v-icon>
            </div>
          </div>
          <p class="text-green-600 text-sm mt-4 flex items-center">
            <v-icon size="x-small" class="mr-1">mdi-arrow-up</v-icon>
            <span>5 tours nuevos este mes</span>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-600 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 font-medium">Ingresos</p>
              <h3 class="text-3xl font-bold mt-1">${{ stats.revenue.toLocaleString() }}</h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <v-icon color="purple-darken-1" size="medium">mdi-cash-multiple</v-icon>
            </div>
          </div>
          <p class="text-green-600 text-sm mt-4 flex items-center">
            <v-icon size="x-small" class="mr-1">mdi-arrow-up</v-icon>
            <span>15% más que el mes pasado</span>
          </p>
        </div>
      </div>

      <!-- Secciones -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Reservas Recientes -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Reservas Recientes</h3>
            <router-link to="/reservas" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              Ver todas
              <v-icon size="small" class="ml-1">mdi-chevron-right</v-icon>
            </router-link>
          </div>
          <div class="p-6">
            <div v-if="recentReservations.length > 0">
              <div v-for="(reservation, index) in recentReservations" :key="index" 
                   class="flex items-center py-3 border-b border-gray-100 last:border-0">
                <div class="bg-blue-100 p-2 rounded-full mr-4">
                  <v-icon color="#1e73be" size="small">mdi-account</v-icon>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">{{ reservation.client }}</h4>
                    <span class="text-sm text-gray-500">{{ reservation.date }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ reservation.destination }}</p>
                </div>
                <div class="ml-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" 
                        :class="getStatusClass(reservation.status)">
                    {{ reservation.status }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No hay reservas recientes
            </div>
          </div>
        </div>
        
        <!-- Accesos Rápidos -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <h3 class="font-bold text-gray-800">Accesos Rápidos</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <router-link to="/reservas/crear" class="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div class="bg-blue-100 p-2 rounded-lg mr-4">
                  <v-icon color="#1e73be" size="small">mdi-calendar-plus</v-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Nueva Reserva</h4>
                  <p class="text-sm text-gray-600">Crear una nueva reserva para clientes</p>
                </div>
              </router-link>
              
              <router-link to="/clientes/crear" class="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div class="bg-green-100 p-2 rounded-lg mr-4">
                  <v-icon color="#7ac142" size="small">mdi-account-plus</v-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Nuevo Cliente</h4>
                  <p class="text-sm text-gray-600">Registrar un nuevo cliente</p>
                </div>
              </router-link>
              
              <router-link to="/tours/crear" class="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div class="bg-amber-100 p-2 rounded-lg mr-4">
                  <v-icon color="amber-darken-2" size="small">mdi-map-plus</v-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Nuevo Tour</h4>
                  <p class="text-sm text-gray-600">Crear un nuevo paquete turístico</p>
                </div>
              </router-link>
              
              <router-link to="/reportes" class="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <v-icon color="purple-darken-1" size="small">mdi-chart-bar</v-icon>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Reportes</h4>
                  <p class="text-sm text-gray-600">Ver estadísticas detalladas</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useAuthStore } from '@/stores/authStore';

definePageMeta({
  requiresAuth: true,
  sidebar: true,
  label: 'Inicio',
  icon: 'mdi-format-list-checkbox'
});

const authStore = useAuthStore();
const username = ref('Administrador');

// Datos de ejemplo para estadísticas
const stats = ref({
  reservations: 124,
  clients: 87,
  tours: 18,
  revenue: 2450000
});

// Datos de ejemplo para reservas recientes
const recentReservations = ref([
  { 
    client: 'María González', 
    date: '10/04/2025', 
    destination: 'Torres del Paine', 
    status: 'Confirmada' 
  },
  { 
    client: 'Juan Pérez', 
    date: '09/04/2025', 
    destination: 'Isla de Pascua', 
    status: 'Pendiente' 
  },
  { 
    client: 'Carlos Rodríguez', 
    date: '08/04/2025', 
    destination: 'Desierto de Atacama', 
    status: 'Pagada' 
  },
  { 
    client: 'Ana Martínez', 
    date: '06/04/2025', 
    destination: 'Valparaíso', 
    status: 'Cancelada' 
  }
]);

// Obtener el nombre de usuario actual
onMounted(() => {
  if (authStore.isAuthenticated && authStore.name) {
    username.value = authStore.name;
  }
});

// Función para asignar clases CSS según el estado de la reserva
function getStatusClass(status: string) {
  switch (status) {
    case 'Confirmada':
      return 'bg-green-100 text-green-800';
    case 'Pendiente':
      return 'bg-amber-100 text-amber-800';
    case 'Pagada':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>

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
            <div class="mt-6 flex flex-wrap gap-3">
              <router-link to="/reservas" class="inline-flex items-center bg-white text-blue-600 font-medium px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <v-icon left size="small" class="mr-2">mdi-calendar-check</v-icon>
                Ver reservas recientes
              </router-link>
              
              <button @click="refreshData" class="inline-flex items-center bg-blue-700 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                <v-icon left size="small" class="mr-2">mdi-refresh</v-icon>
                Actualizar datos
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notificaciones -->
      <div v-if="notifications.length > 0" class="mb-8 bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-amber-500">
        <div class="px-6 py-4 bg-amber-50 border-b flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <v-icon color="amber-darken-2" class="mr-2">mdi-bell</v-icon>
            Notificaciones Pendientes
          </h3>
          <button class="text-amber-600 hover:text-amber-800 text-sm font-medium">
            Marcar todas como leídas
          </button>
        </div>
        <div class="p-4">
          <div v-for="(notification, index) in notifications" :key="index" 
               class="py-3 px-4 rounded-lg mb-2 last:mb-0"
               :class="notification.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'">
            <div class="flex items-start">
              <div class="mt-1 mr-3">
                <v-icon :color="notification.type === 'warning' ? 'amber-darken-2' : 'blue-darken-2'" size="small">
                  {{ notification.type === 'warning' ? 'mdi-alert-circle' : 'mdi-information' }}
                </v-icon>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ notification.title }}</h4>
                <p class="text-sm text-gray-600">{{ notification.message }}</p>
                <div class="flex items-center mt-2">
                  <span class="text-xs text-gray-500">{{ notification.time }}</span>
                  <button class="ml-4 text-xs text-blue-600 hover:text-blue-800">Ver detalle</button>
                </div>
              </div>
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
      
      <!-- Gráfico de rendimiento -->
      <div class="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Rendimiento Mensual</h3>
          <div class="flex space-x-2">
            <select v-model="chartPeriod" class="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
            </select>
          </div>
        </div>
        <div class="p-6">
          <div class="h-72">
            <!-- Gráfico simulado -->
            <div class="h-full w-full flex items-end justify-between px-6 pt-6 border-b border-l">
              <div v-for="(item, index) in performanceData" :key="index" class="flex flex-col items-center">
                <div class="w-12 rounded-t-lg bg-blue-500 opacity-80 hover:opacity-100 transition-all"
                     :style="{ height: `${item.value}%` }"></div>
                <span class="text-xs text-gray-600 mt-2">{{ item.label }}</span>
              </div>
            </div>
            
            <!-- Leyenda -->
            <div class="flex justify-center mt-4 space-x-6">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Reservas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secciones divididas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
      
      <!-- Fila final con 2 columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Próximas Actividades -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Próximas Actividades</h3>
            <div class="text-sm">
              <span class="text-blue-600 cursor-pointer">Hoy</span> | 
              <span class="text-gray-500 cursor-pointer">Esta semana</span>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(activity, index) in upcomingActivities" :key="index" 
                   class="flex items-start border-l-2 pl-4 py-2"
                   :class="getActivityBorderClass(activity.type)">
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">{{ activity.title }}</h4>
                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ activity.time }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Destinos Populares -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <h3 class="font-bold text-gray-800">Destinos Populares</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="(destination, index) in popularDestinations" :key="index" 
                   class="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow relative group">
                <div class="h-32 overflow-hidden">
                  <img :src="destination.image" :alt="destination.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-70"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h4 class="text-white font-bold">{{ destination.name }}</h4>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-white/90 text-sm">{{ destination.bookings }} reservas</span>
                    <span class="text-yellow-400 text-sm flex">★★★★★</span>
                  </div>
                </div>
              </div>
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
const chartPeriod = ref('month');

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

// Datos de ejemplo para el gráfico de rendimiento
const performanceData = ref([
  { label: 'Ene', value: 65 },
  { label: 'Feb', value: 59 },
  { label: 'Mar', value: 80 },
  { label: 'Abr', value: 81 },
  { label: 'May', value: 56 },
  { label: 'Jun', value: 55 },
  { label: 'Jul', value: 40 }
]);

// Datos de ejemplo para próximas actividades
const upcomingActivities = ref([
  {
    title: 'Reunión con guía turístico',
    description: 'Discusión sobre nuevos tours en Torres del Paine',
    time: '10:00 AM',
    type: 'meeting'
  },
  {
    title: 'Pago de reserva pendiente',
    description: 'Recordatorio para cliente Juan Pérez',
    time: '12:30 PM',
    type: 'payment'
  },
  {
    title: 'Inicio de tour',
    description: 'Grupo de 5 personas a Isla de Pascua',
    time: '3:00 PM',
    type: 'tour'
  }
]);

// Datos de ejemplo para notificaciones
const notifications = ref([
  {
    title: 'Pago pendiente',
    message: 'La reserva de Juan Pérez tiene un pago pendiente que vence hoy.',
    time: 'Hace 30 minutos',
    type: 'warning'
  },
  {
    title: 'Nueva reserva',
    message: 'Se ha registrado una nueva reserva para el tour de Torres del Paine.',
    time: 'Hace 2 horas',
    type: 'info'
  }
]);

// Datos de ejemplo para destinos populares
const popularDestinations = ref([
  {
    name: 'Torres del Paine',
    bookings: 48,
    image: 'https://images.unsplash.com/photo-1619464953795-eb33627133fc?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Isla de Pascua',
    bookings: 42,
    image: 'https://images.unsplash.com/photo-1596443822985-04238c1ca755?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Desierto de Atacama',
    bookings: 36,
    image: 'https://images.unsplash.com/photo-1519248494489-1e9f5586bf85?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Valparaíso',
    bookings: 29,
    image: 'https://images.unsplash.com/photo-1605714043035-f5c64a88d145?q=80&w=800&auto=format&fit=crop'
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

// Función para asignar clases de borde según el tipo de actividad
function getActivityBorderClass(type: string) {
  switch (type) {
    case 'meeting':
      return 'border-blue-500';
    case 'payment':
      return 'border-green-500';
    case 'tour':
      return 'border-amber-500';
    default:
      return 'border-gray-300';
  }
}

// Función para actualizar datos
function refreshData() {
  // Aquí iría la lógica para actualizar los datos desde la API
  // Por ahora solo simularemos un cambio
  stats.value.reservations += 2;
  stats.value.clients += 1;
}
</script>

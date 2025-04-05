<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-sky-600 to-teal-500" />
    <div class="hero-section relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center z-0" 
           style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80');
                  filter: brightness(0.7);">
      </div>
      <v-container class="py-20 relative z-10 mt-12">
<!--         <div class="text-center text-white mb-12">
          <h1 class="text-5xl font-bold mb-4">Descubre el mundo con nosotros</h1>
          <p class="text-xl max-w-2xl mx-auto">Experiencias únicas y destinos inolvidables para tus vacaciones perfectas</p>
        </div> -->
        <div class="flex justify-center mt-12">
          <v-card class="reservation-card px-0 py-0 rounded-xl overflow-hidden" max-width="500" elevation="15">
            <div class="card-header bg-gradient-to-r from-teal-600 to-cyan-500 py-6 px-8 relative">
              <div class="absolute top-0 right-0 w-32 h-32">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="opacity-20">
                  <path fill="#FFFFFF" d="M39.9,-65.7C51.5,-58.4,60.8,-47.8,67.2,-35.4C73.6,-23,77.1,-8.9,75.8,4.7C74.5,18.3,68.5,31.3,59.8,42.1C51.1,52.9,39.8,61.5,27.1,67.4C14.4,73.3,0.4,76.5,-14.8,76.1C-30,75.7,-46.4,71.7,-57.6,62C-68.8,52.3,-74.8,37,-78.8,21.2C-82.8,5.4,-84.8,-10.9,-79.9,-24.8C-75,-38.7,-63.2,-50.2,-49.7,-57.1C-36.2,-64,-18.1,-66.3,-1.7,-63.8C14.7,-61.3,28.3,-73,39.9,-65.7Z" transform="translate(100 100)" />
                </svg>
              </div>
              <div class="flex items-center mb-3">
                <div class="bg-white p-2 rounded-full mr-3">
                  <v-icon color="teal-darken-2" size="large">mdi-compass</v-icon>
                </div>
                <h2 class="text-3xl font-bold text-white">Reserva tu Aventura</h2>
              </div>
              <p class="text-teal-50 text-lg relative z-10">Comienza el viaje de tus sueños hoy mismo</p>
            </div>
            
            <div class="card-body px-8 py-6">
              <div class="destination-selector mb-6">
                <p class="text-gray-600 mb-4">Selecciona tu próximo destino:</p>
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="destination-option flex items-center p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all">
                    <v-icon color="amber-darken-2" class="mr-2">mdi-beach</v-icon>
                    <span class="font-medium text-gray-800">Playas</span>
                  </div>
                  <div class="destination-option flex items-center p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all">
                    <v-icon color="green-darken-1" class="mr-2">mdi-pine-tree</v-icon>
                    <span class="font-medium text-gray-800">Montañas</span>
                  </div>
                  <div class="destination-option flex items-center p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all">
                    <v-icon color="blue-darken-1" class="mr-2">mdi-city-variant</v-icon>
                    <span class="font-medium text-gray-800">Ciudades</span>
                  </div>
                  <div class="destination-option flex items-center p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all">
                    <v-icon color="deep-orange" class="mr-2">mdi-map-marker-radius</v-icon>
                    <span class="font-medium text-gray-800">Exóticos</span>
                  </div>
                </div>
              </div>
              
              <div class="travel-benefits mb-6">
                <div class="flex items-center mb-3">
                  <v-icon color="teal" size="small" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-gray-700">Reserva sin cargos de cancelación</span>
                </div>
                <div class="flex items-center mb-3">
                  <v-icon color="teal" size="small" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-gray-700">Asistencia 24/7 durante tu viaje</span>
                </div>
                <div class="flex items-center">
                  <v-icon color="teal" size="small" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-gray-700">Mejores precios garantizados</span>
                </div>
              </div>
              
              <div class="cta-section">
                <v-btn 
                  block
                  color="teal-darken-2" 
                  @click="goToWizard" 
                  size="x-large"
                  class="py-3 text-white font-medium text-lg relative overflow-hidden"
                  elevation="3">
                  <span class="relative z-10">Iniciar Mi Reserva</span>
                  <span class="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                  <v-icon class="ml-2">mdi-arrow-right</v-icon>
                </v-btn>
                <p class="text-center text-gray-500 text-sm mt-4">
                  <v-icon size="x-small" class="mr-1">mdi-shield-check</v-icon>
                  Pago seguro y protección de datos garantizada
                </p>
              </div>
            </div>
            
            <div class="card-footer bg-gray-50 px-8 py-4 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <v-icon color="amber" size="small" class="mr-1">mdi-star</v-icon>
                  <v-icon color="amber" size="small" class="mr-1">mdi-star</v-icon>
                  <v-icon color="amber" size="small" class="mr-1">mdi-star</v-icon>
                  <v-icon color="amber" size="small" class="mr-1">mdi-star</v-icon>
                  <v-icon color="amber" size="small" class="mr-1">mdi-star-half</v-icon>
                  <span class="text-gray-600 text-sm ml-1">4.8/5 (2,345 reseñas)</span>
                </div>
                <div>
                  <span class="text-xs text-gray-500">Más de 10,000 viajeros satisfechos</span>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </v-container>
    </div>
    <div class="features py-16 bg-gray-50">
      <v-container>
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Nuestros Servicios Premium</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card p-6 bg-white rounded-lg shadow-md text-center">
            <v-icon color="teal-darken-1" size="x-large" class="mb-4">mdi-airplane-takeoff</v-icon>
            <h3 class="text-xl font-semibold mb-2 text-teal-800">Vuelos Internacionales</h3>
            <p class="text-gray-600">Las mejores tarifas y conexiones para tu destino soñado</p>
          </div>
          <div class="feature-card p-6 bg-white rounded-lg shadow-md text-center">
            <v-icon color="teal-darken-1" size="x-large" class="mb-4">mdi-hotel</v-icon>
            <h3 class="text-xl font-semibold mb-2 text-teal-800">Hoteles de Lujo</h3>
            <p class="text-gray-600">Alojamientos seleccionados para una experiencia inolvidable</p>
          </div>
          <div class="feature-card p-6 bg-white rounded-lg shadow-md text-center">
            <v-icon color="teal-darken-1" size="x-large" class="mb-4">mdi-map-search</v-icon>
            <h3 class="text-xl font-semibold mb-2 text-teal-800">Tours Exclusivos</h3>
            <p class="text-gray-600">Experiencias únicas con guías locales expertos</p>
          </div>
        </div>
      </v-container>
    </div>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

const router = useRouter();

function goToWizard() {
  // Redirige a la ruta del wizard, ajústala según tu configuración
  router.push('/wizard');
}
</script>

<style scoped>
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.reservation-card {
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  max-width: 500px;
}

.reservation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.destination-option {
  transition: all 0.2s ease;
}

.destination-option:hover {
  transform: translateY(-2px);
}

.card-header {
  position: relative;
  overflow: hidden;
}

.card-header::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(30deg);
}
</style>
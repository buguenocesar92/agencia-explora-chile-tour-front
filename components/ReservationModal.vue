<template>
  <v-dialog v-model="showModal" max-width="500px" persistent>
    <v-card class="reservation-modal overflow-hidden rounded-xl">
      <!-- Encabezado con gradiente -->
      <div class="card-header bg-gradient-to-r from-green-500 to-blue-600 py-8 px-8 relative">
        <div class="absolute top-8 right-8 w-24 h-24 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M39.9,-65.7C51.5,-58.4,60.8,-47.8,67.2,-35.4C73.6,-23,77.1,-8.9,75.8,4.7C74.5,18.3,68.5,31.3,59.8,42.1C51.1,52.9,39.8,61.5,27.1,67.4C14.4,73.3,0.4,76.5,-14.8,76.1C-30,75.7,-46.4,71.7,-57.6,62C-68.8,52.3,-74.8,37,-78.8,21.2C-82.8,5.4,-84.8,-10.9,-79.9,-24.8C-75,-38.7,-63.2,-50.2,-49.7,-57.1C-36.2,-64,-18.1,-66.3,-1.7,-63.8C14.7,-61.3,28.3,-73,39.9,-65.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div class="flex items-center mb-4">
          <div class="bg-white p-3 rounded-full mr-4 shadow-md">
            <v-icon color="green-500" size="large">mdi-leaf</v-icon>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Reserva tu Aventura</h2>
            <p class="text-white text-md mt-1 opacity-90">Descubre Chile con nosotros</p>
          </div>
        </div>
        <p class="text-white text-lg relative z-10 font-light">Comienza el viaje de tus sueños hoy mismo</p>
      </div>
      
      <!-- Cuerpo del modal -->
      <div class="card-body px-8 py-8 bg-white">
        <div class="travel-benefits mb-8">
          <div class="benefit-item flex items-center mb-4">
            <div class="icon-wrapper bg-green-100 p-2 rounded-full mr-3">
              <v-icon color="green-500" size="small">mdi-check-circle</v-icon>
            </div>
            <span class="text-gray-700">Reserva sin cargos de cancelación</span>
          </div>
          <div class="benefit-item flex items-center mb-4">
            <div class="icon-wrapper bg-green-100 p-2 rounded-full mr-3">
              <v-icon color="green-500" size="small">mdi-clock-time-four</v-icon>
            </div>
            <span class="text-gray-700">Asistencia 24/7 durante tu viaje</span>
          </div>
          <div class="benefit-item flex items-center">
            <div class="icon-wrapper bg-green-100 p-2 rounded-full mr-3">
              <v-icon color="green-500" size="small">mdi-currency-usd</v-icon>
            </div>
            <span class="text-gray-700">Mejores precios garantizados</span>
          </div>
        </div>
        
        <!-- Botón CTA -->
        <div class="cta-section">
          <router-link 
            to="/wizard"
            class="block py-4 text-white font-medium text-lg relative overflow-hidden shadow-lg
                   bg-green-500 hover:bg-green-600 rounded-lg text-center transition-all duration-300
                   flex items-center justify-center"
            @click="startReservation">
            <span class="relative z-10 flex items-center">
              INICIAR MI RESERVA
              <v-icon class="ml-2">mdi-arrow-right</v-icon>
            </span>
          </router-link>
          <p class="text-center text-gray-500 text-sm mt-4 flex items-center justify-center">
            <v-icon size="x-small" class="mr-1">mdi-shield-check</v-icon>
            Pago seguro y protección de datos garantizada
          </p>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'start-reservation']);

const showModal = ref(props.modelValue);

// Vigilar cambios en la prop modelValue
watch(() => props.modelValue, (newVal) => {
  showModal.value = newVal;
});

// Vigilar cambios en showModal para emitir eventos
watch(() => showModal.value, (newVal) => {
  emit('update:modelValue', newVal);
});

function startReservation() {
  emit('start-reservation');
  showModal.value = false;
}
</script>

<style scoped>
.reservation-modal {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: none;
}

.card-header {
  position: relative;
  overflow: hidden;
}

.icon-wrapper {
  transition: all 0.3s ease;
}

.benefit-item:hover .icon-wrapper {
  transform: scale(1.1);
}
</style> 
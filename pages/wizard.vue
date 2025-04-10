<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-blue-600 to-blue-800" v-if="false" />
    
    <div class="wizard-container py-16 min-h-screen relative">
      <!-- Imagen de fondo (bg.webp) -->
      <div class="absolute inset-0 bg-cover bg-center bg-fixed" 
           style="background-image: url('/bg.webp'); filter: brightness(0.8);">
      </div>
      
      <!-- Overlay azul con gradiente -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-80"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto">
          <!-- Logo -->
          <div class="flex justify-center mb-8">
            <img src="/logo.png" alt="Explora Chiletour" class="h-24 mb-2" />
          </div>
          
          <div class="reservation-wizard bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <!-- Header con decoración -->
            <div class="wizard-header bg-gradient-to-r from-blue-600 to-blue-800 py-10 px-8 relative">
              <!-- Forma decorativa -->
              <div class="absolute top-8 right-8 w-32 h-32 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M39.9,-65.7C51.5,-58.4,60.8,-47.8,67.2,-35.4C73.6,-23,77.1,-8.9,75.8,4.7C74.5,18.3,68.5,31.3,59.8,42.1C51.1,52.9,39.8,61.5,27.1,67.4C14.4,73.3,0.4,76.5,-14.8,76.1C-30,75.7,-46.4,71.7,-57.6,62C-68.8,52.3,-74.8,37,-78.8,21.2C-82.8,5.4,-84.8,-10.9,-79.9,-24.8C-75,-38.7,-63.2,-50.2,-49.7,-57.1C-36.2,-64,-18.1,-66.3,-1.7,-63.8C14.7,-61.3,28.3,-73,39.9,-65.7Z" transform="translate(100 100)" />
                </svg>
              </div>
              <div class="flex items-center mb-4">
                <div class="bg-white p-3 rounded-full mr-4 shadow-md">
                  <v-icon color="blue-600" size="large">mdi-leaf</v-icon>
                </div>
                <div>
                  <h1 class="text-3xl font-bold text-white">Tu mejor viaje comienza aquí</h1>
                  <p class="text-white text-md mt-1 opacity-90">Viajes grupales por Chile y el mundo 🌎</p>
                </div>
              </div>
              <p class="text-white text-lg relative z-10 font-light">
                Completa los siguientes datos para reservar tu próxima experiencia inolvidable
              </p>
            </div>
            
            <!-- Stepper personalizado -->
            <div class="custom-stepper-header px-8 py-6 bg-white border-b border-gray-100">
              <div class="flex justify-between">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="step-item flex flex-col items-center relative"
                  :class="{ 
                    'active': currentStep >= step.value,
                    'completed': currentStep > step.value
                  }"
                >
                  <div class="step-connector" v-if="index < steps.length - 1"></div>
                  <div class="step-circle flex items-center justify-center transition-all duration-300">
                    <v-icon v-if="currentStep > step.value" color="white" size="small">mdi-check</v-icon>
                    <span v-else>{{ step.value }}</span>
                  </div>
                  <div class="step-title mt-2 text-center font-medium">{{ step.title }}</div>
                </div>
              </div>
            </div>
            
            <!-- Contenido del paso actual -->
            <div class="wizard-content px-8 py-8">
              <!-- Paso 1 -->
              <div v-if="currentStep === 1" class="step-content animate-fadeIn">
                <div class="step-header mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">Datos Personales</h2>
                  <p class="text-gray-600">Ingresa tus datos para personalizar tu experiencia de viaje</p>
                </div>
                <ReservationFormPersonal ref="personalFormRef" />
              </div>
              
              <!-- Paso 2 -->
              <div v-if="currentStep === 2" class="step-content animate-fadeIn">
                <div class="step-header mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">Selección del Viaje</h2>
                  <p class="text-gray-600">Elige tu destino y personaliza los detalles de tu viaje</p>
                </div>
                <ReservationFormTrip ref="tripFormRef" />
              </div>
              
              <!-- Paso 3 -->
              <div v-if="currentStep === 3" class="step-content animate-fadeIn">
                <div class="step-header mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">Proceso de Pago</h2>
                  <p class="text-gray-600">Completa tu reserva con un método de pago seguro</p>
                </div>
                <ReservationFormPayment ref="paymentFormRef" />
              </div>
            </div>
            
            <!-- Botones de navegación -->
            <div class="wizard-actions p-8 bg-gray-50 border-t border-gray-100">
              <div class="flex justify-between items-center flex-wrap gap-4">
                <div class="flex items-center text-gray-500" v-if="currentStep > 1">
                  <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
                  <span class="text-sm">Puedes volver atrás para revisar tus datos</span>
                </div>
                
                <div class="navigation-buttons flex flex-wrap gap-3 ml-auto">
                  <button
                    v-if="currentStep > 1"
                    class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300"
                    @click="currentStep--"
                  >
                    <span class="flex items-center">
                      <v-icon class="mr-2">mdi-arrow-left</v-icon>
                      Atrás
                    </span>
                  </button>
                  
                  <button 
                    v-if="currentStep < 3"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    @click="validateAndNext(currentStep)" 
                    :disabled="currentStep === 1 ? isPersonalLoading : isTripLoading"
                  >
                    <span class="flex items-center">
                      Siguiente
                      <v-icon class="ml-2">mdi-arrow-right</v-icon>
                    </span>
                  </button>
                  
                  <button 
                    v-if="currentStep === 3"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    @click="handlePaymentSubmit" 
                    :disabled="isPaymentLoading"
                  >
                    <span class="flex items-center">
                      <v-icon class="mr-2">mdi-check-circle</v-icon>
                      Completar Reserva
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de redes sociales -->
      <div class="mt-8 flex justify-center space-x-4 pb-8 relative z-10">
        <a href="https://facebook.com/ExploraChiletour" target="_blank" class="text-white hover:text-blue-200 transition-colors">
          <v-icon size="24">mdi-facebook</v-icon>
        </a>
        <a href="https://instagram.com/girasexplora" target="_blank" class="text-white hover:text-blue-200 transition-colors">
          <v-icon size="24">mdi-instagram</v-icon>
        </a>
        <a href="https://api.whatsapp.com/message/PTODH3ELVDXNN1?autoload=1&app_absent=0" target="_blank" class="text-white hover:text-green-200 transition-colors">
          <v-icon size="24">mdi-whatsapp</v-icon>
        </a>
      </div>
    </div>
    
    <FooterComponent class="w-full" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import ReservationFormPersonal from '@/components/Reserva/ReservationFormPersonal.vue';
import ReservationFormTrip from '@/components/Reserva/ReservationFormTrip.vue';
import ReservationFormPayment from '@/components/Reserva/ReservationFormPayment.vue';
import { useClientForm } from '@/composables/useClientForm';
import { useTripForm } from '@/composables/useTripForm';
import { usePaymentForm } from '@/composables/usePaymentForm';

const currentStep = ref(1);

// Definir los pasos
const steps = [
  { title: 'Datos Personales', value: 1 },
  { title: 'Selección del Viaje', value: 2 },
  { title: 'Proceso de Pago', value: 3 }
];

// Referencias a los componentes de formulario
const personalFormRef = ref(null);
const tripFormRef = ref(null);
const paymentFormRef = ref(null);

// Estados de carga
const { isLoading: isPersonalLoading } = useClientForm();
const { isLoading: isTripLoading } = useTripForm();
const { isLoading: isPaymentLoading } = usePaymentForm();

// Validar y avanzar
const validateAndNext = async (step) => {
  try {
    if (step === 1 && personalFormRef.value) {
      const isValid = await personalFormRef.value.validate();
      if (isValid) currentStep.value = 2;
    } else if (step === 2 && tripFormRef.value) {
      const isValid = await tripFormRef.value.validate();
      if (isValid) currentStep.value = 3;
    }
  } catch (error) {
    console.error('Error al validar:', error);
  }
};

// Manejar el envío del pago
const handlePaymentSubmit = async () => {
  try {
    if (paymentFormRef.value) {
      const isValid = await paymentFormRef.value.validate();
      if (isValid) {
        // Proceder con el procesamiento del pago
        await paymentFormRef.value.handleSubmit();
      }
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
  }
};
</script>

<style scoped>
.reservation-wizard {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: none;
  transition: all 0.4s ease;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #4b5563;
  font-weight: bold;
}

.step-connector {
  position: absolute;
  top: 18px;
  left: 50%;
  right: -50%;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 0;
}

.step-item.active .step-circle {
  background-color: #2563eb; /* blue-600 */
  color: white;
}

.step-item.completed .step-circle {
  background-color: #1d4ed8; /* blue-700 */
}

.step-item.active .step-connector,
.step-item.completed .step-connector {
  background-color: #2563eb; /* blue-600 */
}

.icon-wrapper {
  transition: all 0.3s ease;
}

.benefit-item:hover .icon-wrapper {
  transform: scale(1.1);
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilo para botones deshabilitados */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wizard-container {
  position: relative;
  overflow: hidden;
}

.wizard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
  pointer-events: none;
  z-index: 1;
}
</style>
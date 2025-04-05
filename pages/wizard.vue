<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-sky-600 to-teal-500" />
    
    <div class="wizard-container py-16 bg-gray-50 min-h-screen mt-10">
      <v-container>
        <v-card class="reservation-wizard mx-auto overflow-hidden" max-width="1000" elevation="10" rounded="xl">
          <!-- Header con decoración -->
          <div class="wizard-header bg-gradient-to-r from-teal-600 to-cyan-500 py-8 px-8 relative">
            <div class="absolute top-0 right-0 w-40 h-40">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="opacity-20">
                <path fill="#FFFFFF" d="M39.9,-65.7C51.5,-58.4,60.8,-47.8,67.2,-35.4C73.6,-23,77.1,-8.9,75.8,4.7C74.5,18.3,68.5,31.3,59.8,42.1C51.1,52.9,39.8,61.5,27.1,67.4C14.4,73.3,0.4,76.5,-14.8,76.1C-30,75.7,-46.4,71.7,-57.6,62C-68.8,52.3,-74.8,37,-78.8,21.2C-82.8,5.4,-84.8,-10.9,-79.9,-24.8C-75,-38.7,-63.2,-50.2,-49.7,-57.1C-36.2,-64,-18.1,-66.3,-1.7,-63.8C14.7,-61.3,28.3,-73,39.9,-65.7Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div class="flex items-center mb-3">
              <div class="bg-white p-2 rounded-full mr-4">
                <v-icon color="teal-darken-2" size="large">mdi-airplane-check</v-icon>
              </div>
              <h1 class="text-3xl font-bold text-white">Reserva tu Viaje</h1>
            </div>
            <p class="text-teal-50 text-lg max-w-xl relative z-10">
              Completa los siguientes pasos para personalizar y confirmar tu próxima aventura
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
                <div class="step-circle flex items-center justify-center">
                  <v-icon v-if="currentStep > step.value" color="white" size="small">mdi-check</v-icon>
                  <span v-else>{{ step.value }}</span>
                </div>
                <div class="step-title mt-2 text-center">{{ step.title }}</div>
              </div>
            </div>
          </div>
          
          <!-- Contenido del paso actual -->
          <div class="wizard-content px-8 py-6">
            <!-- Paso 1 -->
            <div v-if="currentStep === 1" class="step-content">
              <div class="step-header mb-6">
                <h2 class="text-2xl font-semibold text-gray-800">Datos Personales</h2>
                <p class="text-gray-600">Ingresa tus datos para personalizar tu experiencia de viaje</p>
              </div>
              <ReservationFormPersonal ref="personalFormRef" />
            </div>
            
            <!-- Paso 2 -->
            <div v-if="currentStep === 2" class="step-content">
              <div class="step-header mb-6">
                <h2 class="text-2xl font-semibold text-gray-800">Selección del Viaje</h2>
                <p class="text-gray-600">Elige tu destino y personaliza los detalles de tu viaje</p>
              </div>
              <ReservationFormTrip ref="tripFormRef" />
            </div>
            
            <!-- Paso 3 -->
            <div v-if="currentStep === 3" class="step-content">
              <div class="step-header mb-6">
                <h2 class="text-2xl font-semibold text-gray-800">Proceso de Pago</h2>
                <p class="text-gray-600">Completa tu reserva con un método de pago seguro</p>
              </div>
              <ReservationFormPayment ref="paymentFormRef" />
            </div>
          </div>
          
          <!-- Botones de navegación -->
          <div class="wizard-actions px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div class="flex justify-between items-center">
              <div class="flex items-center text-gray-500" v-if="currentStep > 1">
                <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
                <span class="text-sm">Puedes volver atrás para revisar tus datos</span>
              </div>
              
              <div class="navigation-buttons ml-auto">
                <v-btn
                  v-if="currentStep > 1"
                  variant="outlined"
                  color="teal-darken-1"
                  size="large"
                  class="mr-4 px-6"
                  elevation="0"
                  @click="currentStep--"
                >
                  <v-icon start>mdi-arrow-left</v-icon>
                  Atrás
                </v-btn>
                
                <v-btn 
                  v-if="currentStep < 3"
                  color="teal-darken-1" 
                  size="large"
                  class="px-6"
                  elevation="2"
                  @click="validateAndNext(currentStep)" 
                  :loading="currentStep === 1 ? isPersonalLoading : isTripLoading"
                >
                  Siguiente
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
                
                <v-btn 
                  v-if="currentStep === 3"
                  color="teal-darken-1" 
                  size="large"
                  class="px-6"
                  elevation="2"
                  @click="handlePaymentSubmit" 
                  :loading="isPaymentLoading"
                >
                  <v-icon start>mdi-check-circle</v-icon>
                  Completar Reserva
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- Footer con garantías -->
          <div class="wizard-footer px-8 py-4 border-t border-gray-100 bg-white">
            <div class="flex flex-wrap justify-center gap-6">
              <div class="flex items-center">
                <v-icon color="teal-darken-1" size="small" class="mr-2">mdi-shield-check</v-icon>
                <span class="text-sm text-gray-600">Pago 100% Seguro</span>
              </div>
              <div class="flex items-center">
                <v-icon color="teal-darken-1" size="small" class="mr-2">mdi-currency-usd-off</v-icon>
                <span class="text-sm text-gray-600">Sin Cargos Ocultos</span>
              </div>
              <div class="flex items-center">
                <v-icon color="teal-darken-1" size="small" class="mr-2">mdi-account-check</v-icon>
                <span class="text-sm text-gray-600">Asistencia 24/7</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-container>
    </div>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
  if (paymentFormRef.value) {
    try {
      const isValid = await paymentFormRef.value.validate();
      if (isValid) {
        await paymentFormRef.value.handleSubmit();
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  }
};
</script>

<style scoped>
.wizard-container {
  background-image: linear-gradient(to bottom, rgba(240, 249, 255, 0.8), rgba(240, 249, 255, 0.4)),
                    url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.reservation-wizard {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-stepper-header {
  position: relative;
}

.step-item {
  flex: 1;
  z-index: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-item.active .step-circle {
  background-color: #0d9488;
  color: white;
}

.step-item.completed .step-circle {
  background-color: #0d9488;
}

.step-title {
  color: #64748b;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  max-width: 120px;
}

.step-item.active .step-title {
  color: #0d9488;
  font-weight: 600;
}

.step-connector {
  position: absolute;
  top: 20px;
  right: calc(-50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background-color: #e2e8f0;
  z-index: 0;
}

.step-item.active .step-connector,
.step-item.completed .step-connector {
  background-color: #0d9488;
}

.wizard-header {
  position: relative;
  overflow: hidden;
}

.wizard-header::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(30deg);
}

.navigation-buttons {
  display: flex;
  align-items: center;
}

.step-content {
  min-height: 300px;
}
</style>
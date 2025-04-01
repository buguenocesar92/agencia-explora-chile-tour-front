<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
    
    <v-container class="mt-20 mb-10">
      <v-card class="reservation-card mx-auto" max-width="900" elevation="3" rounded="lg">
        <v-card-title class="text-center py-6 bg-primary text-white rounded-t-lg">
          <h1 class="text-h4 font-weight-bold">Reserva tu Viaje</h1>
        </v-card-title>
        
        <!-- Usa :items="steps" y los slots item.x -->
        <v-stepper 
          v-model="currentStep" 
          :items="steps" 
          flat 
          class="custom-stepper"
        >
          <!-- 1) Elimina la cabecera personalizada -->
          <!-- 2) Mantén el slot de acciones vacío para no duplicar botones -->
          <template v-slot:actions></template>

          <!-- Paso 1 -->
          <template v-slot:item.1>
            <v-card flat class="pa-6">
              <ReservationFormPersonal ref="personalFormRef" />
            </v-card>
          </template>
          
          <!-- Paso 2 -->
          <template v-slot:item.2>
            <v-card flat class="pa-6">
              <ReservationFormTrip ref="tripFormRef" />
            </v-card>
          </template>
          
          <!-- Paso 3 -->
          <template v-slot:item.3>
            <v-card flat class="pa-6">
              <ReservationFormPayment ref="paymentFormRef" />
            </v-card>
          </template>
        </v-stepper>
        
        <!-- Botones de navegación -->
        <v-card-actions class="pa-6 d-flex justify-center">
          <div class="navigation-buttons" :class="{ 'single-button': currentStep === 1 }">
            <v-btn
              v-if="currentStep > 1"
              variant="outlined"
              color="primary"
              size="large"
              class="mr-4"
              @click="currentStep--"
              prepend-icon="mdi-arrow-left"
            >
              Atrás
            </v-btn>
            
            <v-btn 
              v-if="currentStep < 3"
              color="primary" 
              size="large"
              @click="validateAndNext(currentStep)" 
              :loading="currentStep === 1 ? isPersonalLoading : isTripLoading"
              append-icon="mdi-arrow-right"
            >
              Siguiente
            </v-btn>
            
            <v-btn 
              v-if="currentStep === 3"
              color="success" 
              size="large"
              @click="handlePaymentSubmit" 
              :loading="isPaymentLoading"
              prepend-icon="mdi-check"
            >
              Completar Reserva
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-container>
    
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
import { useRouter } from 'vue-router';

const currentStep = ref(1);

// Definir los pasos (aparecen en la cabecera por defecto)
const steps = [
  { title: '1. Datos Personales', value: 1 },
  { title: '2. Selección del Viaje', value: 2 },
  { title: '3. Proceso de Pago', value: 3 }
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

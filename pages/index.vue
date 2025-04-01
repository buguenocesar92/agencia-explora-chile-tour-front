<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
    <v-container class="mt-20 d-flex justify-center">
      <v-card class="pa-6" max-width="400">
        <v-card-title class="text-center">
          Reserva tu Viaje
        </v-card-title>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" @click="goToWizard" size="large">
            Ir al Wizard de Reserva
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
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

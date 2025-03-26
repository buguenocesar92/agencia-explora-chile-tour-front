<!-- pages/index.vue -->
<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
    <div class="container mx-auto p-6 max-w-md mt-20">
      <!-- Aquí se muestra el formulario de reserva -->
      <ReservationForm />
    </div>
    <FooterComponent class="mt-14" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import ReservationForm from "@/components/Reserva/ReservationForm.vue";
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">Editar Reserva</h2>
      <ReservationForm
        :modelValue="reservation"
        :isEditing="isEditing"
        :isLoading="isLoading"
        :errors="errors"
        @update:modelValue="reservation = $event"
        @submit="handleSubmit"
      />
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import ReservationForm from '@/components/Reserva/ReservationForm.vue';
import { useReservationForm } from '~/composables/Reservation/useReservationForm';

const { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation } = useReservationForm();
const route = useRoute();

onMounted(() => {
  const reservationId = Number(route.params.id);
  if (reservationId) {
    isEditing.value = true;
    loadReservation(reservationId);
  }
});
</script>

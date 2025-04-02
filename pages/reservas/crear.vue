<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">Nueva Reserva</h2>
      <ReservationForm
        :modelValue="reservation"
        :isEditing="false"
        :isLoading="isLoading"
        :errors="errors"
        @update:modelValue="reservation = $event"
        @submit="handleSubmit"
      />
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';
import ReservationForm from '@/components/Reserva/ReservationForm.vue';
import { useReservationForm } from '~/composables/Reservation/useReservationForm';

const { reservation, isLoading, errors, handleSubmit } = useReservationForm();
</script>

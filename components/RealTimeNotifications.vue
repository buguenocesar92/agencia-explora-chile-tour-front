<template>
    <div class="fixed bottom-0 right-0 flex flex-col items-end space-y-4 p-4 z-50">
      <ToastNotification
        v-for="(toast, index) in toasts"
        :key="index"
        :title="toast.title"
        :image="toast.image"
        :reservationName="toast.reservationName"
        :reservationMessage="toast.reservationMessage"
        :reservationTime="toast.reservationTime"
        @close="removeToast(index)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useReservationNotifications } from '@/composables/useReservationNotifications';
  import ToastNotification from '@/components/ToastNotification.vue';
  
  const { toasts, removeToast } = useReservationNotifications();
  </script>
  
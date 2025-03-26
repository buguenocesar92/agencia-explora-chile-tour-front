<template>
    <transition name="fade">
      <div v-if="visible" class="w-full max-w-xs p-4 text-gray-900 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300" role="alert">
        <div class="flex items-center mb-3">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</span>
          <button type="button" @click="close" class="ms-auto -mx-1.5 -my-1.5 bg-white flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
            <span class="sr-only">Cerrar</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative inline-block shrink-0">
            <img class="w-12 h-12 rounded-full" :src="image" alt="Reserva" />
          </div>
          <div class="ms-3 text-sm font-normal">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ reservationName }}</div>
            <div class="text-sm">{{ reservationMessage }}</div>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-500">{{ reservationTime }}</span>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    title: { type: String, default: 'Nueva Reserva' },
    image: { type: String, default: 'https://via.placeholder.com/150' },
    reservationName: { type: String, default: '' },
    reservationMessage: { type: String, default: '' },
    reservationTime: { type: String, default: '' }
  });
  
  const emits = defineEmits(['close']);
  
  const visible = ref(true);
  
  function close() {
    visible.value = false;
    emits('close');
  }
  
  onMounted(() => {
    setTimeout(() => {
      close();
    }, 5000);
  });
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  
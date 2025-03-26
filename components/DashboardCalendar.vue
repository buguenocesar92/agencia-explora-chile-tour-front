<template>
  <client-only>
    <div class="relative">
      <FullCalendar :options="calendarOptions" />

      <!-- Modal para mostrar detalles de la reserva -->
      <div
        v-if="showModal"
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-xl w-96 relative md:mb-80">
          <h2 class="text-xl font-semibold mb-4">Detalles de la Reserva</h2>
          <p class="text-gray-700"><strong>Cliente:</strong> {{ selectedReservation?.title }}</p>
          <p class="text-gray-700"><strong>Email:</strong> {{ selectedReservation?.email }}</p>
          <p class="text-gray-700"><strong>Fecha:</strong> {{ selectedReservation?.start }}</p>
          <p class="text-gray-700"><strong>Duración:</strong> {{ selectedReservation?.duration }} min</p>
          <p class="text-gray-700"><strong>Mensaje:</strong> {{ selectedReservation?.message }}</p>

          <div class="mt-4 flex justify-end space-x-2">
            <button
              @click="showModal = false"
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useReservationManager } from '@/composables/useReservationManager'

// Extraemos las opciones del calendario y el estado del modal desde el composable
const { calendarOptions, showModal, selectedReservation } = useReservationManager()
</script>

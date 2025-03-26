<template>
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
              
      
      <!-- Contenido principal -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Formulario de reserva -->
          <form @submit.prevent="reservar" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
              <div class="space-y-6">
                <!-- Información personal -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información personal</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre completo</label>
                      <input 
                        v-model="name" 
                        type="text" 
                        placeholder="Tu nombre" 
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input 
                        v-model="email" 
                        type="email" 
                        placeholder="Tu email" 
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Detalles de la cita -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detalles de la cita</h2>
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de la cita</label>
                    <input 
                      v-model="selectedDate" 
                      type="date" 
                      :min="today" 
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      required 
                    />
                  </div>
                  
                  <!-- Horarios disponibles -->
                  <div v-if="availableTimeSlots.length > 0" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Horarios disponibles</label>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      <button
                        v-for="time in availableTimeSlots"
                        :key="time"
                        type="button"
                        @click="selectedTimeSlot = time"
                        :class="[
                          'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          selectedTimeSlot === time 
                            ? 'bg-indigo-600 text-white' 
                            : 'border border-gray-300 dark:border-gray-700 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900 dark:hover:text-indigo-200'
                        ]"
                      >
                        {{ time }}
                      </button>
                    </div>
                  </div>
                  <div v-else-if="selectedDate" class="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg mb-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-yellow-700 dark:text-yellow-200">
                          No hay horarios disponibles para la fecha seleccionada.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Mensaje adicional -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensaje adicional</label>
                    <textarea 
                      v-model="message" 
                      placeholder="Comentarios o requerimientos especiales" 
                      rows="4"
                      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                </div>
                
                <!-- Mensaje de error -->
                <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700 dark:text-red-200">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <NuxtLink 
                    to="/" 
                    class="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
                  >
                    Cancelar
                  </NuxtLink>
                  <button 
                    type="submit" 
                    class="flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          <!-- Información adicional -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información importante</h2>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Llega 10 minutos antes de tu cita programada.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Si necesitas cancelar, hazlo con al menos 24 horas de anticipación.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recibirás un correo electrónico de confirmación con los detalles de tu cita.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from '#app'
  import { useNuxtApp } from '#app'
  import Navbar from "@/components/Navbars/AuthNavbar.vue"
  import FooterComponent from "@/components/Footers/Footer.vue"
  
  // Instancia de axios y route
  const { $axios } = useNuxtApp()
  const route = useRoute()
  const professionalId = Number(route.params.id)
  
  // Variables reactivas para el formulario
  const name = ref('')
  const email = ref('')
  const selectedDate = ref('')
  const message = ref('')
  const availableTimeSlots = ref<string[]>([])
  const selectedTimeSlot = ref('')
  const errorMessage = ref('')
  const today = new Date().toISOString().split('T')[0]
  
  // Función para obtener los horarios disponibles usando axios
  const fetchAvailableSlots = async () => {
    if (!selectedDate.value) {
      availableTimeSlots.value = []
      return
    }
    try {
      const response = await $axios.get(`/reservations/professionals/${professionalId}/available-slots?date=${selectedDate.value}`)
      availableTimeSlots.value = response.data
    } catch (err: any) {
      console.error('Error fetching available slots:', err)
      availableTimeSlots.value = []
    }
  }
  
  // Actualiza los horarios cada vez que se cambie la fecha
  watch(selectedDate, () => {
    fetchAvailableSlots()
  })
  
  // Función para enviar la reserva
  const reservar = async () => {
    if (!name.value || !email.value || !selectedDate.value || !selectedTimeSlot.value) {
      errorMessage.value = 'Por favor, completa todos los campos obligatorios.'
      return
    }
    
    const payload = {
      professional_id: professionalId,
      name: name.value,
      email: email.value,
      date: selectedDate.value,
      time: selectedTimeSlot.value,
      message: message.value
    }
    
    try {
      await $axios.post('/reservations', payload)
      errorMessage.value = ''
      alert('Reserva creada exitosamente.')
      // Limpia el campo de horario seleccionado y actualiza los slots disponibles
      selectedTimeSlot.value = ''
      await fetchAvailableSlots()
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || err.message || 'Error al enviar la reserva.'
    }
  }
  </script>
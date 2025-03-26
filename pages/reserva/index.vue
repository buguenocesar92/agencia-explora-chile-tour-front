<template>
    <div>
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
      <div class="container mx-auto p-6 max-w-md mt-20">
        <h2 class="text-2xl font-bold mb-6">2. Selección del Viaje</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Destino -->
          <div class="mb-4">
            <label for="destination" class="block text-gray-700 mb-2">Destino</label>
            <input
              id="destination"
              v-model="trip.destination"
              type="text"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.destination }"
            />
            <p v-if="errors.destination" class="text-red-500 text-sm mt-1">{{ errors.destination[0] }}</p>
          </div>

          <!-- Selección de Viaje Predeterminado -->
          <div class="mb-4">
            <label for="tripOption" class="block text-gray-700 mb-2">Selecciona un viaje</label>
            <select
              id="tripOption"
              v-model="selectedTripId"
              @change="onTripChange"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.tripOption }"
            >
              <option value="">Seleccione una opción</option>
              <option
                v-for="option in tripOptions"
                :key="option.id"
                :value="option.id"
              >
                {{ option.departure }} - {{ option.return }}
              </option>
            </select>
            <p v-if="errors.tripOption" class="text-red-500 text-sm mt-1">{{ errors.tripOption[0] }}</p>
          </div>

          <!-- Tipo de Servicio -->
          <div class="mb-4">
            <label for="service_type" class="block text-gray-700 mb-2">Tipo de Servicio</label>
            <select
              id="service_type"
              v-model="trip.service_type"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.service_type }"
            >
              <option value="">Seleccione una opción</option>
              <option value="economico">Económico</option>
              <option value="ejecutivo">Ejecutivo</option>
              <option value="lujo">Lujo</option>
            </select>
            <p v-if="errors.service_type" class="text-red-500 text-sm mt-1">{{ errors.service_type[0] }}</p>
          </div>
          
          <!-- Botón de atras -->
          <button
            type="button"
            @click="$router.back()"
            class="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Atrás
          </button>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading ? 'Guardando...' : 'Siguiente' }}
          </button>
        </form>
      </div>
      <FooterComponent class="mt-14" />
    </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { ref, onMounted } from 'vue';
import { useTripForm } from '@/composables/useTripForm';

definePageMeta({ requiresAuth: false });

const { trip, isLoading, errors, handleSubmit } = useTripForm();

// Opciones de viajes con fechas predeterminadas
const tripOptions = ref([
  { id: 1, departure: '2025-04-01', return: '2025-04-10' },
  { id: 2, departure: '2025-05-01', return: '2025-05-10' },
  { id: 3, departure: '2025-06-01', return: '2025-06-10' },
]);

// Id seleccionado de la opción de viaje (para el select)
const selectedTripId = ref('');

// Actualiza las fechas en el objeto 'trip' según la opción seleccionada
function onTripChange() {
  const selected = tripOptions.value.find(option => option.id === parseInt(selectedTripId.value));
  if (selected) {
    trip.value.departure_date = selected.departure;
    trip.value.return_date = selected.return;
  } else {
    trip.value.departure_date = '';
    trip.value.return_date = '';
  }
}

// Al montar el componente, se carga la data guardada en localStorage y se actualiza el select
onMounted(() => {
  const savedData = localStorage.getItem('tripData');
  if (savedData) {
    const savedTrip = JSON.parse(savedData);
    trip.value = savedTrip;
    // Busca si las fechas guardadas coinciden con alguna opción predeterminada
    const matchingOption = tripOptions.value.find(
      option => option.departure === savedTrip.departure_date && option.return === savedTrip.return_date
    );
    if (matchingOption) {
      selectedTripId.value = matchingOption.id.toString();
    }
  }
});
</script>

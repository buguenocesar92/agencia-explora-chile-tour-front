<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">2. Selección del Viaje</h2>
    <v-form ref="form" @submit.prevent>
      <div class="space-y-4">
        <FormInput
          id="destination"
          label="Destino"
          v-model="trip.destination"
          placeholder="Ingresa el destino"
          :error="errors.destination ? errors.destination[0] : ''"
        />

        <FormSelect
          id="tripOption"
          label="Selecciona un viaje"
          v-model="selectedTripId"
          :options="tripSelectOptions"
          placeholder="Seleccione una opción"
          :error="errors.tripOption ? errors.tripOption[0] : ''"
          @update:modelValue="onTripChange"
        />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/useTripForm';

const { trip, isLoading, errors, validateTrip } = useTripForm();
const form = ref(null);

// Opciones de viajes predeterminadas
const tripOptions = ref([
  { id: 1, departure: '2025-04-01', return: '2025-04-10' },
  { id: 2, departure: '2025-05-01', return: '2025-05-10' },
  { id: 3, departure: '2025-06-01', return: '2025-06-10' },
]);

// Almacena el id seleccionado para el viaje
const selectedTripId = ref('');

// Se mapea tripOptions al formato que requiere FormSelect: { id, name }
const tripSelectOptions = computed(() =>
  tripOptions.value.map(option => ({
    id: option.id,
    name: `${option.departure} - ${option.return}`,
  }))
);

// Función que actualiza las fechas del viaje según la opción seleccionada
function onTripChange() {
  const selected = tripOptions.value.find(
    option => option.id === parseInt(selectedTripId.value)
  );
  if (selected) {
    trip.value.departure_date = selected.departure;
    trip.value.return_date = selected.return;
  } else {
    trip.value.departure_date = '';
    trip.value.return_date = '';
  }
}

// Método de validación que será llamado desde el componente padre
const validate = async () => {
  // Validar usando el composable
  const isValid = await validateTrip();
  console.log('Validación de selección de viaje:', isValid);
  return isValid;
};

// Al montar el componente, se carga la data guardada en localStorage
onMounted(() => {
  const savedData = localStorage.getItem('tripData');
  if (savedData) {
    const savedTrip = JSON.parse(savedData);
    trip.value = savedTrip;
    const matchingOption = tripOptions.value.find(
      option =>
        option.departure === savedTrip.departure_date &&
        option.return === savedTrip.return_date
    );
    if (matchingOption) {
      selectedTripId.value = matchingOption.id.toString();
    }
  }
});

// Exponer el método validate para que el componente padre pueda acceder
defineExpose({
  validate
});
</script>
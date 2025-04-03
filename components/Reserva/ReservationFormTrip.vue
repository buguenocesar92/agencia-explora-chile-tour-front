<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">2. Selección del Viaje</h2>
    <v-form ref="form" @submit.prevent>
      <div class="space-y-4">
        <!-- Select para elegir el Tour definido -->
        <FormSelect
          id="tourSelect"
          label="Selecciona un Tour"
          v-model="selectedTourId"
          :options="tourSelectOptions"
          placeholder="Seleccione un tour"
          :error="errors.tourSelect ? errors.tourSelect[0] : ''"
          @update:modelValue="onTourChange"
        />

        <!-- Select para elegir las fechas programadas del tour -->
        <FormSelect
          id="dateSelect"
          label="Selecciona las fechas"
          v-model="selectedDateId"
          :options="dateSelectOptions"
          placeholder="Seleccione una opción"
          :error="errors.dateSelect ? errors.dateSelect[0] : ''"
          @update:modelValue="onDateChange"
        />

      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/useTripForm';
import { useTourSelect } from '@/composables/useTourSelect';

const { trip, errors, validateTrip } = useTripForm();
const form = ref(null);

// Importar la lógica de los selects y pasarle el objeto trip y errors.
const {
  tourSelectOptions,
  dateSelectOptions,
  selectedTourId,
  selectedDateId,
  onTourChange,
  onDateChange,
  validateSelects
} = useTourSelect(trip, errors);

// Método de validación combinado: valida tanto el formulario (trip) como los selects.
const validate = async () => {
  const validForm = await validateTrip();
  const validSelects = validateSelects();
  const isValid = validForm && validSelects;
  console.log('Validación combinada de selección de viaje:', isValid);
  return isValid;
};

// Restaurar datos guardados en localStorage, si existen.
onMounted(() => {
  const savedData = localStorage.getItem('tripData');
  if (savedData) {
    const savedTrip = JSON.parse(savedData);
    trip.value = savedTrip;
    // Si deseas, podrías restaurar también los IDs de los selects.
  }
});

// Exponer el método validate para que el componente padre (por ejemplo, wizard.vue) pueda acceder.
defineExpose({
  validate
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">2. Selección del Viaje</h2>
    <v-form ref="form" @submit.prevent>
      <div class="space-y-4">
        <!-- Estado de carga de tours -->
        <v-progress-linear
          v-if="loading.tours"
          indeterminate
          color="primary"
        ></v-progress-linear>
        
        <!-- Mensaje si no hay tours disponibles -->
        <div v-if="!loading.tours && tourSelectOptions.length === 0" class="text-red-500 text-sm mb-4">
          No hay tours disponibles. Por favor, intente más tarde.
        </div>

        <!-- Select para elegir el Tour definido -->
        <FormSelect
          id="tourSelect"
          label="Selecciona un Tour"
          v-model="selectedTourId"
          :options="tourSelectOptions"
          placeholder="Seleccione un tour"
          :placeholderValue="''"
          :error="errors.tourSelect ? errors.tourSelect[0] : ''"
          @update:modelValue="handleTourChange"
        />

        <!-- Estado de carga de fechas -->
        <v-progress-linear
          v-if="loading.dates"
          indeterminate
          color="primary"
        ></v-progress-linear>
        
        <!-- Mensaje si no hay fechas disponibles -->
        <div v-if="!loading.dates && selectedTourId && dateSelectOptions.length === 0" class="text-amber-500 text-sm mb-4">
          No hay fechas disponibles para este tour. Por favor, seleccione otro tour.
        </div>

        <!-- Select para elegir las fechas programadas del tour -->
        <FormSelect
          id="dateSelect"
          label="Selecciona las fechas"
          v-model="selectedDateId"
          :options="dateSelectOptions"
          placeholder="Seleccione una fecha"
          :placeholderValue="''"
          :error="errors.dateSelect ? errors.dateSelect[0] : ''"
          @update:modelValue="onDateChange"
          :disabled="!selectedTourId || dateSelectOptions.length === 0"
        />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/useTripForm';
import { useTourSelect } from '@/composables/useTourSelect';

const { trip, errors, validateTrip } = useTripForm();
const form = ref(null);

// Estado de carga para tours y fechas
const loading = reactive({
  tours: false,
  dates: false
});

// Importar la lógica de los selects y pasarle el objeto trip y errors.
const {
  tourSelectOptions,
  dateSelectOptions,
  selectedTourId,
  selectedDateId,
  onTourChange,
  onDateChange,
  loadTours,
  validateSelects
} = useTourSelect(trip, errors);

// Función personalizada para cargar tours con estado de carga
async function loadToursWithLoading() {
  loading.tours = true;
  try {
    console.log("Iniciando carga de tours...");
    await loadTours();
    console.log("Tours cargados:", tourSelectOptions.value.length);
  } catch (error) {
    console.error("Error al cargar tours:", error);
  } finally {
    loading.tours = false;
  }
}

// Función personalizada para cambiar tour con estado de carga
async function handleTourChange(newTourId: string) {
  loading.dates = true;
  selectedDateId.value = ''; // Resetear fecha seleccionada con string vacío
  console.log("Cambiando tour a:", newTourId);
  
  try {
    await onTourChange(newTourId);
    console.log("Fechas cargadas:", dateSelectOptions.value.length);
  } catch (error) {
    console.error("Error al cargar fechas:", error);
  } finally {
    loading.dates = false;
  }
}

// Método de validación combinado: valida tanto el formulario (trip) como los selects.
const validate = async () => {
  console.log("Validando selección de viaje...");
  console.log("Tour seleccionado:", selectedTourId.value);
  console.log("Fecha seleccionada:", selectedDateId.value);
  
  const validForm = await validateTrip();
  const validSelects = validateSelects();
  const isValid = validForm && validSelects;
  console.log('Validación combinada de selección de viaje:', isValid);
  return isValid;
};

// Restaurar datos guardados en localStorage, si existen.
onMounted(() => {
  console.log("Montando componente ReservationFormTrip");
  const savedData = localStorage.getItem('tripData');
  if (savedData) {
    console.log("Datos restaurados desde localStorage:", savedData);
    const savedTrip = JSON.parse(savedData);
    trip.value = savedTrip;
    
    // Restaurar IDs seleccionados si existen
    if (savedTrip.tourId) {
      selectedTourId.value = savedTrip.tourId.toString();
    }
    if (savedTrip.dateId) {
      selectedDateId.value = savedTrip.dateId.toString();
    }
  }
  
  // Cargar tours al montar el componente
  loadToursWithLoading();
});

// Exponer el método validate para que el componente padre (por ejemplo, wizard.vue) pueda acceder.
defineExpose({
  validate
});
</script>

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
          @update:modelValue="onDateChangeHandler"
          :disabled="!selectedTourId || dateSelectOptions.length === 0"
        />
        
        <!-- Visualizador de PDF - Solo visible cuando se ha seleccionado tour y fecha -->
        <div v-if="selectedTourId && selectedDateId" class="mt-6 border border-gray-300 rounded overflow-hidden">
          <div class="bg-blue-600 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
            <h3 class="font-medium text-white">Documento informativo del viaje</h3>
            <a :href="pdfUrl" target="_blank" class="text-white hover:underline flex items-center">
              <span>Ver completo</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
          <iframe :src="pdfUrl" class="w-full h-96" title="Documento PDF del viaje"></iframe>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/useTripForm';
import { useTourSelect } from '@/composables/useTourSelect';
import { TourService } from '@/services/tour.service';

const { trip, errors, validateTrip } = useTripForm();
const form = ref(null);

// Variable para la URL del PDF del viaje seleccionado
const selectedTripPdfUrl = ref<string>('');

// PDF de ejemplo por defecto
const defaultPdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

// URL del PDF a mostrar (el seleccionado o el de ejemplo)
const pdfUrl = computed(() => {
  // Si se ha seleccionado un PDF específico, mostrarlo
  if (selectedTripPdfUrl.value) {
    return selectedTripPdfUrl.value;
  }
  
  // Si hay tour y fecha seleccionados pero no hay PDF específico, mostrar el PDF por defecto
  if (selectedTourId.value && selectedDateId.value) {
    return defaultPdfUrl;
  }
  
  // En otro caso, no mostrar nada (aunque no debería llegar aquí porque el visualizador estará oculto)
  return '';
});

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
  selectedTripPdfUrl.value = ''; // Resetear URL del PDF
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

// Función para cargar el PDF del viaje
async function loadTripPdf(tourId: string, dateId: string) {
  try {
    // En producción, esto sería reemplazado por una llamada real a la API
    // Por ahora, simular una respuesta con el PDF de ejemplo
    console.log(`Obteniendo PDF del tour ${tourId} con fecha ${dateId}...`);
    
    // En un entorno real, intentaríamos primero obtener el PDF específico de la fecha
    // y si no existe, obtendríamos el PDF general del tour
    
    // Simular una URL única para cada combinación de tour y fecha
    selectedTripPdfUrl.value = `${defaultPdfUrl}?tour=${tourId}&date=${dateId}`;
  } catch (error) {
    console.error("Error al cargar el PDF:", error);
    // En caso de error, usar el PDF de ejemplo
    selectedTripPdfUrl.value = defaultPdfUrl;
  }
}

// Función que maneja el cambio de fecha
const onDateChangeHandler = async (newDateId: string) => {
  onDateChange(newDateId);
  
  // Si hay fecha seleccionada, cargar el PDF correspondiente
  if (newDateId && selectedTourId.value) {
    await loadTripPdf(selectedTourId.value, newDateId);
  } else {
    // Si no hay fecha seleccionada, limpiar la URL del PDF
    selectedTripPdfUrl.value = '';
  }
};

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
      
      // Si hay tour y fecha guardados, cargar el PDF correspondiente
      if (selectedTourId.value && selectedDateId.value) {
        loadTripPdf(selectedTourId.value, selectedDateId.value);
      }
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

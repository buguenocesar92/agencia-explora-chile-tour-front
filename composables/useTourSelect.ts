// src/composables/useTourSelect.ts
import { ref, computed, onMounted } from 'vue';
import { fetchTours, fetchDatesTours } from '@/services/ToursService';
import type { Tour, TripDate } from '@/types/TourTypes';

interface Errors {
  [key: string]: string[];
}

/**
 * Composable que maneja la lógica de los selects de tours y fechas.
 * Se le pasa el objeto reactivo `trip` (por ejemplo, de useTripForm) y `errors`.
 */
export function useTourSelect(
  trip: Ref<{ destination: string; departure_date: string; return_date: string }>,
  errors: Ref<Errors>
) {
  // Arreglo que contendrá la lista de tours obtenidos desde el API.
  const tourOptions = ref<Tour[]>([]);
  // Arreglo para las fechas (programaciones) del tour seleccionado.
  const dateOptions = ref<TripDate[]>([]);
  // IDs seleccionados en los selects (se manejan como strings).
  const selectedTourId = ref('');
  const selectedDateId = ref('');

  // Computed para mapear los tours al formato que espera FormSelect.
  const tourSelectOptions = computed(() =>
    tourOptions.value.map(tour => ({
      id: tour.id,
      name: tour.name
    }))
  );

  // Computed para mapear las fechas al formato deseado.
  const dateSelectOptions = computed(() =>
    dateOptions.value.map(date => ({
      id: date.id,
      name: `${date.departure_date} - ${date.return_date}`
    }))
  );

  // Función para cargar la lista de tours desde el API.
  async function loadTours() {
    try {
      const response = await fetchTours();
      let toursData: any[] = [];
      if (Array.isArray(response)) {
        toursData = response;
      } else if (response.tours && Array.isArray(response.tours)) {
        toursData = response.tours;
      }
      // Transformamos los datos para cumplir con la interfaz Tour.
      tourOptions.value = toursData.map(item => ({
        id: item.id,
        name: item.destination, // Si no existe un campo "name", usamos "destination".
        destination: item.destination
      }));
    } catch (error) {
      console.error('Error al cargar tours:', error);
      errors.value.tourSelect = ['Error al cargar tours'];
    }
  }

  // Al seleccionar un tour, se cargan las fechas y se actualiza el destino.
  async function onTourChange(newTourId: string) {
    selectedTourId.value = newTourId;
    try {
      const response = await fetchDatesTours(parseInt(newTourId));
      let datesData: any[] = [];
      if (Array.isArray(response)) {
        datesData = response;
      } else if (response.trips && Array.isArray(response.trips)) {
        datesData = response.trips;
      }
      dateOptions.value = datesData;
      // Reiniciar la selección de fecha.
      selectedDateId.value = '';

      // Actualizar el destino del objeto trip a partir del tour seleccionado.
      const selectedTour = tourOptions.value.find(t => t.id === parseInt(newTourId));
      trip.value.destination = selectedTour ? selectedTour.destination : '';
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      errors.value.dateSelect = ['Error al cargar fechas'];
    }
  }

  // Al seleccionar una fecha, se actualizan los campos de salida y regreso en trip.
  function onDateChange(newDateId: string) {
    selectedDateId.value = newDateId;
    const selectedDate = dateOptions.value.find(d => d.id === parseInt(newDateId));
    if (selectedDate) {
      trip.value.departure_date = selectedDate.departure_date;
      trip.value.return_date = selectedDate.return_date;
    } else {
      trip.value.departure_date = '';
      trip.value.return_date = '';
    }
  }

  // Función para validar que se haya seleccionado un tour y una fecha.
  function validateSelects() {
    let valid = true;
    // Limpiar errores de los selects.
    errors.value.tourSelect = [];
    errors.value.dateSelect = [];

    if (!selectedTourId.value) {
      errors.value.tourSelect = ['Debes seleccionar un tour'];
      valid = false;
    }
    if (!selectedDateId.value) {
      errors.value.dateSelect = ['Debes seleccionar una fecha'];
      valid = false;
    }
    return valid;
  }

  // Cargar automáticamente los tours al montar el composable.
  onMounted(() => {
    loadTours();
  });

  return {
    tourSelectOptions,
    dateSelectOptions,
    selectedTourId,
    selectedDateId,
    onTourChange,
    onDateChange,
    loadTours,
    validateSelects
  };
}

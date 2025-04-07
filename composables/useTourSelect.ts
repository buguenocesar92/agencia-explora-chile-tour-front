// src/composables/useTourSelect.ts
import { ref, watch, computed, type Ref } from 'vue';
import { TourService } from '@/services/tour.service';
import type { ITour, ITourDate, ITrip, SelectOption } from '@/types/tour.interface';

interface Errors {
  [key: string]: string[];
}

/**
 * Composable para la selección de tours y fechas
 * @param trip Referencia al objeto de viaje donde se almacenarán los datos
 * @param errors Objeto de errores para la validación
 * @returns Funciones y datos para manejar la selección de tours y fechas
 */
export const useTourSelect = (trip: Ref<ITrip>, errors: any) => {
  // Referencias reactivas
  const toursList = ref<ITour[]>([]);
  const tourDates = ref<ITourDate[]>([]);
  const selectedTourId = ref<string>('');
  const selectedDateId = ref<string>('');
  
  // Opciones formateadas para los select
  const tourSelectOptions = computed<SelectOption[]>(() => {
    return toursList.value.map((tour) => ({
      text: tour.name || tour.destination || `Tour ${tour.id}`,
      value: tour.id.toString()
    }));
  });
  
  const dateSelectOptions = computed<SelectOption[]>(() => {
    return tourDates.value.map((date) => ({
      text: `${date.departure_date} - ${date.arrival_date || date.return_date || 'Sin fecha de regreso'}`,
      value: date.id.toString()
    }));
  });

  // Carga la lista de tours disponibles
  const loadTours = async () => {
    try {
      console.log('Cargando tours...');
      const response = await TourService.getAllTours();
      
      if (!response) {
        console.error('No se recibió respuesta del servicio de tours');
        toursList.value = [];
        return;
      }
      
      // Manejo de diferentes formatos de respuesta
      if (Array.isArray(response)) {
        console.log(`Recibidos ${response.length} tours`);
        toursList.value = response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log(`Recibidos ${response.data.length} tours`);
        toursList.value = response.data;
      } else if (typeof response === 'object' && response !== null) {
        // Intenta extraer un array si existe en alguna propiedad del objeto
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          const toursArray = possibleArrays[0] as ITour[];
          console.log(`Extraídos ${toursArray.length} tours del objeto de respuesta`);
          toursList.value = toursArray;
        } else {
          console.error('No se encontró un array de tours en la respuesta');
          toursList.value = [];
        }
      } else {
        console.error('Formato de respuesta inesperado:', response);
        toursList.value = [];
      }
      
      // Restaurar el tour seleccionado si está guardado
      if (trip.value && trip.value.tourId) {
        selectedTourId.value = trip.value.tourId.toString();
        await onTourChange(selectedTourId.value);
      }
    } catch (error) {
      console.error('Error al cargar tours:', error);
      toursList.value = [];
      if (errors.tourSelect) {
        errors.tourSelect = ['Error al cargar tours'];
      }
    }
  };

  // Maneja el cambio de tour seleccionado
  const onTourChange = async (newTourId: string) => {
    console.log('Tour seleccionado:', newTourId);
    selectedTourId.value = newTourId;
    selectedDateId.value = '';
    tourDates.value = [];
    
    // Validar que tenemos un ID válido
    if (!newTourId) {
      console.log('No se seleccionó un tour válido');
      return;
    }
    
    try {
      const response = await TourService.getTourDates(newTourId);
      
      if (!response) {
        console.error('No se recibió respuesta del servicio de fechas');
        tourDates.value = [];
        return;
      }
      
      // Manejo de diferentes formatos de respuesta
      if (Array.isArray(response)) {
        console.log(`Recibidas ${response.length} fechas para el tour ${newTourId}`);
        tourDates.value = response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log(`Recibidas ${response.data.length} fechas para el tour ${newTourId}`);
        tourDates.value = response.data;
      } else if (typeof response === 'object' && response !== null) {
        // Intenta extraer un array si existe en alguna propiedad del objeto
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          const datesArray = possibleArrays[0] as ITourDate[];
          console.log(`Extraídas ${datesArray.length} fechas del objeto de respuesta`);
          tourDates.value = datesArray;
        } else {
          console.error('No se encontró un array de fechas en la respuesta');
          tourDates.value = [];
        }
      } else {
        console.error('Formato de respuesta inesperado para fechas:', response);
        tourDates.value = [];
      }
      
      // Actualizar el tour ID en el objeto trip
      if (trip.value) {
        trip.value.tourId = parseInt(newTourId);
        trip.value.dateId = null;
        trip.value.trip_date_id = null;
      }
      
      // Restaurar la fecha seleccionada si está guardada
      if (trip.value && trip.value.dateId) {
        const matchingDate = tourDates.value.find(
          date => date.id === trip.value.dateId
        );
        if (matchingDate) {
          selectedDateId.value = trip.value.dateId.toString();
        }
      }
    } catch (error) {
      console.error('Error al cargar fechas:', error);
      tourDates.value = [];
      if (errors.dateSelect) {
        errors.dateSelect = ['Error al cargar fechas'];
      }
    }
  };

  // Maneja el cambio de fecha seleccionada
  const onDateChange = (newDateId: string) => {
    console.log('Fecha seleccionada:', newDateId);
    selectedDateId.value = newDateId;
    
    if (trip.value && newDateId) {
      trip.value.dateId = parseInt(newDateId);
      // Actualizar trip_date_id para compatibilidad con el backend
      trip.value.trip_date_id = parseInt(newDateId);
      
      // Buscar la fecha seleccionada para obtener más detalles
      const selectedDate = tourDates.value.find(
        date => date.id.toString() === newDateId
      );
      
      if (selectedDate) {
        trip.value.departureDate = selectedDate.departure_date;
        trip.value.arrivalDate = selectedDate.arrival_date || selectedDate.return_date;
      }
    }
  };

  // Función para validar la selección de tour y fecha
  const validateSelects = () => {
    let isValid = true;
    
    // Validar selección de tour
    if (!selectedTourId.value) {
      errors.tourSelect = ['Debes seleccionar un tour'];
      isValid = false;
    } else {
      errors.tourSelect = null;
    }
    
    // Validar selección de fecha
    if (!selectedDateId.value) {
      errors.dateSelect = ['Debes seleccionar una fecha'];
      isValid = false;
    } else {
      errors.dateSelect = null;
    }
    
    return isValid;
  };

  // Observar cambios en los IDs seleccionados para guardar datos
  watch([selectedTourId, selectedDateId], () => {
    if (trip.value) {
      localStorage.setItem('tripData', JSON.stringify(trip.value));
    }
  });

  return {
    toursList,
    tourDates,
    tourSelectOptions,
    dateSelectOptions,
    selectedTourId,
    selectedDateId,
    loadTours,
    onTourChange,
    onDateChange,
    validateSelects
  };
};

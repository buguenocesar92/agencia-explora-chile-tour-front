<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-card-title>Detalles del Viaje</v-card-title>
      <v-card-text v-if="trip">
        <div><strong>ID de Viaje:</strong> {{ trip.id }}</div>
        <div v-if="trip.departure_date"><strong>Fecha de Salida:</strong> {{ trip.departure_date }}</div>
        <div v-if="trip.return_date"><strong>Fecha de Regreso:</strong> {{ trip.return_date }}</div>
        <!-- Si la relación tour_template está cargada, mostrar detalles del tour -->
        <div v-if="trip.tour_template">
          <div><strong>Nombre del Tour:</strong> {{ trip.tour_template.name }}</div>
          <div v-if="trip.tour_template.destination"><strong>Destino:</strong> {{ trip.tour_template.destination }}</div>
          <div v-if="trip.tour_template.description"><strong>Descripción:</strong> {{ trip.tour_template.description }}</div>
        </div>
        <div v-else>
          <em>Detalles del tour no disponibles</em>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Define interfaces for trip data
interface TourTemplate {
  id?: number;
  name?: string;
  destination?: string | null;
  description?: string | null;
}

interface Trip {
  id?: number;
  tour_id?: number | null;
  trip_date_id?: number | null;
  departure_date?: string | null;
  return_date?: string | null;
  tour_template?: TourTemplate | null;
}

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  trip: {
    type: Object as () => Trip,
    required: true,
    default: () => ({})
  }
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script> 
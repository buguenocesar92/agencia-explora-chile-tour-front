<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Sección de Cliente -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Nombre del Cliente</label>
        <input v-model="localReservation.client.name" type="text" class="w-full px-3 py-2 border rounded" :class="{ 'border-red-500': errors['client.name'] }" />
        <p v-if="errors['client.name']" class="text-red-500 text-sm mt-1">{{ errors['client.name'][0] }}</p>
      </div>
      <!-- Resto de campos (email, rut, etc.) de forma similar... -->
  
      <!-- Sección de Viaje -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Destino del Viaje</label>
        <input v-model="localReservation.trip.destination" type="text" class="w-full px-3 py-2 border rounded" :class="{ 'border-red-500': errors['trip.destination'] }" />
        <p v-if="errors['trip.destination']" class="text-red-500 text-sm mt-1">{{ errors['trip.destination'][0] }}</p>
      </div>
      <!-- Selección de viaje, etc. -->
  
      <!-- Comprobante de Pago -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Comprobante de Pago (Imagen)</label>
        <div v-if="localReservation.payment.receipt_url">
          <img :src="localReservation.payment.receipt_url" alt="Comprobante de Pago" class="mb-2 max-h-40 object-contain" />
        </div>
        <input type="file" accept="image/*" @change="handleFileChangeWithPreview" class="w-full" />
        <div v-if="previewUrl">
          <p class="text-gray-700 mt-1">Nueva imagen seleccionada:</p>
          <img :src="previewUrl" alt="Nueva vista previa" class="mt-2 max-h-40 object-contain" />
        </div>
        <p v-if="errors['payment.receipt']" class="text-red-500 text-sm mt-1">{{ errors['payment.receipt'][0] }}</p>
      </div>
  
      <button type="submit" :disabled="isLoading" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50">
        {{ isLoading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Reserva' : 'Crear Reserva') }}
      </button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, toRefs } from 'vue';
  import type { ReservationPayload } from '@/types/ReservationTypes';
  
  // Props para pasar datos iniciales y modo de edición
  const props = defineProps<{
    modelValue: ReservationPayload;
    isEditing: boolean;
    isLoading: boolean;
    errors: { [key: string]: string[] };
  }>();
  
  const emit = defineEmits<{
    (e: 'submit', data: ReservationPayload): void;
    (e: 'update:modelValue', data: ReservationPayload): void;
  }>();
  
  // Crear una copia local para editar
  const localReservation = ref<ReservationPayload>({ ...props.modelValue });
  const { isEditing, isLoading, errors } = toRefs(props);
  
  // Para la vista previa del comprobante
  const previewUrl = ref('');
  
  // Actualizar la copia local si la prop cambia (por ejemplo, al cargar datos en edición)
  watch(() => props.modelValue, (newVal) => {
    localReservation.value = { ...newVal };
  });
  
  // Función para manejar el cambio del archivo y generar vista previa
  function handleFileChangeWithPreview(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      localReservation.value.payment.receipt = target.files[0];
      previewUrl.value = URL.createObjectURL(target.files[0]);
      // Notificar al padre de la actualización, si se requiere sincronizar
      emit('update:modelValue', localReservation.value);
    }
  }
  
  function onSubmit() {
    emit('submit', localReservation.value);
  }
  </script>
  
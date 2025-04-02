<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Sección de Cliente -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Nombre del Cliente</label>
      <input
        v-model="localReservation.client.name"
        type="text"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.name'] }"
      />
      <p v-if="errors['client.name']" class="text-red-500 text-sm mt-1">
        {{ errors['client.name'][0] }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Email del Cliente</label>
      <input
        v-model="localReservation.client.email"
        type="email"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.email'] }"
      />
      <p v-if="errors['client.email']" class="text-red-500 text-sm mt-1">
        {{ errors['client.email'][0] }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">RUT del Cliente</label>
      <input
        v-model="localReservation.client.rut"
        type="text"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.rut'] }"
      />
      <p v-if="errors['client.rut']" class="text-red-500 text-sm mt-1">
        {{ errors['client.rut'][0] }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Fecha de Nacimiento</label>
      <input
        v-model="localReservation.client.date_of_birth"
        type="date"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.date_of_birth'] }"
      />
      <p v-if="errors['client.date_of_birth']" class="text-red-500 text-sm mt-1">
        {{ errors['client.date_of_birth'][0] }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Nacionalidad</label>
      <input
        v-model="localReservation.client.nationality"
        type="text"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.nationality'] }"
      />
      <p v-if="errors['client.nationality']" class="text-red-500 text-sm mt-1">
        {{ errors['client.nationality'][0] }}
      </p>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Teléfono</label>
      <input
        v-model="localReservation.client.phone"
        type="text"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['client.phone'] }"
      />
      <p v-if="errors['client.phone']" class="text-red-500 text-sm mt-1">
        {{ errors['client.phone'][0] }}
      </p>
    </div>

    <!-- Sección de Viaje -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Destino del Viaje</label>
      <input
        v-model="localReservation.trip.destination"
        type="text"
        class="w-full px-3 py-2 border rounded"
        :class="{ 'border-red-500': errors['trip.destination'] }"
      />
      <p v-if="errors['trip.destination']" class="text-red-500 text-sm mt-1">
        {{ errors['trip.destination'][0] }}
      </p>
    </div>
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
        <option v-for="option in tripOptions" :key="option.id" :value="option.id">
          {{ option.departure }} - {{ option.return }}
        </option>
      </select>
      <p v-if="errors.tripOption" class="text-red-500 text-sm mt-1">
        {{ errors.tripOption[0] }}
      </p>
    </div>

    <!-- Sección de Pago: Comprobante de Pago -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Comprobante de Pago (Imagen)</label>
      <div v-if="localReservation.payment.receipt_url">
        <img
          :src="localReservation.payment.receipt_url"
          alt="Comprobante Actual"
          class="mb-2 max-h-40 object-contain"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        @change="handleFileChangeWithPreview"
        class="w-full"
      />
      <div v-if="previewUrl">
        <p class="text-gray-700 mt-1">Nueva imagen seleccionada:</p>
        <img
          :src="previewUrl"
          alt="Vista previa"
          class="mt-2 max-h-40 object-contain"
        />
      </div>
      <p v-if="errors['payment.receipt']" class="text-red-500 text-sm mt-1">
        {{ errors['payment.receipt'][0] }}
      </p>
    </div>

    <!-- Botón de envío -->
    <button
      type="submit"
      :disabled="isLoading"
      class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {{ isLoading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Reserva' : 'Crear Reserva') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import type { ReservationPayload } from '@/types/ReservationTypes';

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

// Copia local para modificar sin afectar la prop directamente
const localReservation = ref<ReservationPayload>({ ...props.modelValue });
const { isEditing, isLoading, errors } = toRefs(props);

const previewUrl = ref('');
const selectedTripId = ref('');

// Opciones para seleccionar un viaje (puedes parametrizarlo si lo deseas)
const tripOptions = ref([
  { id: 1, departure: '2025-04-01', return: '2025-04-10' },
  { id: 2, departure: '2025-05-01', return: '2025-05-10' },
  { id: 3, departure: '2025-06-01', return: '2025-06-10' },
]);

// Actualiza la copia local cuando modelValue cambie
watch(() => props.modelValue, (newVal) => {
  localReservation.value = { ...newVal };
});

function onTripChange() {
  const selected = tripOptions.value.find(
    option => option.id === parseInt(selectedTripId.value)
  );
  if (selected) {
    localReservation.value.trip.departure_date = selected.departure;
    localReservation.value.trip.return_date = selected.return;
  } else {
    localReservation.value.trip.departure_date = '';
    localReservation.value.trip.return_date = '';
  }
  emit('update:modelValue', localReservation.value);
}

function handleFileChangeWithPreview(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    localReservation.value.payment.receipt = target.files[0];
    previewUrl.value = URL.createObjectURL(target.files[0]);
    emit('update:modelValue', localReservation.value);
  }
}

function onSubmit() {
  emit('submit', localReservation.value);
}
</script>

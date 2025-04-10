<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Sección de Cliente -->
    <FormInput
      id="client-name"
      label="Nombre del Cliente"
      v-model="localReservation.client.name"
      :error="errors['client.name'] ? errors['client.name'][0] : ''"
      required
    />
    <FormInput
      id="client-email"
      label="Email del Cliente"
      type="email"
      v-model="localReservation.client.email"
      :error="errors['client.email'] ? errors['client.email'][0] : ''"
      required
    />
    <FormInput
      id="client-rut"
      label="RUT del Cliente"
      v-model="localReservation.client.rut"
      :error="errors['client.rut'] ? errors['client.rut'][0] : ''"
      required
    />
    <FormInput
      id="client-dob"
      label="Fecha de Nacimiento"
      type="date"
      v-model="localReservation.client.date_of_birth"
      :error="errors['client.date_of_birth'] ? errors['client.date_of_birth'][0] : ''"
      required
    />
    <FormInput
      id="client-nationality"
      label="Nacionalidad"
      v-model="localReservation.client.nationality"
      :error="errors['client.nationality'] ? errors['client.nationality'][0] : ''"
      required
    />
    <FormInput
      id="client-phone"
      label="Teléfono"
      v-model="localReservation.client.phone"
      :error="errors['client.phone'] ? errors['client.phone'][0] : ''"
      required
    />

    <!-- Sección de Viaje -->
    <FormInput
      id="trip-destination"
      label="Destino del Viaje"
      v-model="localReservation.trip.destination"
      :error="errors['trip.destination'] ? errors['trip.destination'][0] : ''"
      required
    />
    <FormSelect
      id="trip-option"
      label="Selecciona un viaje"
      :options="tripOptionsSelect"
      v-model="selectedTripId"
      :error="errors.tripOption ? errors.tripOption[0] : ''"
      required
      placeholder="Seleccione una opción"
      :placeholderValue="''"
      @change="onTripChange"
    />

    <!-- Sección de Pago: Comprobante de Pago -->
    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Comprobante de Pago</label>
      <div v-if="localReservation.payment.receipt_url">
        <img
          v-if="localReservation.payment.receipt_url.toLowerCase().endsWith('.jpg') || 
                localReservation.payment.receipt_url.toLowerCase().endsWith('.jpeg') || 
                localReservation.payment.receipt_url.toLowerCase().endsWith('.png') || 
                localReservation.payment.receipt_url.toLowerCase().endsWith('.bmp')"
          :src="localReservation.payment.receipt_url"
          alt="Comprobante Actual"
          class="mb-2 max-h-40 object-contain"
        />
        <div v-else-if="localReservation.payment.receipt_url.toLowerCase().endsWith('.pdf')">
          <a :href="localReservation.payment.receipt_url" target="_blank" class="text-blue-500 underline">
            Ver documento PDF
          </a>
        </div>
      </div>
      <FormInput
        id="payment-receipt"
        label=""
        type="file"
        v-model="paymentFile"
        :error="errors['payment.receipt'] ? errors['payment.receipt'][0] : ''"
        accept=".jpg,.jpeg,.png,.bmp,.pdf"
      />
      <p class="text-sm text-gray-600 mt-1">
        Formatos permitidos: JPG, JPEG, PNG, BMP, PDF. Tamaño máximo: 2MB.
      </p>
      <div v-if="previewUrl">
        <p class="text-gray-700 mt-1">Nuevo archivo seleccionado:</p>
        <img
          v-if="isImageFile"
          :src="previewUrl"
          alt="Vista previa"
          class="mt-2 max-h-40 object-contain"
        />
        <p v-else class="mt-2 text-blue-500">
          Archivo PDF seleccionado
        </p>
      </div>
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
import { ref, watch, toRefs, computed } from 'vue';
import type { ReservationPayload } from '@/types/ReservationTypes';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';

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

// Crear una copia local para editar sin modificar directamente la prop
const localReservation = ref<ReservationPayload>({ ...props.modelValue });
const { isEditing, isLoading, errors } = toRefs(props);

// Para el manejo de la imagen del comprobante
const paymentFile = ref<File | null>(null);
const previewUrl = ref('');

// Para el select del viaje
const selectedTripId = ref('');
const tripOptionsSelect = ref([
  { id: 1, name: '2025-04-01 - 2025-04-10' },
  { id: 2, name: '2025-05-01 - 2025-05-10' },
  { id: 3, name: '2025-06-01 - 2025-06-10' },
]);

// Propiedad computada para verificar si el archivo seleccionado es una imagen
const isImageFile = computed(() => {
  if (!paymentFile.value) return false;
  
  const fileName = paymentFile.value.name.toLowerCase();
  return fileName.endsWith('.jpg') || 
         fileName.endsWith('.jpeg') || 
         fileName.endsWith('.png') || 
         fileName.endsWith('.bmp');
});

// Sincronizar localReservation cuando modelValue cambie
watch(() => props.modelValue, (newVal) => {
  localReservation.value = { ...newVal };
});

// Cuando se cargue la reserva en edición, asignar el id del viaje al select
watch(
  () => localReservation.value.trip.id,
  (newTripId) => {
    if (newTripId) {
      selectedTripId.value = newTripId.toString();
    } else {
      selectedTripId.value = '';
    }
  },
  { immediate: true }
);

// Manejar el cambio del select de viaje
function onTripChange() {
  const selected = tripOptionsSelect.value.find(
    option => option.id === parseInt(selectedTripId.value)
  );
  if (selected) {
    const [departure, returnDate] = selected.name.split(' - ');
    localReservation.value.trip.departure_date = departure;
    localReservation.value.trip.return_date = returnDate;
  } else {
    localReservation.value.trip.departure_date = '';
    localReservation.value.trip.return_date = '';
  }
  emit('update:modelValue', localReservation.value);
}

// Manejar el cambio del input file (a través de FormInput)
watch(paymentFile, (newFile) => {
  if (newFile) {
    localReservation.value.payment.receipt = newFile;
    previewUrl.value = URL.createObjectURL(newFile);
    emit('update:modelValue', localReservation.value);
  }
});

// Función para manejar el cambio del archivo en el componente FormInput (tipo file)
function handleFileChangeWithPreview(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    paymentFile.value = target.files[0];
  }
}

function onSubmit() {
  emit('submit', localReservation.value);
}
</script>

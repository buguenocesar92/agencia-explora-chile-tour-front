<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-card-title>Programa del Viaje</v-card-title>
      <v-card-text>
        <!-- Vista previa del PDF -->
        <div v-if="programaUrl" class="pdf-preview">
          <!-- Mostrar PDF mediante iframe directo (igual que ReceiptModal) -->
          <div class="pa-4">
            <div class="d-flex justify-center mb-4">
              <v-btn
                color="primary"
                :href="programaUrl"
                target="_blank"
              >
                Ver programa completo
              </v-btn>
            </div>
            
            <iframe
              :src="programaUrl"
              width="100%"
              height="450px"
              frameborder="0"
              style="border: 1px solid #ddd;"
            ></iframe>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <em>Este viaje no tiene un programa asociado</em>
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
import { ref, onMounted, watch } from 'vue';
import { getProgramaFileUrl } from '@/services/TripService';
import type { TripPayload, TourTemplate } from '@/types/TripTypes';

// Redefinimos la interfaz Trip para usar dentro del componente
interface Trip extends TripPayload {
  // Propiedades adicionales específicas para este componente si las hay
  tour_id?: number | null;
  trip_date_id?: number | null;
}

const props = defineProps({
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

// Estado para la URL del PDF
const programaUrl = ref<string | null>(null);

// Cargar la URL del programa cuando se muestra el modal
watch(() => props.modelValue, async (newVal) => {
  if (newVal && props.trip && props.trip.id) {
    await loadProgramaUrl();
  }
}, { immediate: true });

// Cargar la URL del programa
async function loadProgramaUrl() {
  if (!props.trip || !props.trip.id) return;
  
  try {
    // Resetear valores por si hay errores
    programaUrl.value = null;
    
    // Obtener URL del archivo
    const response = await getProgramaFileUrl(props.trip.id);
    
    if (response.file_url) {
      programaUrl.value = response.file_url;
    }
  } catch (error) {
    console.error('Error al cargar el archivo del programa:', error);
  }
}
</script>

<style scoped>
.pdf-preview {
  border-radius: 4px;
  overflow: hidden;
}
</style> 
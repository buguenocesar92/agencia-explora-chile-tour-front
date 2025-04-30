<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-card-title>Programa del Viaje</v-card-title>
      <v-card-text>
        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">Cargando programa...</p>
        </div>
        
        <!-- Error al cargar el programa -->
        <div v-else-if="error" class="text-center py-4 text-red-500">
          <v-icon color="error" size="large">mdi-alert-circle</v-icon>
          <p class="mt-2">{{ error }}</p>
        </div>
        
        <!-- Vista previa del PDF -->
        <div v-else-if="programaUrl" class="pdf-preview">
          <!-- Mostrar PDF mediante Google Docs Viewer -->
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
              :src="googleDocsViewerUrl"
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
import { ref, onMounted, watch, computed } from 'vue';
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

// Estados para controlar la carga y los errores
const loading = ref(false);
const error = ref<string | null>(null);

// Estado para la URL del PDF
const programaUrl = ref<string | null>(null);

// URL para Google Docs Viewer
const googleDocsViewerUrl = computed(() => {
  if (!programaUrl.value) return '';
  
  // Si es una URL de blob (archivo local), no podemos usar Google Docs Viewer
  if (programaUrl.value.startsWith('blob:')) {
    return programaUrl.value;
  }
  
  // Para URLs remotas, usar Google Docs Viewer
  return `https://docs.google.com/viewer?url=${encodeURIComponent(programaUrl.value)}&embedded=true`;
});

// Cargar la URL del programa cuando se muestra el modal
watch(() => props.modelValue, async (newVal) => {
  if (newVal && props.trip && props.trip.id) {
    await loadProgramaUrl();
  }
}, { immediate: true });

// Cargar la URL del programa
async function loadProgramaUrl() {
  if (!props.trip || !props.trip.id) return;
  
  loading.value = true;
  error.value = null;
  programaUrl.value = null;
  
  try {
    console.log("Cargando programa para el viaje ID:", props.trip.id);
    
    // Obtener URL del archivo
    const response = await getProgramaFileUrl(props.trip.id);
    
    if (response && response.file_url) {
      programaUrl.value = response.file_url;
      console.log("URL del programa obtenida:", programaUrl.value);
    } else {
      console.warn("No se encontró URL del programa para este viaje");
    }
  } catch (err: any) {
    console.error('Error al cargar el archivo del programa:', err);
    error.value = "No se pudo cargar el programa del viaje.";
    
    if (err.response && err.response.status === 404) {
      error.value = "El programa de este viaje no está disponible.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.pdf-preview {
  border-radius: 4px;
  overflow: hidden;
}
</style> 
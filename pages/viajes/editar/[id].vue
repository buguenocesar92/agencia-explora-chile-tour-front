<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        Editar Viaje
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Select para elegir el Tour Template -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Tour Template</label>
          <FormSelect
            id="tourTemplateSelect"
            v-model="trip.tour_template_id"
            :options="tourTemplateOptions"
            label="Tour Template"
            placeholder="Seleccione un tour template"
            :error="errors.tour_template_id ? errors.tour_template_id[0] : ''"
          />
        </div>
        <!-- Campo para la Fecha de Salida -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Salida</label>
          <input
            v-model="trip.departure_date"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.departure_date }"
            :min="today"
          />
          <p v-if="errors.departure_date" class="text-red-500 text-sm mt-1">
            {{ errors.departure_date[0] }}
          </p>
        </div>
        <!-- Campo para la Fecha de Regreso -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Fecha de Regreso</label>
          <input
            v-model="trip.return_date"
            type="date"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.return_date }"
            :min="trip.departure_date || today"
          />
          <p v-if="errors.return_date" class="text-red-500 text-sm mt-1">
            {{ errors.return_date[0] }}
          </p>
        </div>
        <!-- Campo para subir un PDF -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Documento PDF</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="application/pdf"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.pdf_file }"
          />
          <p class="text-sm text-gray-500 mt-1">Sube un documento PDF relacionado con el viaje</p>
          <p v-if="errors.pdf_file" class="text-red-500 text-sm mt-1">
            {{ errors.pdf_file[0] }}
          </p>
          <div v-if="pdfFileName" class="mt-2 text-sm text-blue-600">
            Archivo actual: {{ pdfFileName }}
          </div>
          
          <!-- Vista previa del PDF actual -->
          <div v-if="previewUrl" class="mt-4">
            <div class="text-gray-700 font-semibold mb-2">Vista previa del programa:</div>
            <div class="border border-gray-300 rounded overflow-hidden" style="height: 400px;">
              <iframe :src="googleDocsViewerUrl" width="100%" height="100%" frameborder="0"></iframe>
            </div>
            <div class="mt-2 text-right">
              <v-btn small color="primary" :href="previewUrl" target="_blank">
                <v-icon class="mr-1">mdi-open-in-new</v-icon>
                Ver Completo
              </v-btn>
            </div>
          </div>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import AdminWrapper from '@/components/AdminWrapper.vue';
import FormSelect from '@/components/FormSelect.vue';
import { useTripForm } from '@/composables/Admin/useTripForm';
import { fetchTourTemplates } from '@/services/TourTemplateService';
import { getProgramaFileUrl } from '@/services/TripService';
import type { TourTemplatePayload } from '@/types/TourTemplateTypes';

definePageMeta({
  requiresAuth: true,
});

const route = useRoute();
const { trip, isEditing, isLoading, errors, handleSubmit, loadTrip } = useTripForm();

// Variable para almacenar el nombre del archivo PDF actual
const pdfFileName = ref<string>('');
// Variable para la URL de vista previa del PDF
const previewUrl = ref<string | null>(null);

// URL para Google Docs Viewer
const googleDocsViewerUrl = computed(() => {
  if (!previewUrl.value) return '';
  
  // Si es una URL de blob (archivo local), no podemos usar Google Docs Viewer
  if (previewUrl.value.startsWith('blob:')) {
    return previewUrl.value;
  }
  
  // Para URLs remotas, usar Google Docs Viewer
  return `https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl.value)}&embedded=true`;
});

// Función para manejar la carga del archivo PDF
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    trip.value.pdf_file = target.files[0];
    pdfFileName.value = target.files[0].name;
    
    // Crear una URL temporal para vista previa del archivo recién seleccionado
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(target.files[0]);
  }
};

// Fecha actual en formato YYYY-MM-DD para los inputs de tipo date
const today = ref(new Date().toISOString().split('T')[0]);

// Cargar los tour templates para el select
const tourTemplates = ref<TourTemplatePayload[]>([]);
const tourTemplateOptions = computed(() =>
  tourTemplates.value.map(template => ({
    id: template.id,
    name: template.name
  }))
);

onMounted(async () => {
  // Cargar tour templates
  tourTemplates.value = await fetchTourTemplates();
  // Cargar los datos del viaje a editar
  const tripId = Number(route.params.id);
  if (tripId) {
    isEditing.value = true;
    await loadTrip(tripId);
    
    // Si el viaje tiene un archivo PDF, mostrar su nombre
    if (trip.value.pdf_file && trip.value.pdf_file instanceof File) {
      pdfFileName.value = trip.value.pdf_file.name;
      previewUrl.value = URL.createObjectURL(trip.value.pdf_file);
    } else if (trip.value.pdf_url) {
      // Si hay una URL del PDF, extraer el nombre del archivo
      pdfFileName.value = trip.value.pdf_url.split('/').pop() || 'archivo_pdf.pdf';
      previewUrl.value = trip.value.pdf_url;
    } else if (trip.value.programa) {
      // Si tiene un programa guardado, intentar obtener la URL
      try {
        const response = await getProgramaFileUrl(tripId);
        previewUrl.value = response.file_url;
        pdfFileName.value = response.file_name || 'programa.pdf';
      } catch (error) {
        console.error('Error al cargar la vista previa del PDF:', error);
      }
    }
  }
});

// Liberar las URLs de objeto al desmontar el componente
onBeforeUnmount(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

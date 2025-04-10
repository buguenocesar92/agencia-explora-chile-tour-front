<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <!-- Si es una imagen mostrarla directamente -->
      <v-img
        v-if="isImageUrl"
        :src="imageUrl"
        alt="Imagen del comprobante"
        max-height="800"
        contain
      ></v-img>
      
      <!-- Si es un PDF, mostrar iframe o enlace -->
      <div v-else-if="isPdfUrl" class="pa-4">
        <p class="text-center mb-4">Documento PDF</p>
        <div class="d-flex justify-center">
          <v-btn
            color="primary"
            :href="imageUrl"
            target="_blank"
          >
            Ver documento completo
          </v-btn>
        </div>
        
        <!-- Iframe para mostrar el PDF, solo funciona si el servidor permite embedding -->
        <iframe
          :src="imageUrl"
          width="100%"
          height="500px"
          class="mt-4"
          style="border: 1px solid #ddd;"
        ></iframe>
      </div>
      
      <!-- Si no es ninguno de los anteriores -->
      <div v-else class="pa-4 text-center">
        <p>No se puede previsualizar este tipo de archivo</p>
        <v-btn
          color="primary"
          :href="imageUrl"
          target="_blank"
          class="mt-2"
        >
          Descargar archivo
        </v-btn>
      </div>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

// Determinar si la URL es una imagen o un PDF
const isImageUrl = computed(() => {
  const url = props.imageUrl.toLowerCase();
  return url.endsWith('.jpg') || url.endsWith('.jpeg') || 
         url.endsWith('.png') || url.endsWith('.bmp') || 
         url.endsWith('.gif');
});

const isPdfUrl = computed(() => {
  return props.imageUrl.toLowerCase().endsWith('.pdf');
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script> 
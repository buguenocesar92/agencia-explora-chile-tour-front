<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-img
        :src="imageUrl"
        alt="Imagen del comprobante"
        max-height="800"
        contain
      ></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script> 
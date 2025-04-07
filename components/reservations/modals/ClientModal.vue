<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="600px">
    <v-card>
      <v-card-title>Detalles del Cliente</v-card-title>
      <v-card-text v-if="client && client.name">
        <div><strong>Nombre:</strong> {{ client.name }}</div>
        <div v-if="client.email"><strong>Email:</strong> {{ client.email }}</div>
        <div v-if="client.rut"><strong>RUT:</strong> {{ client.rut }}</div>
        <div v-if="client.date_of_birth"><strong>Fecha de Nacimiento:</strong> {{ client.date_of_birth }}</div>
        <div v-if="client.nationality"><strong>Nacionalidad:</strong> {{ client.nationality }}</div>
        <div v-if="client.phone"><strong>Teléfono:</strong> {{ client.phone }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Define client interface
interface Client {
  id?: number;
  name?: string;
  email?: string;
  rut?: string;
  date_of_birth?: string | null;
  nationality?: string | null;
  phone?: string | null;
}

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  client: {
    type: Object as () => Client,
    required: true,
    default: () => ({})
  }
});

// Define emits with proper type definition
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script> 
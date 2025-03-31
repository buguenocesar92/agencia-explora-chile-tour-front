<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">1. Ingreso de Datos Personales</h2>
    <v-form ref="form" @submit.prevent>
      <div class="space-y-4">
        <FormInput
          id="name"
          label="Nombre Completo"
          v-model="client.name"
          :error="errors.name ? errors.name[0] : ''"
          placeholder="Ingresa tu nombre completo"
        />
        <FormInput
          id="rut"
          label="Rut"
          v-model="client.rut"
          :error="errors.rut ? errors.rut[0] : ''"
          placeholder="Ingresa tu rut"
        />
        <FormInput
          id="date_of_birth"
          label="Fecha de nacimiento"
          type="date"
          v-model="client.date_of_birth"
          :error="errors.date_of_birth ? errors.date_of_birth[0] : ''"
          required
        />
        <FormInput
          id="nationality"
          label="Nacionalidad"
          v-model="client.nationality"
          :error="errors.nationality ? errors.nationality[0] : ''"
          placeholder="Ingresa tu nacionalidad"
        />
        <FormInput
          id="email"
          label="Correo Electrónico"
          type="email"
          v-model="client.email"
          :error="errors.email ? errors.email[0] : ''"
          placeholder="Ingresa tu correo"
          required
        />
        <FormInput
          id="phone"
          label="Teléfono"
          type="tel"
          v-model="client.phone"
          :error="errors.phone ? errors.phone[0] : ''"
          placeholder="Ingresa tu teléfono"
        />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClientForm } from '@/composables/useClientForm';
import FormInput from '@/components/FormInput.vue';

const { client, isLoading, errors, validateClient } = useClientForm();
const form = ref(null);

// Método de validación que será llamado desde el componente padre
const validate = async () => {
  // Validar usando el composable
  const isValid = await validateClient();
  console.log('Validación de datos personales:', isValid);
  return isValid;
};

// Exponer el método validate para que el componente padre pueda acceder
defineExpose({
  validate
});
</script>
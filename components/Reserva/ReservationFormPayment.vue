<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">3. Proceso de Pago</h2>
    <v-form ref="form" @submit.prevent>
      <div class="space-y-4">
        <FormInput
          id="receipt"
          label="Comprobante de Pago"
          type="file"
          v-model="payment.receipt"
          :error="errors.receipt ? errors.receipt[0] : ''"
          required
          @change="handleFileChange"
        />
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormInput from "@/components/FormInput.vue";
import { usePaymentForm } from '@/composables/usePaymentForm';

const { payment, errors, handleSubmit, handleFileChange, validatePayment } = usePaymentForm();
const form = ref(null);

// Método de validación que será llamado desde el componente padre
const validate = async () => {
  // Validar usando el composable
  const isValid = await validatePayment();
  console.log('Validación de pago:', isValid);
  return isValid;
};

// Exponer los métodos para que el componente padre pueda acceder
defineExpose({
  validate,
  handleSubmit
});
</script>
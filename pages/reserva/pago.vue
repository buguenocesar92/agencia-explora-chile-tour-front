<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
    <div class="container mx-auto p-6 max-w-md mt-20">
      <h2 class="text-2xl font-bold mb-6">3. Proceso de Pago</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Monto de Pago -->
        <div class="mb-4">
          <label for="amount" class="block text-gray-700 mb-2">Monto de Pago</label>
          <input
            id="amount"
            v-model.number="payment.amount"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.amount }"
          />
          <p v-if="errors.amount" class="text-red-500 text-sm mt-1">{{ errors.amount[0] }}</p>
        </div>

        <!-- Número de Transacción -->
        <div class="mb-4">
          <label for="transaction_id" class="block text-gray-700 mb-2">Número de Transacción</label>
          <input
            id="transaction_id"
            v-model="payment.transaction_id"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.transaction_id }"
          />
          <p v-if="errors.transaction_id" class="text-red-500 text-sm mt-1">{{ errors.transaction_id[0] }}</p>
        </div>

        <!-- Comprobante de Pago -->
        <div class="mb-4">
          <label for="receipt" class="block text-gray-700 mb-2">Comprobante de Pago</label>
          <input
            id="receipt"
            type="file"
            @change="handleFileChange"
            class="w-full"
            accept="image/*"
          />
          <p v-if="errors.receipt" class="text-red-500 text-sm mt-1">{{ errors.receipt[0] }}</p>
        </div>
        
        <!-- Botón de Atrás -->
        <button
          type="button"
          @click="$router.back()"
          class="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Atrás
        </button>

        <!-- Botón de Enviar -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Procesando...' : 'Enviar Pago' }}
        </button>
      </form>
    </div>
    <FooterComponent class="mt-14" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { usePaymentForm } from '@/composables/usePaymentForm';

const { payment, isLoading, errors, handleSubmit, handleFileChange } = usePaymentForm();
</script>

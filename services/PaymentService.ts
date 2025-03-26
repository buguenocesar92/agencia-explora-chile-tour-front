import { useNuxtApp } from '#app';
import type { PaymentPayload } from '@/types/PaymentType';

export async function createPayment(data: PaymentPayload): Promise<PaymentPayload> {
  const { $axios } = useNuxtApp();

  // Construir FormData para manejar la subida del archivo
  const formData = new FormData();
  formData.append('amount', data.amount.toString());
  formData.append('payment_date', data.payment_date);
  formData.append('transaction_id', data.transaction_id);
  if (data.receipt) {
    formData.append('receipt', data.receipt);
  }

  const response = await $axios.post('/payment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

import { ref, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { PaymentPayload } from '@/types/PaymentType';
import type { ReservationPayload } from '@/types/ReservationType';
import { finalizeReservation } from '@/services/reservationService';

export function usePaymentForm() {
  // Inicializamos el objeto payment. Nota: El archivo (receipt) se mantiene en memoria.
  const payment = ref<PaymentPayload>({
    amount: 0,
    payment_date: '', // Se asigna en backend
    transaction_id: '',
    receipt: null
  });

  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  // Al montar, carga la data de pago (excepto el archivo, ya que éste no se puede guardar en localStorage)
  onMounted(() => {
    const savedData = localStorage.getItem('paymentData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      payment.value.amount = parsed.amount;
      payment.value.transaction_id = parsed.transaction_id;
    }
  });

  async function handleSubmit() {
    isLoading.value = true;
    errors.value = {};
    try {
      // Guarda los campos de pago (sin el file) en localStorage para persistir los datos de texto
      const paymentDataToSave = {
        amount: payment.value.amount,
        transaction_id: payment.value.transaction_id
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentDataToSave));

      // Recupera los datos de cliente y viaje guardados en localStorage
      const clientDataStr = localStorage.getItem('clientData');
      const tripDataStr = localStorage.getItem('tripData');

      if (!clientDataStr || !tripDataStr) {
        throw new Error("Faltan datos en el proceso de reserva.");
      }

      const clientData = JSON.parse(clientDataStr);
      const tripData = JSON.parse(tripDataStr);

      // Creamos un objeto FormData para enviar tanto los datos como el archivo
      const formData = new FormData();

      // Agregamos los datos de cliente
      for (const key in clientData) {
        formData.append(`client[${key}]`, clientData[key]);
      }
      // Agregamos los datos de viaje
      for (const key in tripData) {
        formData.append(`trip[${key}]`, tripData[key]);
      }
      // Agregamos los datos de pago
      formData.append('payment[amount]', payment.value.amount.toString());
      formData.append('payment[transaction_id]', payment.value.transaction_id);
      if (payment.value.receipt) {
        formData.append('payment[receipt]', payment.value.receipt);
      }

      // Enviamos toda la data al backend utilizando la función finalizeReservation
      await finalizeReservation(formData);
      showSuccessNotification('Éxito', 'Reserva completada correctamente');
      // Limpiar localStorage o redirigir al usuario según corresponda
      localStorage.clear();
    } catch (error: any) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al completar la reserva', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      payment.value.receipt = target.files[0];
    }
  }

  return { payment, isLoading, errors, handleSubmit, handleFileChange };
}

// composables/useReservationForm.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchReservation, createReservation, updateReservation } from '@/services/ReservationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ReservationPayload } from '@/types/ReservationTypes';

export function useReservationForm() {
  // Inicializamos la reserva con datos vacíos (ajusta los campos según necesites)
  const reservation = ref<ReservationPayload>({
    id: 0,
    client: { id: 0, name: '', email: '', rut: '', date_of_birth: '', nationality: '', phone: '' },
    trip: { id: 0, destination: '', departure_date: '', return_date: '', service_type: '' },
    payment: { id: 0, amount: 0, payment_date: '', transaction_id: '', receipt: null, receipt_url: '' },
    status: 'not paid',
    date: '',
    description: ''
  });
  const isEditing = ref(false);
  const isLoading = ref(false);
  const errors = ref<{ [key: string]: string[] }>({});
  const router = useRouter();

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  async function loadReservation(id: number) {
    isLoading.value = true;
    try {
      const fetchedReservation = await fetchReservation(id);
      reservation.value = fetchedReservation;
      isEditing.value = true;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al cargar la reserva', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSubmit() {
    isLoading.value = true;
    errors.value = {};
    try {
      if (isEditing.value) {
        // En el caso de edición, si tu endpoint espera JSON, podrías cambiarlo, o igualmente convertir a FormData.
        // Aquí asumimos que updateReservation acepta el objeto directamente.
        await updateReservation(reservation.value.id, reservation.value);
        showSuccessNotification('Éxito', 'Reserva actualizada correctamente');
      } else {
        // Convertimos el objeto a FormData para crear la reserva.
        const formData = toFormData(reservation.value);
        await createReservation(formData);
        showSuccessNotification('Éxito', 'Reserva creada correctamente');
      }
      router.push('/reservas');
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error al guardar la reserva', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  function toFormData(data: ReservationPayload): FormData {
    const formData = new FormData();
    // Cliente
    formData.append('client[id]', data.client.id.toString());
    formData.append('client[name]', data.client.name);
    formData.append('client[email]', data.client.email);
    formData.append('client[rut]', data.client.rut);
    formData.append('client[date_of_birth]', data.client.date_of_birth);
    formData.append('client[nationality]', data.client.nationality);
    formData.append('client[phone]', data.client.phone);
    // Viaje
    formData.append('trip[id]', data.trip.id.toString());
    formData.append('trip[destination]', data.trip.destination);
    formData.append('trip[departure_date]', data.trip.departure_date);
    formData.append('trip[return_date]', data.trip.return_date);
    formData.append('trip[service_type]', data.trip.service_type);
    // Pago (opcional, según convenga)
    formData.append('payment[id]', data.payment.id.toString());
    formData.append('payment[amount]', data.payment.amount.toString());
    formData.append('payment[payment_date]', data.payment.payment_date);
    formData.append('payment[transaction_id]', data.payment.transaction_id);
    // Si existe un archivo, se puede agregar, aunque probablemente en el flujo de reserva no se envíe archivo
    if (data.payment.receipt) {
      formData.append('payment[receipt]', data.payment.receipt);
    }
    // Otros campos
    formData.append('status', data.status);
    formData.append('date', data.date);
    formData.append('description', data.description);
    return formData;
  }
  
  return { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation };
}

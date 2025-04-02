// composables/Reservation/useReservationForm.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchReservation, createReservation, updateReservation } from '@/services/ReservationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { ReservationPayload } from '@/types/ReservationTypes';

export function useReservationForm() {
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
        const formData = toFormData(reservation.value);
        formData.append('_method', 'PUT');
        await updateReservation(reservation.value.id, formData);
        showSuccessNotification('Éxito', 'Reserva actualizada correctamente');
      } else {
        const formData = toFormData(reservation.value);
        await createReservation(formData);
        showSuccessNotification('Éxito', 'Reserva creada correctamente');
      }
      router.push('/reservas');
    } catch (error) {
      
      handleValidationError(error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.errors) {
        if ((error as any).response?.data?.errors) {
          errors.value = (error as any).response.data.errors;
        }
      }
      if (errorMessage.value) {
        showErrorNotification('Error al guardar la reserva', errorMessage.value);
      }
    } finally {
      isLoading.value = false;
    }
  }

  function toFormData(data: ReservationPayload): FormData {
    const formData = new FormData();
    formData.append('client[id]', data.client?.id?.toString() || '0');
    formData.append('client[name]', data.client?.name || '');
    formData.append('client[email]', data.client?.email || '');
    formData.append('client[rut]', data.client?.rut || '');
    formData.append('client[date_of_birth]', data.client?.date_of_birth || '');
    formData.append('client[nationality]', data.client?.nationality || '');
    formData.append('client[phone]', data.client?.phone || '');
    formData.append('trip[id]', data.trip?.id?.toString() || '0');
    formData.append('trip[destination]', data.trip?.destination || '');
    formData.append('trip[departure_date]', data.trip?.departure_date || '');
    formData.append('trip[return_date]', data.trip?.return_date || '');
    formData.append('trip[service_type]', data.trip?.service_type || '');
    formData.append('payment[id]', data.payment?.id?.toString() || '0');
    formData.append('payment[amount]', data.payment?.amount?.toString() || '0');
    formData.append('payment[payment_date]', data.payment?.payment_date || '');
    formData.append('payment[transaction_id]', data.payment?.transaction_id || '');
    if (data.payment?.receipt && data.payment.receipt instanceof File) {
      formData.append('payment[receipt]', data.payment.receipt);
    }
    formData.append('status', data.status || '');
    formData.append('date', data.date || '');
    formData.append('description', data.description || '');
    return formData;
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      reservation.value.payment.receipt = target.files[0];
    }
  }
  
  return { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation, handleFileChange };
}

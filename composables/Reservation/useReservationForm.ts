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
        await updateReservation(reservation.value.id, reservation.value);
        showSuccessNotification('Éxito', 'Reserva actualizada correctamente');
      } else {
        await createReservation(reservation.value);
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

  return { reservation, isEditing, isLoading, errors, handleSubmit, loadReservation };
}

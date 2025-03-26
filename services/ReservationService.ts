import { useNuxtApp } from '#app';

export async function finalizeReservation(formData: FormData): Promise<any> {
  const { $axios } = useNuxtApp();
  const response = await $axios.post('/reservations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

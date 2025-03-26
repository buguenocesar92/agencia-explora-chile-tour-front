// src/composables/useReservationNotifications.ts
import { ref, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import { useAuthStore } from '@/stores/authStore';

export function useReservationNotifications() {
  const { $socket } = useNuxtApp();
  const authStore = useAuthStore();

  const joinedChannel = ref<string>('');
  const toasts = ref<Array<{
    title: string;
    image: string;
    reservationName: string;
    reservationMessage: string;
    reservationTime: string;
  }>>([]);

  // Función para unirse al canal de reservaciones usando el ID del usuario
  const joinChannel = (userId: number) => {
    const channel = `laravel_database_private-reservations.${userId}`;
    // Solo unirse si no se ha unido ya a ese canal
    if (joinedChannel.value === channel) {
      return;
    }
    joinedChannel.value = channel;
    $socket.emit("join-private-channel", { channel });
    console.log("Intentando unirse al canal:", channel);
  };

  onMounted(() => {
    // Si el ID ya está disponible, únase de inmediato
    if (authStore.userId) {
      joinChannel(authStore.userId);
    }
    // Observa cambios en el ID del usuario y valida que se una solo si el canal cambia
    watch(
      () => authStore.userId,
      (newId) => {
        if (newId) {
          const expectedChannel = `laravel_database_private-reservations.${newId}`;
          if (joinedChannel.value !== expectedChannel) {
            joinChannel(newId);
          }
        }
      }
    );

    $socket.on("joined-channel", (data: { channel: string }) => {
      joinedChannel.value = data.channel;
      console.log("Unido al canal:", data.channel);
    });

    $socket.on("private-message", (data: any) => {
      console.log("Notificación de reserva recibida:", data);
      let reservation;
      // Validar si la reserva viene en data.data.reservation o data.reservation
      if (data && data.data && data.data.reservation) {
        reservation = data.data.reservation;
      } else if (data && data.reservation) {
        reservation = data.reservation;
      }
      if (reservation) {
        const newToast = {
          title: "Nueva Reserva",
          image: reservation.image || 'https://via.placeholder.com/150',
          reservationName: reservation.name || 'Sin nombre',
          reservationMessage: reservation.message || 'Sin mensaje',
          reservationTime: `${reservation.date || ''} - ${reservation.time || ''}`
        };
        toasts.value.push(newToast);
        // Eliminar automáticamente el toast después de 5 segundos
        setTimeout(() => {
          const index = toasts.value.indexOf(newToast);
          if (index !== -1) {
            toasts.value.splice(index, 1);
          }
        }, 5000);
      } else {
        console.warn("Estructura de datos inesperada:", data);
      }
    });

    $socket.on("error", (err: string) => {
      console.error("Error:", err);
    });
  });

  function removeToast(index: number) {
    toasts.value.splice(index, 1);
  }

  return { joinedChannel, toasts, removeToast };
}

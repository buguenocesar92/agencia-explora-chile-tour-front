import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'
import { watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()

  // Comprobamos si estamos en producción y si existe la URL del servidor socket
  const socketUrl = runtimeConfig.public.SOCKET_SERVER
  
  // Si no hay URL de socket configurada, proporcionamos un socket mock
  if (!socketUrl || socketUrl === 'false' || socketUrl === 'disabled') {
    console.log('Socket.IO está desactivado: no se ha configurado NUXT_PUBLIC_SOCKET_SERVER')
    
    // Proporcionar un objeto socket mock para evitar errores
    const mockSocket = {
      on: () => {},
      emit: () => {},
      connect: () => {},
      disconnect: () => {},
      auth: {},
      connected: false
    } as unknown as Socket;
    
    return {
      provide: { socket: mockSocket }
    }
  }

  try {
    console.log('Intentando conectar a Socket.IO en:', socketUrl);
    
    // Inicializar el socket con manejo de errores
    const socket: Socket = io(socketUrl, {
      path: '/ws',
      transports: ['websocket'],
      auth: {
        token: authStore.accessToken || ''
      },
      reconnectionAttempts: 3, // Limitar intentos de reconexión
      timeout: 5000 // Timeout más corto para conexiones
    });

    // Manejar eventos de conexión
    socket.on('connect', () => {
      console.log('Conexión Socket.IO establecida con éxito');
    });

    socket.on('connect_error', (error) => {
      console.warn('Error de conexión Socket.IO:', error.message);
    });

    // Observa cambios en el token del store para reconectar el socket
    watch(
      () => authStore.accessToken,
      (newToken) => {
        (socket.auth as any).token = newToken || ''
        socket.disconnect()
        socket.connect()
      }
    )

    return {
      provide: { socket }
    }
  } catch (error) {
    console.error('Error al inicializar Socket.IO:', error);
    
    // Proporcionar un socket mock en caso de error
    const mockSocket = {
      on: () => {},
      emit: () => {},
      connect: () => {},
      disconnect: () => {},
      auth: {},
      connected: false
    } as unknown as Socket;
    
    return {
      provide: { socket: mockSocket }
    }
  }
})

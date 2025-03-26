import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'
import { watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()

  // Usamos la URL definida en el .env: "https://ws.cbm3lla.me"
  const socketUrl = runtimeConfig.public.SOCKET_SERVER

  const socket: Socket = io(socketUrl, {
    path: '/ws',
    transports: ['websocket'],
    auth: {
      token: authStore.accessToken || ''
    }
  })

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
})

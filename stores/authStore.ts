// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { useCookie } from '#app'
import { loginUser, logoutUser, fetchUserData, registerUser } from '@/services/AuthService'
import type { AuthPayload, RegisterUser } from '@/types/AuthTypes'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
    roles: [] as string[],
    permissions: [] as string[],
    name: '',
    email: '',
    userId: null as number | null,
  }),

  getters: {
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission),
    hasRole: (state) => (role: string) => state.roles.includes(role),
  },

  actions: {
    /**
     * Lee los tokens desde las cookies y actualiza el estado de autenticación.
     */
    checkAuth() {
      const accessTokenCookie = useCookie('access_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 días
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      const refreshTokenCookie = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      this.accessToken = accessTokenCookie.value || ''
      this.refreshToken = refreshTokenCookie.value || ''
      this.isAuthenticated = Boolean(this.accessToken && this.refreshToken)
    },

    /**
     * Inicia sesión, guarda los tokens en cookies y actualiza el estado del usuario.
     */
    async login(payload: AuthPayload) {
      try {
        const { access_token, refresh_token } = await loginUser(payload)
        const accessTokenCookie = useCookie('access_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        const refreshTokenCookie = useCookie('refresh_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        // Guarda los tokens en las cookies
        accessTokenCookie.value = access_token
        refreshTokenCookie.value = refresh_token

        // Actualiza el estado del store
        this.accessToken = access_token
        this.refreshToken = refresh_token
        this.isAuthenticated = true

        // Obtiene la información adicional del usuario
        await this.fetchUserData()
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    /**
     * Cierra sesión, elimina los tokens de las cookies y resetea el estado del usuario.
     */
    async logout() {
      try {
        await logoutUser()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        const accessTokenCookie = useCookie('access_token')
        const refreshTokenCookie = useCookie('refresh_token')
        accessTokenCookie.value = null
        refreshTokenCookie.value = null

        this.accessToken = ''
        this.refreshToken = ''
        this.roles = []
        this.permissions = []
        this.name = ''
        this.email = ''
        this.isAuthenticated = false
        this.userId = null
      }
    },

    /**
     * Obtiene los datos del usuario (nombre, email, roles y permisos) y actualiza el estado.
     */
    async fetchUserData() {
      try {
        const { id, name, email, roles, permissions } = await fetchUserData()
        this.userId = id
        this.name = name
        this.email = email
        this.roles = roles
        this.permissions = permissions
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },

    /**
     * Registra un nuevo usuario, guarda los tokens en cookies y actualiza el estado del usuario.
     */
    async register(payload: RegisterUser) {
      try {
        const { access_token, refresh_token } = await registerUser(payload)
        const accessTokenCookie = useCookie('access_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        const refreshTokenCookie = useCookie('refresh_token', {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        accessTokenCookie.value = access_token
        refreshTokenCookie.value = refresh_token

        this.accessToken = access_token
        this.refreshToken = refresh_token
        this.isAuthenticated = true

        await this.fetchUserData()
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },
  },
})

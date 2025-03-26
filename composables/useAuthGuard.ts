// src/composables/useAuthGuard.ts
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

export function useAuthGuard() {
  const authStore = useAuthStore();
  const { isAuthenticated, accessToken, refreshToken, roles, permissions } = storeToRefs(authStore);

  /**
   * Actualiza el estado de autenticación leyendo los tokens desde las cookies.
   */
  async function checkAuth() {
    await authStore.checkAuth();
  }

  /**
   * Carga los datos del usuario si aún no se han obtenido.
   */
  async function fetchUserDataIfNeeded() {
    if (!roles.value.length || !permissions.value.length) {
      await authStore.fetchUserData();
    }
  }

  /**
   * Verifica si el usuario posee al menos uno de los roles requeridos.
   */
  function hasAnyRole(requiredRoles: string[]): boolean {
    return requiredRoles.some((role) => authStore.hasRole(role));
  }

  /**
   * Verifica si el usuario posee todos los permisos requeridos.
   */
  function hasAllPermissions(requiredPermissions: string[]): boolean {
    return requiredPermissions.every((perm) => authStore.hasPermission(perm));
  }

  /**
   * Ejecuta el logout.
   */
  async function doLogout() {
    await authStore.logout();
  }

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    roles,
    permissions,
    checkAuth,
    fetchUserDataIfNeeded,
    hasAnyRole,
    hasAllPermissions,
    doLogout,
  };
}

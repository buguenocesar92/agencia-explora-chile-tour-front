// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { 
    isAuthenticated, 
    checkAuth, 
    fetchUserDataIfNeeded, 
    hasAnyRole, 
    hasAllPermissions, 
    doLogout 
  } = useAuthGuard();

  try {
    // Actualizamos la autenticación usando cookies (disponible en SSR)
    await checkAuth();

    // Si la ruta es para invitados y el usuario está autenticado, redirigimos inmediatamente
    if (to.meta.requiresGuest && isAuthenticated.value) {
      return navigateTo('/dashboard');
    }

    // Si la ruta requiere autenticación y el usuario NO está autenticado, redirigimos inmediatamente
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return navigateTo('/login');
    }

    // Si el usuario está autenticado, se carga la información de usuario en segundo plano
    if (isAuthenticated.value) {
      //fijarse en esto que cuando esta autenticado se carga la informacion del usuario
      fetchUserDataIfNeeded();
    }

    // Validación de roles (si se definieron en meta)
    if (to.meta.roles && !hasAnyRole(to.meta.roles as string[])) {
      return navigateTo('/403');
    }

    // Validación de permisos (si se definieron en meta)
    if (to.meta.permissions && !hasAllPermissions(to.meta.permissions as string[])) {
      return navigateTo('/403');
    }
  } catch (error) {
    console.error('Error en la navegación:', error);
    await doLogout();
    return navigateTo('/login');
  }
});

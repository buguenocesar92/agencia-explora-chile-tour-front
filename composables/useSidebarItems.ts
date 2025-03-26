import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { SidebarItem } from '@/types/SidebarItemTypes';

export function useSidebarItems() {
  const authStore = useAuthStore();
  const router = useRouter();

  const isAuthenticated = computed(() => authStore.isAuthenticated);

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => authStore.roles.includes(role));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => authStore.permissions.includes(permission));
  };

  const displayedSidebarItems = computed<SidebarItem[]>(() => {
    return router.getRoutes()
      .filter((route: RouteRecordRaw) => {
        if (!route.meta?.sidebar) return false;

        if (route.meta.requiresAuth && !isAuthenticated.value) return false;

        if (route.meta.roles && !hasAnyRole(route.meta.roles as string[])) return false;

        if (route.meta.permissions && !hasAllPermissions(route.meta.permissions as string[])) return false;

        return true;
      })
      .map((route: RouteRecordRaw) => ({
        label: (route.meta?.label as string) || '',
        route: route.path,
        icon: (route.meta?.icon as string) || '',
      }));
  });

  return {
    isAuthenticated,
    displayedSidebarItems,
  };
}

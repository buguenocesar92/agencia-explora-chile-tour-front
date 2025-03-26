<template>
  <nav
    :class="[
      'top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg',
      bgColor
    ]"
  >
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
        <router-link
          class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
          to="/"
        >
          Home
        </router-link>

        <!-- Mostrar Login y Registro solo si el usuario NO está autenticado -->
        <template v-if="!authStore.isAuthenticated">
          <router-link
            class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            to="/login"
          >
            Login
          </router-link>
          <router-link
            class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            to="/register"
          >
            Registro
          </router-link>
        </template>

        <!-- Mostrar Dashboard si el usuario está autenticado -->
        <template v-else>
          <router-link
            class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            to="/dashboard"
          >
            Dashboard
          </router-link>
        </template>

        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          @click="setNavbarOpen"
        >
          <i class="text-white fas fa-bars"></i>
        </button>
      </div>
      <!-- Aquí puedes agregar otros elementos, como dropdowns, si lo deseas -->
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// Definición del prop para el background color
const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-transparent'
  }
})

// Usamos el store de autenticación
const authStore = useAuthStore()

// Estado para el menú responsive
const navbarOpen = ref(false)
function setNavbarOpen() {
  navbarOpen.value = !navbarOpen.value
}
</script>

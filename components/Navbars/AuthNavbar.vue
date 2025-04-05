<template>
  <nav
    :class="[
      'top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-4 py-4 navbar-expand-lg transition-all duration-300',
      bgColor,
      scrolled ? 'bg-opacity-95 shadow-md backdrop-blur-sm' : ''
    ]"
  >
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
        <router-link
          class="text-white text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap flex items-center"
          to="/"
        >
          <v-icon color="white" class="mr-2">mdi-airplane-marker</v-icon>
          Viajes Increíbles
        </router-link>

        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          @click="setNavbarOpen"
        >
          <v-icon color="white">{{ navbarOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </button>
      </div>
      
      <div 
        :class="['lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none rounded-lg shadow-lg', 
                navbarOpen ? 'block' : 'hidden']"
        id="example-navbar-warning"
      >
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <!-- Mostrar Login y Registro solo si el usuario NO está autenticado -->
          <template v-if="!authStore.isAuthenticated">
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/destinos"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-map-marker</v-icon>
                Destinos
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/ofertas"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-tag-multiple</v-icon>
                Ofertas
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/contacto"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-email-outline</v-icon>
                Contacto
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/login"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-login</v-icon>
                Iniciar Sesión
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                to="/register"
                class="bg-white text-teal-600 hover:bg-teal-50 active:bg-teal-100 text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
              >
                <v-icon class="mr-1">mdi-account-plus</v-icon>
                Registrarse
              </router-link>
            </li>
          </template>

          <!-- Mostrar Dashboard si el usuario está autenticado -->
          <template v-else>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/mis-viajes"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-briefcase</v-icon>
                Mis Viajes
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/favoritos"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-heart</v-icon>
                Favoritos
              </router-link>
            </li>
            <li class="flex items-center">
              <router-link
                class="lg:text-white lg:hover:text-teal-200 text-teal-800 px-3 py-4 lg:py-2 flex items-center text-base font-medium transition-colors"
                to="/dashboard"
              >
                <v-icon class="lg:text-white text-teal-600 mr-1">mdi-view-dashboard</v-icon>
                Mi Cuenta
              </router-link>
            </li>
            <li class="flex items-center">
              <button
                @click="logout"
                class="bg-white text-teal-600 hover:bg-teal-50 active:bg-teal-100 text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
              >
                <v-icon class="mr-1">mdi-logout</v-icon>
                Cerrar Sesión
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

// Función para cerrar sesión
function logout() {
  authStore.logout()
  // Redirigir a la página de inicio después de cerrar sesión
  router.push('/')
}

// Detectar scroll para cambiar el estilo del navbar
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
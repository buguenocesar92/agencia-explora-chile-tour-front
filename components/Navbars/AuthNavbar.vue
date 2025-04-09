<template>
  <nav
    :class="[
      'top-0 fixed z-50 w-full transition-all duration-300',
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    ]"
  >
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link
          class="font-bold text-2xl flex items-center"
          :class="scrolled ? 'text-slate-800' : 'text-white'"
          to="/"
        >
          <span class="relative">
            <span class="inline-block transform transition-transform duration-300 hover:scale-105">Explora Chile</span>
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </span>
        </router-link>

        <!-- Mobile menu toggle -->
        <button
          class="lg:hidden rounded-full p-2 hover:bg-white/10 transition-colors duration-300"
          :class="scrolled ? 'text-slate-800' : 'text-white'"
          @click="setNavbarOpen"
        >
          <v-icon>{{ navbarOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </button>

        <!-- Navigation Menu -->
        <div
          class="hidden lg:flex items-center space-x-2"
        >
          <template v-if="!authStore.isAuthenticated">
            <router-link
              v-for="(item, index) in navItems" 
              :key="index"
              :to="item.path"
              :class="[
                'relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 overflow-hidden group',
                scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white/90 hover:text-white'
              ]"
            >
              <span class="relative z-10 flex items-center">
                <v-icon size="small" class="mr-1">{{ item.icon }}</v-icon>
                {{ item.name }}
              </span>
              <span 
                class="absolute bottom-0 left-0 w-full h-0 bg-white/10 transition-all duration-300 group-hover:h-full"
                :class="scrolled ? 'group-hover:bg-slate-100' : 'group-hover:bg-white/10'"
              ></span>
            </router-link>

            <!-- Auth buttons -->
            <div class="flex space-x-2 ml-4 items-center">
              <router-link
                to="/login"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border"
                :class="scrolled ? 'text-slate-700 border-slate-300 hover:bg-slate-100' : 'text-white border-white/30 hover:bg-white/10'"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
              >
                Registrarse
              </router-link>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/dashboard"
              :class="[
                'relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 overflow-hidden group',
                scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white/90 hover:text-white'
              ]"
            >
              <span class="relative z-10 flex items-center">
                <v-icon size="small" class="mr-1">mdi-view-dashboard</v-icon>
                Mi Cuenta
              </span>
              <span 
                class="absolute bottom-0 left-0 w-full h-0 bg-white/10 transition-all duration-300 group-hover:h-full"
                :class="scrolled ? 'group-hover:bg-slate-100' : 'group-hover:bg-white/10'"
              ></span>
            </router-link>
            
            <button
              @click="logout"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ml-2"
              :class="scrolled ? 'text-slate-700 border-slate-300 hover:bg-slate-100' : 'text-white border-white/30 hover:bg-white/10'"
            >
              <span class="flex items-center">
                <v-icon size="small" class="mr-1">mdi-logout</v-icon>
                Cerrar Sesión
              </span>
            </button>
          </template>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div 
        v-if="navbarOpen"
        class="lg:hidden mt-4 rounded-lg overflow-hidden transition-all duration-300"
        :class="scrolled ? 'bg-white shadow-lg' : 'bg-black/80 backdrop-blur-md'"
      >
        <div class="px-4 py-2 space-y-2">
          <template v-if="!authStore.isAuthenticated">
            <router-link
              v-for="(item, index) in navItems" 
              :key="index"
              :to="item.path"
              class="block px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
              :class="scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'"
              @click="navbarOpen = false"
            >
              <v-icon size="small" class="mr-2">{{ item.icon }}</v-icon>
              {{ item.name }}
            </router-link>
            
            <div class="grid grid-cols-2 gap-2 pt-2 pb-2">
              <router-link
                to="/login"
                class="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border text-center"
                :class="scrolled ? 'text-slate-700 border-slate-300 hover:bg-slate-100' : 'text-white border-white/30 hover:bg-white/10'"
                @click="navbarOpen = false"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/register"
                class="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 text-center"
                @click="navbarOpen = false"
              >
                Registrarse
              </router-link>
            </div>
          </template>
          
          <template v-else>
            <router-link
              to="/dashboard"
              class="block px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
              :class="scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'"
              @click="navbarOpen = false"
            >
              <v-icon size="small" class="mr-2">mdi-view-dashboard</v-icon>
              Mi Cuenta
            </router-link>
            
            <button
              @click="() => { logout(); navbarOpen = false; }"
              class="w-full block px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
              :class="scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'"
            >
              <v-icon size="small" class="mr-2">mdi-logout</v-icon>
              Cerrar Sesión
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// Prop para el background color (ya no lo usamos directamente)
const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-transparent'
  }
})

// Usamos el router
const router = useRouter()

// Usamos el store de autenticación
const authStore = useAuthStore()

// Items de navegación
const navItems = [
  { name: 'Destinos', path: '/destinos', icon: 'mdi-map-marker' },
  { name: 'Ofertas', path: '/ofertas', icon: 'mdi-tag-multiple' },
  { name: 'Contacto', path: '/contacto', icon: 'mdi-email-outline' }
]

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
  scrolled.value = window.scrollY > 30
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Comprobar el estado inicial
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Animated underline effect */
.router-link-active:not(.bg-blue-600) .relative::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(1);
  transform-origin: left;
  transition: transform 0.3s ease;
}
</style>
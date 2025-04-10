<template>
  <div class="min-h-screen flex flex-col">
    <Navbar bgColor="bg-gradient-to-r from-blue-600 to-blue-800" v-if="false" />
    
    <div class="flex-grow">
      <!-- Call to Action modernizado - Diseño tipo popup -->
      <section class="relative overflow-hidden min-h-screen flex items-center justify-center">
        <!-- Imagen de fondo (bg.webp) -->
        <div class="absolute inset-0 bg-cover bg-center" 
             style="background-image: url('/bg.webp'); filter: brightness(0.8);">
        </div>
        
        <!-- Overlay azul con gradiente -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-80"></div>
        
        <div class="relative z-10 w-full max-w-md mx-auto px-6">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <img src="/logo.png" alt="Explora Chiletour" class="h-24 mb-2" />
          </div>
          
          <!-- Formulario de inicio de sesión -->
          <div class="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
            <div class="p-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
              
              <form @submit.prevent="handleLogin" class="space-y-6">
                <!-- Correo Electrónico -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input 
                    id="email"
                    v-model="form.email"
                    type="email" 
                    required
                    placeholder="Ejemplo: correo@dominio.com"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <p v-if="errors.email?.[0]" class="mt-1 text-sm text-red-600">
                    {{ errors.email[0] }}
                  </p>
                </div>
                
                <!-- Contraseña -->
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input 
                    id="password"
                    v-model="form.password"
                    type="password" 
                    required
                    placeholder="Introduce tu contraseña"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <p v-if="errors.password?.[0]" class="mt-1 text-sm text-red-600">
                    {{ errors.password[0] }}
                  </p>
                </div>
                
                <!-- Enlaces de ayuda -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input id="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                      Recordarme
                    </label>
                  </div>
                  
                  <div class="text-sm">
                    <a href="#" class="font-medium text-blue-600 hover:text-blue-700">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                
                <!-- Botón de inicio de sesión -->
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
                
                <!-- Mensaje de error -->
                <div v-if="errorMessage" class="p-4 bg-red-50 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>
              </form>
              
              <!-- Registro -->
              <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                  ¿No tienes una cuenta?
                  <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-700">
                    Regístrate ahora
                  </router-link>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Botones de redes sociales -->
          <div class="mt-8 flex justify-center space-x-4">
            <a href="https://facebook.com/ExploraChiletour" target="_blank" class="text-white hover:text-blue-200 transition-colors">
              <v-icon size="24">mdi-facebook</v-icon>
            </a>
            <a href="https://instagram.com/explora_chiletour" target="_blank" class="text-white hover:text-blue-200 transition-colors">
              <v-icon size="24">mdi-instagram</v-icon>
            </a>
            <a href="https://api.whatsapp.com/message/PTODH3ELVDXNN1?autoload=1&app_absent=0" target="_blank" class="text-white hover:text-green-200 transition-colors">
              <v-icon size="24">mdi-whatsapp</v-icon>
            </a>
          </div>
        </div>
      </section>
    </div>
    
    <FooterComponent class="w-full" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { useLoginForm } from '@/composables/useLoginForm';

// Configuración de meta para usar el middleware 'guest'
// Esto evita que un usuario autenticado acceda a esta página.
definePageMeta({
  requiresGuest: true,
  sidebar: false,
  label: 'Iniciar Sesión',
  icon: 'mdi-login'
});

const { form, isLoading, errors, errorMessage, handleLogin } = useLoginForm();
</script>
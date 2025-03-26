<template>
  <div class="min-h-screen flex flex-col">
    <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
    
    <div class="flex-grow bg-gray-50 dark:bg-gray-900">
      <!-- Hero section con gradiente -->
      <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div class="container mx-auto px-4 relative z-20 text-center">
          <h1 class="text-4xl font-bold text-white mb-4">Inicia Sesión en tu Cuenta</h1>
          <p class="text-white text-lg mb-8 max-w-2xl mx-auto">
            Ingresa tus credenciales para acceder a tu panel de control.
          </p>
        </div>
        
        <!-- Wave decoration -->
        <div class="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
            <path fill="#f9fafb" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" class="dark:fill-gray-900"></path>
          </svg>
        </div>
      </div>
      
      <!-- Contenido principal -->
      <div class="container mx-auto px-4 py-8 -mt-20 relative z-30">
        <div class="max-w-md mx-auto">
          <!-- Formulario de inicio de sesión -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
              <form @submit.prevent="handleLogin" class="space-y-6">
                <!-- Correo Electrónico -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input 
                    id="email"
                    v-model="form.email"
                    type="email" 
                    required
                    placeholder="Ejemplo: correo@dominio.com"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                  <p v-if="errors.email?.[0]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors.email[0] }}
                  </p>
                </div>
                
                <!-- Contraseña -->
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña
                  </label>
                  <input 
                    id="password"
                    v-model="form.password"
                    type="password" 
                    required
                    placeholder="Introduce tu contraseña"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                  <p v-if="errors.password?.[0]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors.password[0] }}
                  </p>
                </div>
                
                <!-- Enlaces de ayuda -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input id="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Recordarme
                    </label>
                  </div>
                  
                  <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                
                <!-- Botón de inicio de sesión -->
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
                
                <!-- Mensaje de error -->
                <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700 dark:text-red-200">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>
              </form>
              
              <!-- Registro -->
              <div class="mt-6 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?
                  <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Regístrate ahora
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Información adicional -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">¿Necesitas ayuda?</h2>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Si tienes problemas para iniciar sesión, contacta a soporte.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Asegúrate de usar el correo electrónico con el que te registraste.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <FooterComponent class="mt-auto" />
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
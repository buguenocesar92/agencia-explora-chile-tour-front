<template>
  <div class="min-h-screen flex flex-col">
    <Navbar bgColor="bg-gradient-to-r from-sky-600 to-teal-500" />
    
    <div class="flex-grow bg-gray-50 dark:bg-gray-900">
      <!-- Hero section con gradiente -->
      <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div class="container mx-auto px-4 relative z-20 text-center">
          <h1 class="text-4xl font-bold text-white mb-4">Únete a nuestra plataforma</h1>
          <p class="text-white text-lg mb-8 max-w-2xl mx-auto">
            Crea tu cuenta y comienza a disfrutar de nuestros servicios
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
        <div class="max-w-2xl mx-auto">
          <!-- Formulario de registro -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
              <form @submit.prevent="handleRegister" class="space-y-6">
                <!-- Información personal -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información personal</h2>
                  <div class="space-y-4">
                    <!-- Nombre completo -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre completo
                      </label>
                      <input 
                        id="name"
                        v-model="form.name"
                        type="text" 
                        required
                        placeholder="Ejemplo: Juan Pérez"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                      <p v-if="errors.name?.[0]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                        {{ errors.name[0] }}
                      </p>
                    </div>
                    
                    <!-- Correo electrónico -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correo electrónico
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
                  </div>
                </div>
                
                <!-- Seguridad -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Seguridad</h2>
                  <div class="space-y-4">
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
                        placeholder="Mínimo 8 caracteres"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                      <p v-if="errors.password?.[0]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                        {{ errors.password[0] }}
                      </p>
                    </div>
                    
                    <!-- Confirmar contraseña -->
                    <div>
                      <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar contraseña
                      </label>
                      <input 
                        id="passwordConfirmation"
                        v-model="passwordConfirmation"
                        type="password" 
                        required
                        placeholder="Repite tu contraseña"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                </div>
                
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
                
                <!-- Botones de acción -->
                <div class="pt-4">
                  <button 
                    type="submit" 
                    :disabled="isLoading"
                    class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isLoading ? "Registrando..." : "Crear Cuenta" }}
                  </button>
                  
                  <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      ¿Ya tienes cuenta?
                      <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Inicia Sesión
                      </router-link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Información adicional -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Beneficios de registrarte</h2>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Acceso a todos nuestros servicios profesionales.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Reserva citas de forma rápida y sencilla.</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recibe notificaciones y recordatorios de tus citas.</span>
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
import { useRegisterForm } from "@/composables/useRegisterForm";

// Configuración de meta para el middleware guest
definePageMeta({
  requiresGuest: true,
  sidebar: false,
  label: 'Registro',
  icon: 'mdi-account-plus'
});

// Extraemos la lógica del formulario desde el composable
const { form, passwordConfirmation, isLoading, errors, errorMessage, handleRegister } = useRegisterForm();
</script>
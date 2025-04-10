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
        
        <div class="relative z-10 w-full max-w-2xl mx-auto px-6 py-10">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <router-link to="/">
              <img src="/logo.png" alt="Explora Chiletour" class="h-24 mb-2" />
            </router-link>
          </div>
          
          <!-- Formulario de registro -->
          <div class="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
            <div class="p-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Crear una cuenta</h2>
              
              <form @submit.prevent="handleRegister" class="space-y-6">
                <!-- Información personal -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-700 mb-4">Información personal</h3>
                  <div class="space-y-4">
                    <!-- Nombre completo -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input 
                        id="name"
                        v-model="form.name"
                        type="text" 
                        required
                        placeholder="Ejemplo: Juan Pérez"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                      <p v-if="errors.name?.[0]" class="mt-1 text-sm text-red-600">
                        {{ errors.name[0] }}
                      </p>
                    </div>
                    
                    <!-- Correo electrónico -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
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
                  </div>
                </div>
                
                <!-- Seguridad -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-700 mb-4">Seguridad</h3>
                  <div class="space-y-4">
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
                        placeholder="Mínimo 8 caracteres"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                      <p v-if="errors.password?.[0]" class="mt-1 text-sm text-red-600">
                        {{ errors.password[0] }}
                      </p>
                    </div>
                    
                    <!-- Confirmar contraseña -->
                    <div>
                      <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                      </label>
                      <input 
                        id="passwordConfirmation"
                        v-model="passwordConfirmation"
                        type="password" 
                        required
                        placeholder="Repite tu contraseña"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                </div>
                
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
                
                <!-- Botones de acción -->
                <div class="pt-4">
                  <button 
                    type="submit" 
                    :disabled="isLoading"
                    class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {{ isLoading ? "Registrando..." : "Crear Cuenta" }}
                  </button>
                  
                  <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                      ¿Ya tienes cuenta?
                      <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-700">
                        Inicia Sesión
                      </router-link>
                    </p>
                  </div>
                </div>
              </form>
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
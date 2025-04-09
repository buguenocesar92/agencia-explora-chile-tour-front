<template>
  <footer class="bg-gray-900 text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Columna 1: Información de la empresa -->
        <div>
          <h3 class="text-xl font-bold mb-4">Explora Chile</h3>
          <p class="text-gray-400 mb-4">Ofrecemos las mejores experiencias de viaje a través de los paisajes más impresionantes de Chile.</p>
          <div class="flex space-x-4 mt-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <v-icon>mdi-facebook</v-icon>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <v-icon>mdi-twitter</v-icon>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <v-icon>mdi-instagram</v-icon>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <v-icon>mdi-youtube</v-icon>
            </a>
          </div>
        </div>
        
        <!-- Columna 2: Destinos -->
        <div>
          <h3 class="text-xl font-bold mb-4">Destinos</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Torres del Paine</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Isla de Pascua</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Desierto de Atacama</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Valparaíso</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Chiloé</a>
            </li>
          </ul>
        </div>
        
        <!-- Columna 3: Enlaces útiles -->
        <div>
          <h3 class="text-xl font-bold mb-4">Enlaces útiles</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Sobre nosotros</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Servicios</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Blog de viajes</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Preguntas frecuentes</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Contacto</a>
            </li>
          </ul>
        </div>
        
        <!-- Columna 4: Contacto -->
        <div>
          <h3 class="text-xl font-bold mb-4">Contacto</h3>
          <ul class="space-y-2">
            <li class="flex items-start">
              <v-icon class="mr-2 mt-1 text-gray-400">mdi-map-marker</v-icon>
              <span class="text-gray-400">Av. Providencia 1234, Santiago, Chile</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-gray-400">mdi-phone</v-icon>
              <span class="text-gray-400">+56 2 2345 6789</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-gray-400">mdi-email</v-icon>
              <span class="text-gray-400">info@explorachile.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-500">© {{ date }} Explora Chile. Todos los derechos reservados.</p>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">Política de privacidad</a>
          <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">Términos y condiciones</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date().getFullYear());
</script>
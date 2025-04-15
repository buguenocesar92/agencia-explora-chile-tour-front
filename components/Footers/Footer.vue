<template>
  <footer class="bg-gradient-to-r from-blue-900 to-blue-800 text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Columna 1: Información de la empresa -->
        <div>
          <h3 class="mb-4">
            <router-link to="/">
              <img src="/logo.jpg" alt="Explora Chiletour" class="h-16 mb-2" />
            </router-link>
          </h3>
          <div class="bg-blue-700/50 inline-block px-3 py-1 rounded-lg text-white text-sm font-medium mb-4">
            registrados en Sernatur N°36719
          </div>
          <p class="text-gray-200 mb-4">Explora Chiletour especializada en viajes grupales por Chile y el mundo. Ofrecemos experiencias inolvidables y giras de estudios personalizadas.</p>
          <div class="flex space-x-4 mt-4">
            <a href="https://facebook.com/ExploraChiletour" target="_blank" class="text-gray-300 hover:text-white transition-colors">
              <v-icon>mdi-facebook</v-icon>
            </a>
            <a href="https://instagram.com/explora_chiletour" target="_blank" class="text-gray-300 hover:text-white transition-colors">
              <v-icon>mdi-instagram</v-icon>
            </a>
            <a href="https://api.whatsapp.com/message/PTODH3ELVDXNN1?autoload=1&app_absent=0" target="_blank" class="text-gray-300 hover:text-green-400 transition-colors">
              <v-icon>mdi-whatsapp</v-icon>
            </a>
          </div>
        </div>
        
        <!-- Columna 2: Nuestros Servicios -->
        <div>
          <h3 class="text-xl font-bold mb-4">Nuestros Servicios</h3>
          <ul class="space-y-3">
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-map-marker-radius</v-icon>
              <span class="text-gray-200">Viajes grupales por Chile</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-airplane</v-icon>
              <span class="text-gray-200">Destinos internacionales</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-school</v-icon>
              <span class="text-gray-200">Giras de estudios</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-ferry</v-icon>
              <span class="text-gray-200">Cruceros</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-bag-suitcase</v-icon>
              <span class="text-gray-200">Paquetes turísticos</span>
            </li>
          </ul>
        </div>
        
        <!-- Columna 3: Destinos populares -->
        <div>
          <h3 class="text-xl font-bold mb-4">Destinos Populares</h3>
          <ul class="space-y-3">
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-flag</v-icon>
              <span class="text-gray-200">Chile</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-flag</v-icon>
              <span class="text-gray-200">Argentina</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-flag</v-icon>
              <span class="text-gray-200">Brasil</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-flag</v-icon>
              <span class="text-gray-200">Isla de Pascua</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300" size="small">mdi-flag</v-icon>
              <span class="text-gray-200">Torres del Paine</span>
            </li>
          </ul>
        </div>
        
        <!-- Columna 4: Contacto -->
        <div>
          <h3 class="text-xl font-bold mb-4">Contacto</h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <v-icon class="mr-2 mt-1 text-blue-300">mdi-map-marker</v-icon>
              <span class="text-gray-200">Unión Obrera 592, Oficina 3, Rancagua, O'Higgins, Chile</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300">mdi-phone</v-icon>
              <span class="text-gray-200">+56 9 6216 3788</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300">mdi-email</v-icon>
              <span class="text-gray-200">Viajesexploratour@gmail.com</span>
            </li>
            <li class="flex items-center">
              <v-icon class="mr-2 text-blue-300">mdi-instagram</v-icon>
              <span class="text-gray-200">@explora_chiletour</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-blue-700/50 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-300">© {{ date }} Explora Chiletour. Todos los derechos reservados.</p>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 items-center">
          <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">Política de privacidad</a>
          <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">Términos y condiciones</a>
          <div class="text-sm text-blue-300 font-medium">#Tumejorviaje</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date().getFullYear());
</script>
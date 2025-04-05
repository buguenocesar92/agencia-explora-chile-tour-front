<template>
  <footer class="relative bg-gradient-to-b from-teal-900 to-gray-900 pt-12 pb-6">
    <div
      class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
      style="transform: translateZ(0);"
    >
      <svg
        class="absolute bottom-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        version="1.1"
        viewBox="0 0 2560 100"
        x="0"
        y="0"
      >
        <polygon
          class="text-teal-900 fill-current"
          points="2560 0 2560 100 0 100"
        ></polygon>
      </svg>
    </div>
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap text-center lg:text-left">
        <div class="w-full lg:w-6/12 px-4">
          <div class="flex items-center justify-center lg:justify-start mb-6">
            <v-icon color="teal-lighten-3" size="x-large" class="mr-3">mdi-airplane-marker</v-icon>
            <h3 class="text-2xl font-bold text-white">Viajes Increíbles</h3>
          </div>
          <h4 class="text-3xl font-semibold text-white">¡Mantengámonos en contacto!</h4>
          <h5 class="text-lg mt-2 mb-4 text-teal-100">
            Síguenos en nuestras redes sociales para descubrir ofertas exclusivas y destinos de ensueño.
          </h5>
          <div class="mt-6 lg:mb-0 mb-6 flex flex-wrap justify-center lg:justify-start">
            <button
              class="bg-white text-teal-400 shadow-lg font-normal h-12 w-12 flex items-center justify-center rounded-full outline-none focus:outline-none mr-3 mb-3 hover:bg-teal-50 transition-colors"
              type="button"
            >
              <v-icon>mdi-twitter</v-icon>
            </button>
            <button
              class="bg-white text-blue-600 shadow-lg font-normal h-12 w-12 flex items-center justify-center rounded-full outline-none focus:outline-none mr-3 mb-3 hover:bg-teal-50 transition-colors"
              type="button"
            >
              <v-icon>mdi-facebook</v-icon>
            </button>
            <button
              class="bg-white text-pink-500 shadow-lg font-normal h-12 w-12 flex items-center justify-center rounded-full outline-none focus:outline-none mr-3 mb-3 hover:bg-teal-50 transition-colors"
              type="button"
            >
              <v-icon>mdi-instagram</v-icon>
            </button>
            <button
              class="bg-white text-red-600 shadow-lg font-normal h-12 w-12 flex items-center justify-center rounded-full outline-none focus:outline-none mr-3 mb-3 hover:bg-teal-50 transition-colors"
              type="button"
            >
              <v-icon>mdi-youtube</v-icon>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="flex flex-wrap items-top mb-6">
            <div class="w-full lg:w-4/12 px-4 ml-auto mt-8 lg:mt-0">
              <span
                class="block uppercase text-teal-200 text-sm font-semibold mb-3"
              >
                Destinos Populares
              </span>
              <ul class="list-unstyled">
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Caribe
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Europa
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Asia
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Sudamérica
                  </a>
                </li>
              </ul>
            </div>
            <div class="w-full lg:w-4/12 px-4 mt-8 lg:mt-0">
              <span
                class="block uppercase text-teal-200 text-sm font-semibold mb-3"
              >
                Información Útil
              </span>
              <ul class="list-unstyled">
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Blog de Viajes
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    class="text-teal-100 hover:text-white font-medium block pb-2 text-sm"
                    href="#"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-6 border-teal-800" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4 mx-auto text-center">
          <div class="text-sm text-teal-200 font-medium py-1">
            Copyright © {{ date }} Viajes Increíbles - Todos los derechos reservados
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date().getFullYear());
</script>
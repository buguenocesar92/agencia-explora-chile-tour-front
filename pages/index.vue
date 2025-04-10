<template>
  <div>
    <Navbar bgColor="bg-gradient-to-r from-[#7ac142] to-[#1e73be]" v-if="false" />
    
    <!-- Modal de Reserva -->
    <ReservationModal v-model="showReservationModal" @start-reservation="goToWizard" />
    
    <!-- Call to Action modernizado - Diseño tipo popup -->
    <section class="relative min-h-screen flex items-center justify-center py-10 sm:py-0">
      <!-- Imagen de fondo (bg.webp) -->
      <div class="absolute inset-0 bg-cover bg-center" 
           style="background-image: url('/bg.webp'); filter: brightness(0.8);">
      </div>
      
      <!-- Overlay azul con gradiente -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-80"></div>
      
      <div class="relative z-10 max-w-xl w-full px-4 sm:px-6 mx-auto text-center mt-8 mb-10 sm:mb-0">
        <div class="flex justify-center mb-4">
          <div class="bg-white/90 text-blue-600 rounded-lg px-4 py-2 text-sm font-bold inline-flex items-center">
            <span class="mr-2">✓</span> Registrados en Sernatur
          </div>
        </div>
        <div class="flex justify-center mb-6">
          <router-link to="/">
            <img src="/logo.png" alt="Explora Chiletour" class="h-24 sm:h-32 md:h-44 mb-2" />
          </router-link>
        </div>
        <h3 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white/90">Tu mejor viaje comienza aquí</h3>
        <p class="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">Viajes grupales por Chile y el mundo 🌎 • Giras de estudios • Experiencias inolvidables</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white">
            <span class="text-xl sm:text-2xl mb-1 sm:mb-2 block">🧭</span>
            <span class="font-medium text-sm sm:text-base">Viajes grupales</span>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white">
            <span class="text-xl sm:text-2xl mb-1 sm:mb-2 block">✈️</span>
            <span class="font-medium text-sm sm:text-base">Destinos internacionales</span>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white">
            <span class="text-xl sm:text-2xl mb-1 sm:mb-2 block">🎓</span>
            <span class="font-medium text-sm sm:text-base">Giras de estudios</span>
          </div>
        </div>
        
        <div class="flex justify-center">
          <button 
            @click="goToWizard()" 
            class="px-6 py-3 sm:px-10 sm:py-5 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg">
            Reservar ahora
          </button>
        </div>
        
        <div class="mt-6 sm:mt-8 flex justify-center space-x-4 pb-4">
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

    <!-- Galería de destinos modernizada -->
<!--     <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-gray-800">Descubre Chile</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Explora los destinos más increíbles de Chile a través de nuestra galería de imágenes de lugares impresionantes</p>
        </div>

        <div class="relative overflow-hidden rounded-2xl shadow-2xl h-[600px]">

          <div class="absolute bottom-6 left-0 right-0 z-10 flex justify-center space-x-2">
            <button 
              v-for="(image, i) in galleryImages" 
              :key="i" 
              @click="currentSlide = i"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                currentSlide === i ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              ]"
            ></button>
          </div>
          

          <div 
            v-for="(image, i) in galleryImages" 
            :key="i"
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            :class="{ 'opacity-100': currentSlide === i, 'opacity-0': currentSlide !== i }"
          >
            <img 
              :src="image.src" 
              :alt="image.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-10 text-white">
              <h3 class="text-3xl font-bold mb-3">{{ image.title }}</h3>
              <p class="text-white/90 text-lg max-w-2xl">{{ image.description }}</p>
            </div>
          </div>

          <button 
            class="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
            @click="prevSlide"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </button>
          <button 
            class="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
            @click="nextSlide"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </div>
      </div>
    </section> -->

    <!-- Servicios modernizados -->
<!--     <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-gray-800">Nuestros Servicios</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Ofrecemos experiencias únicas adaptadas a cada tipo de viajero, con atención personalizada y los mejores guías locales</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div class="h-56 overflow-hidden relative">
              <img src="https://picsum.photos/id/10/800/600" alt="Tours Guiados" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
              <div class="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Más popular</div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800 flex items-center">
                <v-icon color="blue-600" class="mr-2">mdi-map-marker-path</v-icon>
                Tours Guiados
              </h3>
              <p class="text-gray-600 mb-4">Exploración con expertos que te mostrarán los secretos y la historia detrás de cada lugar emblemático de Chile.</p>
              <router-link to="/servicios/tours" class="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-300">
                Descubrir más
                <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
              </router-link>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div class="h-56 overflow-hidden relative">
              <img src="https://picsum.photos/id/26/800/600" alt="Experiencias Personalizadas" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800 flex items-center">
                <v-icon color="blue-600" class="mr-2">mdi-star-circle</v-icon>
                Experiencias Personalizadas
              </h3>
              <p class="text-gray-600 mb-4">Itinerarios adaptados a tus intereses, tiempo y presupuesto para que vivas Chile a tu manera.</p>
              <router-link to="/servicios/experiencias" class="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-300">
                Descubrir más
                <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
              </router-link>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div class="h-56 overflow-hidden relative">
              <img src="https://picsum.photos/id/28/800/600" alt="Aventuras Extremas" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800 flex items-center">
                <v-icon color="blue-600" class="mr-2">mdi-hiking</v-icon>
                Aventuras Extremas
              </h3>
              <p class="text-gray-600 mb-4">Adrenalina pura en los escenarios naturales más impresionantes del país, con todas las medidas de seguridad.</p>
              <router-link to="/servicios/aventuras" class="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-300">
                Descubrir más
                <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Testimonios modernizados -->
<!--     <section class="py-20 bg-blue-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-gray-800">Lo Que Dicen Nuestros Viajeros</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Descubre por qué cientos de viajeros eligen nuestros servicios para explorar Chile</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 text-xl flex -ml-1">★★★★★</div>
            </div>
            <p class="text-gray-700 mb-6 italic">"Nuestro viaje a Torres del Paine fue simplemente perfecto. Gracias a Explora Chile, pudimos disfrutar de cada momento sin preocupaciones. Los guías eran excepcionales."</p>
            <div class="flex items-center">
              <img src="https://randomuser.me/api/portraits/women/62.jpg" alt="Cliente" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="text-gray-800 font-bold">María González</h4>
                <p class="text-gray-500 text-sm">Madrid, España</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-lg md:transform md:translate-y-6">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 text-xl flex -ml-1">★★★★★</div>
            </div>
            <p class="text-gray-700 mb-6 italic">"El desierto de Atacama me dejó sin palabras. La planificación del viaje fue perfecta y el conocimiento de los guías fue impresionante. ¡100% recomendado!"</p>
            <div class="flex items-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cliente" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="text-gray-800 font-bold">Carlos Rodríguez</h4>
                <p class="text-gray-500 text-sm">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 text-xl flex -ml-1">★★★★★</div>
            </div>
            <p class="text-gray-700 mb-6 italic">"Mi familia y yo disfrutamos enormemente de nuestro tour por la Isla de Pascua. Todo estuvo meticulosamente organizado y la experiencia cultural fue enriquecedora."</p>
            <div class="flex items-center">
              <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Cliente" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="text-gray-800 font-bold">Ana Martínez</h4>
                <p class="text-gray-500 text-sm">México DF, México</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <FooterComponent class="w-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import ReservationModal from "@/components/ReservationModal.vue";

const router = useRouter();
const showReservationModal = ref(false);

// Imágenes del carrusel con rutas a las nuevas imágenes
const galleryImages = ref([
  { 
    src: '/img/gallery/moai-isla.jpg', 
    title: 'Isla de Pascua', 
    description: 'Descubre los enigmáticos Moai y la fascinante cultura Rapa Nui en la remota Isla de Pascua.'
  },
  { 
    src: '/img/gallery/torres-paine-new.jpg',
    title: 'Torres del Paine', 
    description: 'Explora los impresionantes paisajes del Parque Nacional Torres del Paine en la Patagonia chilena.'
  },
  { 
    src: '/img/gallery/atacama-new.jpg',
    title: 'Desierto de Atacama', 
    description: 'Recorre el desierto más árido del mundo con sus increíbles formaciones geológicas y cielos estrellados.'
  },
  { 
    src: '/img/gallery/valparaiso-new.jpg',
    title: 'Valparaíso', 
    description: 'Disfruta de los coloridos cerros de esta ciudad costera, Patrimonio de la Humanidad.'
  }
]);

// Control del carrusel modernizado
const currentSlide = ref(0);

// Funciones para controlar el carrusel
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % galleryImages.value.length;
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + galleryImages.value.length) % galleryImages.value.length;
}

// Auto-rotación del carrusel
let slideInterval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  // Iniciar auto-rotación
  startSlideShow();
});

function startSlideShow() {
  stopSlideShow(); // Asegurarse de que no hay múltiples intervalos
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Cambiar cada 5 segundos
}

function stopSlideShow() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
}

// Función para ir al wizard de reservas
function goToWizard() {
  router.push('/wizard');
}
</script>

<style scoped>
.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.reservation-card {
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  max-width: 500px;
}

.reservation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.feature-card {
  transition: all 0.4s ease;
  border-top: 4px solid #7ac142;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #7ac142, #1e73be);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.feature-card:hover::before {
  transform: translateX(0);
}

.card-header {
  position: relative;
  overflow: hidden;
}

.card-header::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(30deg);
}

.travel-experiences .v-carousel {
  box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
  border-radius: 16px;
  overflow: hidden;
}

.carousel-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
}

.content-box {
  animation: fadeIn 0.8s ease-in-out;
  max-width: 90%;
  margin: 0 auto;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.shadow-glow {
  box-shadow: 0 0 15px rgba(122, 193, 66, 0.5);
}

.icon-wrapper {
  transition: all 0.3s ease;
}

.benefit-item:hover .icon-wrapper {
  transform: scale(1.1);
}

.animate-fadeDown {
  animation: fadeDown 1s ease-out;
}

.animate-fadeUp {
  animation: fadeUp 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  position: relative;
}
</style>
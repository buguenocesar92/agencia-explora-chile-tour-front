<template>
  <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />

  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Hero section con información básica -->
    <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
      <div class="container mx-auto px-4 relative z-20">
        <div v-if="pending" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8 max-w-2xl mx-auto" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {{ error.message }}</span>
          <NuxtLink to="/" class="text-red-700 font-medium hover:underline mt-2 inline-block">
            Volver al Directorio
          </NuxtLink>
        </div>
        <div v-else-if="professional" class="text-center">
          <div class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg overflow-hidden">
            <img :src="professional.image" :alt="professional.name" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">{{ professional.name }}</h1>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-800 mb-4">
            {{ professional.specialty }}
          </div>
          <div class="flex items-center justify-center mb-6">
            <div class="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1 text-white font-medium">{{ getRandomRating() }}</span>
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="ml-1 text-white">Próxima disponibilidad: {{ getRandomAvailability() }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <p class="text-red-500 font-medium">Profesional no encontrado.</p>
          <NuxtLink to="/" class="text-indigo-600 hover:underline mt-2 inline-block">
            Volver al Directorio
          </NuxtLink>
        </div>
      </div>
      
      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
          <path fill="#f9fafb" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" class="dark:fill-gray-900"></path>
        </svg>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="professional" class="max-w-4xl mx-auto">
        <!-- Información detallada -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acerca del profesional</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {{ professional.description || getDetailedDescription(professional.specialty) }}
            </p>
            
            <!-- Especialidades y servicios -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Especialidades y servicios</h3>
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {{ professional.specialty }}
                </span>
                <span v-for="(service, index) in getRandomServices(professional.specialty)" :key="index" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ service }}
                </span>
              </div>
            </div>
            
            <!-- Información de contacto -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">Teléfono</h4>
                  <p class="text-gray-600 dark:text-gray-400">+34 {{ getRandomPhone() }}</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">Email</h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ professional.name.toLowerCase().replace(' ', '.') }}@ejemplo.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Calendario de disponibilidad -->
        <ReservarCita />
        
        <!-- Valoraciones y reseñas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Valoraciones y reseñas</h2>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {{ getRandomRating() }} / 5
              </span>
            </div>
            
            <!-- Lista de reseñas -->
            <div class="space-y-6">
              <div v-for="(review, index) in getRandomReviews()" :key="index" class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                      <img :src="`https://i.pravatar.cc/150?img=${20 + index}`" alt="Avatar" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 class="text-md font-medium text-gray-900 dark:text-white">{{ review.name }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ review.date }}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
              </div>
            </div>
            
            <!-- Ver más reseñas -->
            <div class="mt-6 text-center">
              <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Ver todas las reseñas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterComponent class="mt-14" />
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { useRoute } from 'vue-router'
import ReservarCita from '@/components/ReservarCita.vue'

interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
  description?: string;
}

const { $axios } = useNuxtApp();

// Obtenemos el parámetro de la ruta
const route = useRoute();

// Usamos useAsyncData y la instancia de axios para obtener el detalle del profesional
const { data: professional, pending, error } = await useAsyncData<Professional>('professional-detail', async () => {
  const { data } = await $axios.get(`/professionals/${route.params.id}`);
  return data;
});

// Funciones para generar datos aleatorios para la demo
function getRandomRating() {
  return (4 + Math.random()).toFixed(1);
}

function getRandomAvailability() {
  const options = ['Hoy', 'Mañana', 'En 2 días'];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomPhone() {
  return `${Math.floor(600000000 + Math.random() * 99999999)}`;
}

function getDetailedDescription(specialty: string) {
  const descriptions = {
    'Cardiología': 'Especialista en salud cardiovascular con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades del corazón. Formado en las mejores instituciones médicas y con un enfoque en la prevención y el tratamiento personalizado. Utiliza las técnicas más avanzadas para ofrecer el mejor cuidado a sus pacientes.',
    'Dermatología': 'Dermatólogo con amplia experiencia en el tratamiento de afecciones de la piel, cabello y uñas. Especializado en dermatología clínica y estética, ofrece soluciones personalizadas para cada paciente. Constantemente actualizado con las últimas técnicas y tratamientos para garantizar los mejores resultados.',
    'Psicología': 'Psicólogo clínico con enfoque en terapia cognitivo-conductual y mindfulness. Especializado en el tratamiento de ansiedad, depresión y estrés. Ofrece un espacio seguro y confidencial donde los pacientes pueden trabajar en su bienestar emocional con técnicas probadas y personalizadas.',
    'Nutrición': 'Nutricionista especializado en planes alimenticios personalizados y asesoramiento nutricional. Con experiencia en nutrición deportiva, pérdida de peso saludable y manejo de condiciones médicas a través de la alimentación. Enfoque holístico que considera el estilo de vida y las necesidades individuales de cada persona.',
    'default': 'Profesional altamente cualificado con años de experiencia en su campo. Comprometido con ofrecer el mejor servicio y atención personalizada a cada paciente. Utiliza métodos innovadores y se mantiene constantemente actualizado para garantizar los mejores resultados.'
  };
  
  return descriptions[specialty as keyof typeof descriptions] || descriptions.default;
}

function getRandomServices(specialty: string) {
  const servicesBySpecialty = {
    'Cardiología': ['Ecocardiografía', 'Prueba de esfuerzo', 'Holter', 'Prevención cardiovascular', 'Rehabilitación cardíaca'],
    'Dermatología': ['Tratamientos faciales', 'Cirugía dermatológica', 'Tratamiento de acné', 'Dermatología pediátrica', 'Tratamientos láser'],
    'Psicología': ['Terapia individual', 'Terapia de pareja', 'Mindfulness', 'Manejo del estrés', 'Coaching personal'],
    'Nutrición': ['Planes personalizados', 'Nutrición deportiva', 'Control de peso', 'Intolerancias alimentarias', 'Educación nutricional'],
    'default': ['Consulta general', 'Seguimiento', 'Asesoramiento', 'Tratamientos especializados']
  };
  
  const services = servicesBySpecialty[specialty as keyof typeof servicesBySpecialty] || servicesBySpecialty.default;
  // Devolver 3-5 servicios aleatorios
  const numServices = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...services].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numServices);
}

function getAvailableTimes() {
  const times = [];
  for (let hour = 9; hour <= 19; hour++) {
    if (Math.random() > 0.3) { // 70% de probabilidad de que la hora esté disponible
      times.push(`${hour}:00`);
    }
    if (hour < 19 && Math.random() > 0.3) {
      times.push(`${hour}:30`);
    }
  }
  return times;
}

function getRandomReviews() {
  const reviews = [
    {
      name: 'María García',
      date: '15 de marzo, 2023',
      rating: 5,
      comment: 'Excelente profesional. Me atendió con mucha amabilidad y resolvió todas mis dudas. Totalmente recomendable.'
    },
    {
      name: 'Juan Rodríguez',
      date: '2 de febrero, 2023',
      rating: 4,
      comment: 'Muy buena atención y profesionalidad. El tratamiento que me recomendó ha funcionado perfectamente.'
    },
    {
      name: 'Ana Martínez',
      date: '18 de enero, 2023',
      rating: 5,
      comment: 'Increíble experiencia. Se tomó el tiempo necesario para explicarme todo el proceso y me sentí muy cómoda durante la consulta.'
    }
  ];
  
  return reviews;
}
</script>
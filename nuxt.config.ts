// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
        API_URL: process.env.API_URL,
        SOCKET_SERVER: process.env.NUXT_PUBLIC_SOCKET_SERVER,
        SOCKET_SERVER_PORT: process.env.NUXT_PUBLIC_SOCKET_SERVER_PORT
    }
  },
  css: [
    /* 'vuetify/styles', */ // Agregar estilos de Vuetify
    '@mdi/font/css/materialdesignicons.css', // Agregar Material Design Icons
    '@fortawesome/fontawesome-free/css/all.min.css'
  ],
  build: {
    transpile: ['vuetify'], // Transpilar Vuetify para que funcione correctamente con SSR
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    }
  }
});

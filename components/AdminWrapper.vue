<template>
  <div>
    <Sidebar />
    <div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
      <!-- AdminNavbar solo visible en escritorio, oculto en móvil -->
      <div class="hidden md:block">
        <AdminNavbar />
      </div>
      <div class="px-4 md:px-10 mx-auto w-full py-4">
        <slot />
      </div>
      <FooterAdmin />
      <!-- Componente global de notificaciones en tiempo real -->
      <!-- <RealTimeNotifications /> -->
    </div>
  </div>  
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import AdminNavbar from '@/components/Navbars/AdminNavbar.vue';
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";
/* import RealTimeNotifications from '@/components/RealTimeNotifications.vue'; */
</script>

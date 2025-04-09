<template>
  <div class="relative flex items-center space-x-3">
    <!-- Información del usuario (izquierda) -->
    <div v-if="authStore.isAuthenticated" class="text-right">
      <p class="text-sm font-semibold text-gray-800">{{ authStore.name }}</p>
      <p class="text-xs text-gray-500">{{ authStore.email }}</p>
    </div>

    <!-- Icono de usuario y dropdown -->
    <a
      class="text-blueGray-500 block"
      href="#"
      ref="btnDropdownRef"
      @click="toggleDropdown($event)"
    >
      <div class="items-center flex">
        <span
          class="w-12 h-12 text-sm text-white bg-blue-600 inline-flex items-center justify-center rounded-full"
        >
          <!-- Iniciales del usuario en lugar de imagen -->
          {{ getUserInitials() }}
        </span>
      </div>
    </a>

    <!-- Menú desplegable -->
    <div
      ref="popoverDropdownRef"
      class="absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 right-0 mt-2"
      v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }"
    >
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Perfil
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Configuración
      </a>
      <div class="h-0 my-2 border border-solid border-blueGray-100" />

      <!-- Botón de Cerrar Sesión -->
      <LogoutButton />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createPopper } from "@popperjs/core";
import { useAuthStore } from "@/stores/authStore";
import LogoutButton from "@/components/LogoutButton.vue"; // Importa el botón de logout

const authStore = useAuthStore();
const dropdownPopoverShow = ref(false);
const btnDropdownRef = ref(null);
const popoverDropdownRef = ref(null);

// Función para obtener las iniciales del usuario
const getUserInitials = () => {
  if (!authStore.name) return 'U';
  
  // Dividir el nombre por espacios y obtener la primera letra de cada palabra
  const nameParts = authStore.name.split(' ');
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  
  // Si solo hay una palabra, tomar las dos primeras letras o solo la primera
  return nameParts[0].length > 1 
    ? nameParts[0].substring(0, 2).toUpperCase() 
    : nameParts[0][0].toUpperCase();
};

// Alternar dropdown
const toggleDropdown = (event) => {
  event.preventDefault();
  dropdownPopoverShow.value = !dropdownPopoverShow.value;
  if (dropdownPopoverShow.value) {
    createPopper(btnDropdownRef.value, popoverDropdownRef.value, {
      placement: "bottom-start",
    });
  }
};
</script>

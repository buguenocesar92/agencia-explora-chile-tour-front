<template>
  <AdminWrapper>
  </AdminWrapper>
</template>

<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';

definePageMeta({
    requiresAuth: true,
    sidebar: true,
    label: 'Inicio',
    icon: 'mdi-format-list-checkbox'
  });
</script>

<template>
  <AdminWrapper>
    <DashboardCalendar />
  </AdminWrapper>
</template>

<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';
import DashboardCalendar from '@/components/DashboardCalendar.vue'
definePageMeta({
    requiresAuth: true,
    sidebar: true,
    label: 'Reservas',
    icon: 'mdi-format-list-checkbox'
  });
</script>
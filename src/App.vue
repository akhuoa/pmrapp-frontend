<script setup lang="ts">
import BackToTop from '@/components/BackToTop.vue'
import NotificationBar from '@/components/molecules/NotificationBar.vue'

const showNotification = import.meta.env.VITE_SHOW_NOTIFICATION === 'true'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NotificationBar v-if="showNotification" />
    <RouterView />
    <BackToTop />
  </div>
</template>

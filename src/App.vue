<script setup lang="ts">
import BackToTop from '@/components/BackToTop.vue'
import MockDataNotification from '@/components/molecules/MockDataNotification.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <MockDataNotification />
    <RouterView />
    <BackToTop />
  </div>
</template>

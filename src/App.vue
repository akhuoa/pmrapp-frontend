<script setup lang="ts">
import BackToTop from '@/components/BackToTop.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <RouterView />
    <BackToTop />
  </div>
</template>

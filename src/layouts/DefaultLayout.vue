<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>

<template>
  <Header />
  <main class="flex-grow py-12">
    <div class="container mx-auto px-4">
      <slot />
    </div>
  </main>
  <Footer />
</template>

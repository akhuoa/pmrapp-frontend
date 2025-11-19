<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>

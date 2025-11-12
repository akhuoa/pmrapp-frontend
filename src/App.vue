<script setup lang="ts">
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Main class="flex-grow" />
    <Footer />
  </div>
</template>

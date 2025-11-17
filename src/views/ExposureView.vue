<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Exposures from '@/components/Exposures.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-6">Exposure Listing</h1>
        <p class="text-lg text-gray-600 mb-8">
          View and manage model exposures.
        </p>

        <Suspense>
          <template #default>
            <Exposures />
          </template>
          <template #fallback>
            <p class="text-gray-600">Loading exposures...</p>
          </template>
        </Suspense>
      </div>
    </main>
    <Footer />
  </div>
</template>

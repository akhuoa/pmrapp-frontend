<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h1 class="text-6xl font-bold mb-4 text-gray-800">404</h1>
          <h2 class="text-3xl font-semibold mb-4 text-gray-700">Page Not Found</h2>
          <p class="text-lg text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <RouterLink
            to="/"
            class="inline-block bg-[#cc0000] hover:bg-[#830a28] text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Go to Home
          </RouterLink>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

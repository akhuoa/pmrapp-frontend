<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const hasHistory = ref(false)

onMounted(() => {
  // Check if there's a previous page in history
  hasHistory.value = window.history.length > 2
})

const goBack = () => {
  router.back()
}
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

          <button
            v-if="hasHistory"
            @click="goBack"
            class="inline-block button-primary"
          >
            Go Back
          </button>
          <RouterLink
            v-else
            to="/"
            class="inline-block button-primary"
          >
            Go to Home
          </RouterLink>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
</style>

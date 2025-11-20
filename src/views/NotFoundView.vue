<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

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
  <DefaultLayout>
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <h2 class="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p class="text-lg mb-8">
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
  </DefaultLayout>
</template>

<style scoped>
@import '@/assets/button.css';
</style>

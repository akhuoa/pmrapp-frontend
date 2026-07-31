<script setup lang="ts">
import BackToTop from '@/components/atoms/BackToTop.vue'
import BetaRibbon from '@/components/atoms/BetaRibbon.vue'
import CookieBanner from '@/components/molecules/CookieBanner.vue'
import { useAuthStore } from '@/stores/auth'

// Initialise authentication state from local storage on client side
if (import.meta.client) {
  const authStore = useAuthStore()
  authStore.initAuth()

  // Synchronises authentication state across browser tabs
  let authStorageSyncTimeout: number | undefined

  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_token' || event.key === 'username') {
      if (authStorageSyncTimeout !== undefined) {
        clearTimeout(authStorageSyncTimeout)
      }
      authStorageSyncTimeout = window.setTimeout(() => {
        authStore.initAuth()
      }, 50)
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BackToTop />
  </div>
  <CookieBanner />
  <BetaRibbon />
</template>

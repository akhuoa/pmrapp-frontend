import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const authStore = useAuthStore()

    if (authStore.isAuthenticated) {
      return navigateTo('/profile')
    }
  }
})

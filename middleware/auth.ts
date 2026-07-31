import { useAuthStore } from '@/stores/auth'
import { isJwtExpired } from '@/utils/auth'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const authStore = useAuthStore()
    const storedToken = localStorage.getItem('auth_token')
    const authMethod = localStorage.getItem('auth_method') as 'password' | 'github' | null
    const looksLikeJwt = storedToken?.split('.').length === 3

    // Only check JWT expiry for GitHub OAuth tokens.
    if (storedToken && looksLikeJwt && authMethod === 'github' && isJwtExpired(storedToken)) {
      authStore.clearAuth()
      return navigateTo('/login')
    }

    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})

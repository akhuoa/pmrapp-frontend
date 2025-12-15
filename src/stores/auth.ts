import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const username = ref<string | null>(null)
  const isAuthenticated = ref(false)

  function setAuth(authToken: string, user: string) {
    token.value = authToken
    username.value = user
    isAuthenticated.value = true

    // TEMPORARY: Using sessionStorage for token persistence.
    // This is not the most secure approach as it's still vulnerable to XSS attacks.
    // This can be HttpOnly cookies or other secure storage mechanisms in the future.
    sessionStorage.setItem('auth_token', authToken)
    sessionStorage.setItem('username', user)
  }

  function clearAuth() {
    token.value = null
    username.value = null
    isAuthenticated.value = false

    // Clear authentication data from sessionStorage.
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('username')
  }

  function initAuth() {
    const storedToken = sessionStorage.getItem('auth_token')
    const storedUsername = sessionStorage.getItem('username')

    if (storedToken && storedUsername) {
      token.value = storedToken
      username.value = storedUsername
      isAuthenticated.value = true
    }
  }

  return {
    token,
    username,
    isAuthenticated,
    setAuth,
    clearAuth,
    initAuth,
  }
})

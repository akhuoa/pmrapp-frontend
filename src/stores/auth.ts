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

    // TEMPORARY: Using localStorage for token persistence so that the login
    // state is shared across all tabs in the same browser.
    // This is not the most secure approach as it's still vulnerable to XSS attacks.
    // This can be HttpOnly cookies or other secure storage mechanisms in the future.
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('username', user)
  }

  function clearAuth() {
    token.value = null
    username.value = null
    isAuthenticated.value = false

    // Clear authentication data from localStorage.
    localStorage.removeItem('auth_token')
    localStorage.removeItem('username')
  }

  function initAuth() {
    const storedToken = localStorage.getItem('auth_token')
    const storedUsername = localStorage.getItem('username')

    if (storedToken && storedUsername) {
      token.value = storedToken
      username.value = storedUsername
      isAuthenticated.value = true
    } else {
      token.value = null
      username.value = null
      isAuthenticated.value = false
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

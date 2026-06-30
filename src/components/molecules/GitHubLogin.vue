<script setup lang="ts">
import ActionButton from '@/components/atoms/ActionButton.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import { GITHUB_OAUTH_AUTHORIZE_URL } from '@/constants/auth'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { getGitHubOAuthParams, getGitHubRedirectUri } from '@/utils/auth'
import { onMounted } from 'vue'

const API_BASE_URL = import.meta.env.VITE_AUTH_API
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const APP_BASE_URL = import.meta.env.BASE_URL
const REDIRECT_URI = getGitHubRedirectUri(APP_BASE_URL)
const GITHUB_OAUTH_PARAMS = getGitHubOAuthParams(GITHUB_CLIENT_ID, REDIRECT_URI)

interface GitHubAuthData {
  token: string
  username: string
  name: string
  email: string
}

const authStore = useAuthStore()

const handleGitHubLoginClick = () => {
  const githubUrl = new URL(GITHUB_OAUTH_AUTHORIZE_URL)
  githubUrl.search = new URLSearchParams(GITHUB_OAUTH_PARAMS).toString()
  window.location.href = githubUrl.toString()
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    window.history.replaceState({}, document.title, window.location.pathname)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data: GitHubAuthData = await response.json()
      const { token, username } = data

      authStore.setAuth(token, username)
      router.push('/')
    } catch (err) {
      console.error('Auth failed:', err)
    }
  }
})
</script>

<template>
  <ActionButton
    type="button"
    variant="secondary"
    size="lg"
    class="w-full"
    contentSection="login_page"
    @click="handleGitHubLoginClick"
  >
    <GitHubIcon class="w-5 h-5" />
    Continue with GitHub
  </ActionButton>
</template>

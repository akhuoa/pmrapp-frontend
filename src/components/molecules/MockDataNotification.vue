<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { USE_MOCK_DATA } from '@/services'
import CloseButton from '@/components/atoms/CloseButton.vue'

const COOKIE_NAME = 'pmr_mock_notification_dismissed'
const COOKIE_DAYS = 7

const isVisible = ref(true)

const getCookie = (name: string): string | null => {
  const nameEQ = name + '='
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length)
    }
  }
  return null
}

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  document.cookie = `${name}=${value};${expires};path=/`
}

const handleClose = () => {
  isVisible.value = false
  setCookie(COOKIE_NAME, 'true', COOKIE_DAYS)
}

onMounted(() => {
  if (getCookie(COOKIE_NAME) === 'true') {
    isVisible.value = false
  }
})
</script>

<template>
  <div
    v-if="USE_MOCK_DATA && isVisible"
    class="bg-amber-100 dark:bg-amber-900/20 border-b border-amber-300 dark:border-amber-700 relative"
  >
    <div class="container mx-auto px-4 pr-10 lg:pr-4 py-2 flex items-center justify-center gap-2 text-sm text-amber-900 dark:text-amber-100">
      <span>⚠️</span>
      <span>
        The repository currently uses mock data while we are waiting for its API to become available.
      </span>
    </div>
    <CloseButton
      class="absolute top-1/2 right-4 -translate-y-1/2"
      @click="handleClose"
      aria-label="Close notification"
    />
  </div>
</template>

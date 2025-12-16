<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserIcon from '@/components/icons/UserIcon.vue'
import { getAuthService } from '@/services'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const authService = getAuthService()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  try {
    await authService.logout()
    authStore.clearAuth()
    closeDropdown()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-if="authStore.isAuthenticated" ref="dropdownRef" class="relative">
    <button
      @click="toggleDropdown"
      class="nav-link p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="User menu"
    >
      <UserIcon />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
    >
      <button
        @click="handleLogout"
        class="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Log out
      </button>
    </div>
  </div>

  <RouterLink
    v-else
    to="/login"
    class="nav-link"
  >
    Log in
  </RouterLink>
</template>

<style scoped>
.nav-link {
  @apply hover:opacity-80 transition-opacity;
}
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/atoms/ConfirmDialog.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import { getAuthService } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStateStore } from '@/stores/globalState'

const authStore = useAuthStore()
const globalStateStore = useGlobalStateStore()
const router = useRouter()
const route = useRoute()
const authService = getAuthService()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const showLogoutConfirm = ref(false)

const menuId = 'user-dropdown-menu'
const buttonLabel = computed(() =>
  authStore.username ? `${authStore.username} – user menu` : 'User menu',
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const confirmLogout = () => {
  closeDropdown()
  showLogoutConfirm.value = true
}

const handleLogout = async () => {
  showLogoutConfirm.value = false
  try {
    await authService.logout()
    authStore.clearAuth()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const cancelLogout = () => {
  showLogoutConfirm.value = false
}

const handleLoginClick = () => {
  globalStateStore.requestLoginUsernameFocus()
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const isActive = (path: string) => route.path.startsWith(path)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

watch(
  () => route.fullPath,
  () => {
    if (isOpen.value) {
      closeDropdown()
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-if="authStore.isAuthenticated" ref="dropdownRef" class="relative">
    <button
      @click="toggleDropdown"
      class="nav-link p-2 transition-colors cursor-pointer relative"
      :aria-label="buttonLabel"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
    >
      <UserIcon class="w-5 h-5" />
      <span class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2 text-xs text-gray-700 dark:text-gray-300 max-w-[4.6rem] truncate hidden sm:inline">
        {{ authStore.username }}
      </span>
      <span class="sr-only sm:hidden">
        {{ authStore.username }}
      </span>
    </button>

    <div
      v-if="isOpen"
      :id="menuId"
      role="menu"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
    >
      <ul>
        <li>
          <RouterLink
            to="/profile"
            class="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            role="menuitem"
          >
            <UserIcon class="w-4 h-4 shrink-0 mr-2" />
            Profile
          </RouterLink>
        </li>
        <li>
          <button
            @click="confirmLogout"
            class="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            role="menuitem"
          >
            <LogoutIcon class="w-4 h-4 shrink-0 mr-2" />
            Log out
          </button>
        </li>
      </ul>
    </div>
  </div>

  <RouterLink
    v-else
    to="/login"
    class="nav-link"
    :class="{ 'text-primary': isActive('/login') }"
    @click="handleLoginClick"
  >
    Log in
  </RouterLink>

  <ConfirmDialog
    :show="showLogoutConfirm"
    title="Log out"
    message="Are you sure you want to log out?"
    confirm-label="Log out"
    cancel-label="Cancel"
    @confirm="handleLogout"
    @cancel="cancelLogout"
  />
</template>

<style scoped>
.nav-link {
  @apply hover:opacity-80 transition-opacity;
}
</style>

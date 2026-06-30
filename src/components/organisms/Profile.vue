<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ActionButton from '@/components/atoms/ActionButton.vue'
import ConfirmDialog from '@/components/atoms/ConfirmDialog.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import { getAuthService } from '@/services'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const authService = getAuthService()

const showLogoutConfirm = ref(false)

/** Derive initials from username for the avatar circle */
const avatarInitials = computed(() => {
  const name = authStore.username ?? ''
  return name.slice(0, 2).toUpperCase() || '?'
})

const confirmLogout = () => {
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
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">

    <!-- Avatar & display name -->
    <div class="box flex items-center gap-5">
      <div
        class="avatar"
        aria-hidden="true"
      >
        {{ avatarInitials }}
      </div>
      <div class="min-w-0">
        <p class="text-xl font-semibold truncate text-heading">
          {{ authStore.username }}
        </p>
        <!-- Future: full name / bio can go here -->
      </div>
    </div>

    <!-- Account information -->
    <section class="box space-y-5" aria-labelledby="account-info-heading">
      <h2 id="account-info-heading" class="section-heading">Account information</h2>

      <div class="info-row">
        <span class="label-field">Username</span>
        <span class="info-value">{{ authStore.username }}</span>
      </div>

      <!-- Placeholders — will be populated when the data becomes available -->
      <div class="info-row">
        <span class="label-field">Full name</span>
        <span class="info-value text-muted-fg italic">Not available</span>
      </div>

      <div class="info-row">
        <span class="label-field">Email</span>
        <span class="info-value text-muted-fg italic">Not available</span>
      </div>
    </section>

    <!-- Account actions -->
    <section class="box" aria-labelledby="account-actions-heading">
      <h2 id="account-actions-heading" class="section-heading mb-4">Account actions</h2>
      <ActionButton
        type="button"
        variant="secondary"
        size="md"
        contentSection="profile_page"
        @click="confirmLogout"
      >
        <LogoutIcon class="w-4 h-4" />
        Log out
      </ActionButton>
    </section>

  </div>

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
@import '@/assets/label.css';
@import '@/assets/box.css';

.avatar {
  @apply flex-shrink-0 w-16 h-16 rounded-full bg-primary text-white
         flex items-center justify-center text-xl font-bold select-none;
}

.section-heading {
  @apply text-base font-semibold text-heading border-b border-gray-200 pb-3;
}

.info-row {
  @apply flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4;
}

.info-row .label-field {
  @apply sm:w-32 shrink-0;
}

.info-value {
  @apply text-foreground;
}

@media (prefers-color-scheme: dark) {
  .section-heading {
    @apply border-gray-700;
  }
}
</style>

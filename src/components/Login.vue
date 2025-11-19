<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = null

  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual login logic
    console.log('Login attempt:', { username: username.value, password: '***' })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Temporary placeholder
    error.value = 'Login functionality coming soon...'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Error message -->
      <div v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
        {{ error }}
      </div>

      <!-- Username field -->
      <div>
        <label for="username" class="label-field block mb-2">
          Username
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          required
          class="input-field w-full"
          placeholder="Enter your username"
        />
      </div>

      <!-- Password field -->
      <div>
        <label for="password" class="label-field block mb-2">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="input-field w-full"
          placeholder="Enter your password"
        />
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full button-primary"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
@import '@/assets/button.css';
@import '@/assets/label.css';
@import '@/assets/input.css';
</style>

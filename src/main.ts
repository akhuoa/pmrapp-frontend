import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createGtag } from 'vue-gtag'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const gtag = createGtag({
  tagId: GA_MEASUREMENT_ID,
  pageTracker: {
    router,
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(gtag)

// Initialise authentication state from local storage.
const authStore = useAuthStore()
authStore.initAuth()

// Sync authentication state across tabs: when another tab logs in or out,
// localStorage is updated and the storage event fires in all other tabs.
// Listening only on auth_token avoids calling initAuth() twice when both
// auth_token and username are written together during login.
// This listener lives for the entire app lifetime and does not need cleanup.
window.addEventListener('storage', (event) => {
  if (event.key === 'auth_token') {
    authStore.initAuth()
  }
})

app.mount('#app')

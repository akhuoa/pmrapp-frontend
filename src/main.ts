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
// We listen to both auth_token and username, and debounce re-initialisation
// so that when both keys are written during login, initAuth() runs only once
// after storage has settled. This listener lives for the entire app lifetime
// and does not need explicit cleanup.
let authStorageSyncTimeout: number | undefined

window.addEventListener('storage', (event) => {
  if (event.key === 'auth_token' || event.key === 'username') {
    if (authStorageSyncTimeout !== undefined) {
      clearTimeout(authStorageSyncTimeout)
    }
    authStorageSyncTimeout = window.setTimeout(() => {
      authStore.initAuth()
    }, 50)
  }
})

app.mount('#app')

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

// Sync authentication state across tabs: when another tab updates localStorage
// (e.g. logs in or logs out), re-initialise the auth state in this tab.
window.addEventListener('storage', (event) => {
  if (event.key === 'auth_token' || event.key === 'username') {
    authStore.initAuth()
  }
})

app.mount('#app')

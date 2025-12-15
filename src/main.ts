import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialise authentication state from session storage.
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')

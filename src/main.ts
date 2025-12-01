import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createGtag } from 'vue-gtag'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const gtag = createGtag({
  tagId: GA_MEASUREMENT_ID,
  pageTracker: {
    router,
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(gtag)

app.mount('#app')

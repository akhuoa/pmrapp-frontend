import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'
import ExposureView from '@/views/ExposureView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView,
    },
    {
      path: '/exposure',
      name: 'exposure',
      component: ExposureView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'
import WorkspaceDetailView from '@/views/WorkspaceDetailView.vue'
import ExposureView from '@/views/ExposureView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ExposureDetailView from '@/views/ExposureDetailView.vue'

const title = 'Physiome Model Repository'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: title },
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView,
      meta: { title: `Workspace – ${title}` },
    },
    {
      path: '/workspace/:alias',
      name: 'workspace-detail',
      component: WorkspaceDetailView,
      meta: { title: `Workspace – ${title}` },
    },
    {
      path: '/exposure',
      name: 'exposure',
      component: ExposureView,
      meta: { title: `Exposure – ${title}` },
    },
    {
      path: '/exposure/:alias',
      name: 'exposure-detail',
      component: ExposureDetailView,
      meta: { title: `Exposure – ${title}` },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: `Login – ${title}` },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: `Page Not Found – ${title}` },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import ExposureDetailView from '@/views/ExposureDetailView.vue'
import ExposureFileDetailView from '@/views/ExposureFileDetailView.vue'
import ExposureView from '@/views/ExposureView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SearchView from '@/views/SearchView.vue'
import WorkspaceDetailView from '@/views/WorkspaceDetailView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'

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
      path: '/workspaces',
      name: 'workspaces',
      component: WorkspaceView,
      meta: { title: `Workspaces – ${title}` },
    },
    {
      path: '/workspaces/:alias',
      name: 'workspace-detail',
      component: WorkspaceDetailView,
      alias: ['/workspace/:alias'],
      meta: { title: `Workspace Detail – ${title}` },
    },
    {
      path: '/workspaces/:alias/file/:commitId/:path(.+)',
      name: 'workspace-file-detail',
      component: WorkspaceDetailView,
      alias: ['/workspace/:alias/file/:commitId/:path(.+)'],
      meta: { title: `Workspace File – ${title}` },
    },
    {
      path: '/exposures',
      name: 'exposures',
      component: ExposureView,
      meta: { title: `Exposures – ${title}` },
    },
    {
      path: '/exposures/:alias',
      name: 'exposure-detail',
      component: ExposureDetailView,
      alias: ['/exposure/:alias'],
      meta: { title: `Exposure Detail – ${title}` },
    },
    {
      path: '/exposures/:alias/:file',
      name: 'exposure-file-detail',
      component: ExposureFileDetailView,
      alias: ['/exposure/:alias/:file'],
      meta: { title: `Exposure File – ${title}` },
    },
    {
      path: '/search',
      name: 'search-results',
      component: SearchView,
      meta: { title: `Search Results – ${title}` },
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

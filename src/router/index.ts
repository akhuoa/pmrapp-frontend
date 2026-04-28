import { createRouter, createWebHistory } from 'vue-router'
import ExposureDetailView from '@/views/ExposureDetailView.vue'
import ExposureView from '@/views/ExposureView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SearchView from '@/views/SearchView.vue'
import WorkspaceDetailView from '@/views/WorkspaceDetailView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'

const title = 'Physiome Model Repository'
const workspaceAliasBases = ['/workspace']
const workspaceDetailRouteSuffixes = [
  '/:alias',
  '/:alias/file',
  '/:alias/@@file',
]
const workspaceFileRouteSuffixes = [
  '/:alias/file/:commitId/:path(.+)',
  '/:alias/file/:commitId',
  '/:alias/@@file/:commitId/:path(.+)',
  '/:alias/@@file/:commitId',
]
const exposureAliasBases = ['/exposure', '/e']
const exposureFileRouteSuffixes = [
  '/:alias/:file',
  '/:alias/experiments/cell/:file',
  '/:alias/experiments/channel/:file',
  '/:alias/models/channels/:file',
  '/:alias/models/:file',
]
const exposureFileViewRouteSuffixes = [
  '/:alias/:file/:view',
  '/:alias/experiments/cell/:file/:view',
  '/:alias/experiments/channel/:file/:view',
  '/:alias/models/channels/:file/:view',
  '/:alias/models/:file/:view',
]

const createWorkspaceAliases = (...suffixes: string[]) =>
  workspaceAliasBases.flatMap((base) => suffixes.map((suffix) => `${base}${suffix}`))

const createExposureAliases = (...suffixes: string[]) =>
  exposureAliasBases.flatMap((base) => suffixes.map((suffix) => `${base}${suffix}`))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
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
      alias: [
        ...workspaceDetailRouteSuffixes.slice(1).map((suffix) => `/workspaces${suffix}`),
        ...createWorkspaceAliases(...workspaceDetailRouteSuffixes),
      ],
      meta: { title: `Workspace Detail – ${title}` },
    },
    {
      path: '/workspaces/:alias/file/:commitId/:path(.+)',
      name: 'workspace-file-detail',
      component: WorkspaceDetailView,
      alias: [
        ...workspaceFileRouteSuffixes.slice(1).map((suffix) => `/workspaces${suffix}`),
        ...createWorkspaceAliases(...workspaceFileRouteSuffixes),
      ],
      meta: { title: `Workspace File – ${title}` },
    },
    {
      path: '/exposures',
      name: 'exposures',
      component: ExposureView,
      alias: createExposureAliases(''),
      meta: { title: `Exposures – ${title}` },
    },
    {
      path: '/exposures/:alias',
      name: 'exposure-detail',
      component: ExposureDetailView,
      alias: createExposureAliases('/:alias', '/:alias/view'),
      meta: { title: `Exposure Detail – ${title}` },
    },
    {
      path: '/exposures/:alias/:file',
      name: 'exposure-file-detail',
      component: ExposureDetailView,
      alias: [
        ...exposureFileRouteSuffixes.slice(1).map((suffix) => `/exposures${suffix}`),
        ...createExposureAliases(...exposureFileRouteSuffixes),
      ],
      meta: { title: `Exposure File – ${title}` },
    },
    {
      path: '/exposures/:alias/:file/:view',
      name: 'exposure-file-detail-view',
      component: ExposureDetailView,
      alias: [
        ...exposureFileViewRouteSuffixes.slice(1).map((suffix) => `/exposures${suffix}`),
        ...createExposureAliases(...exposureFileViewRouteSuffixes),
      ],
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

import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useExposureStore } from '@/stores/exposure'
import { useWorkspaceStore } from '@/stores/workspace'
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
const workspaceDetailRouteSuffixes = ['/:alias', '/:alias/file', '/:alias/@@file']
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

const createAliases = (bases: string[], ...suffixes: string[]) =>
  bases.flatMap((base) => suffixes.map((suffix) => `${base}${suffix}`))

const createPluralRouteAliases = (pluralBase: string, aliasBases: string[], suffixes: string[]) => [
  ...suffixes.slice(1).map((suffix) => `${pluralBase}${suffix}`),
  ...createAliases(aliasBases, ...suffixes),
]

const resolveExposureTitle = async (to: RouteLocationNormalized) => {
  const alias = to.params?.alias as string | undefined
  if (!alias) {
    return
  }

  try {
    const exposureInfo = await useExposureStore().getExposureInfo(alias)
    return exposureInfo?.exposure?.description
  } catch (error) {
    console.error(`Error fetching exposure info for alias ${alias}:`, error)
  }
}

const resolveWorkspaceTitle = async (to: RouteLocationNormalized) => {
  const alias = to.params?.alias as string | undefined
  if (!alias) {
    return
  }

  try {
    const commitIdParam = to.params?.commitId
    const pathParam = to.params?.path
    const commitId = typeof commitIdParam === 'string' ? commitIdParam : ''
    const path = typeof pathParam === 'string' ? pathParam : ''
    const workspaceInfo = await useWorkspaceStore().getWorkspaceInfo(alias, commitId, path)
    return workspaceInfo?.workspace?.description
  } catch (error) {
    console.error(`Error fetching workspace info for alias ${alias}:`, error)
  }
}

const resolveRouteTitle = async (to: RouteLocationNormalized) => {
  const currentTitle = to.meta.title as string | undefined

  if (to.name?.toString().startsWith('exposure')) {
    return (await resolveExposureTitle(to)) || currentTitle
  }

  if (to.name?.toString().startsWith('workspace')) {
    return (await resolveWorkspaceTitle(to)) || currentTitle
  }

  return currentTitle
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Don't scroll when only the query changes (same route path).
    if (to.path === from.path) {
      return false
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
      alias: createPluralRouteAliases(
        '/workspaces',
        workspaceAliasBases,
        workspaceDetailRouteSuffixes,
      ),
      meta: { title: `Workspace Detail – ${title}` },
    },
    {
      path: '/workspaces/:alias/file/:commitId/:path(.+)',
      name: 'workspace-file-detail',
      component: WorkspaceDetailView,
      alias: createPluralRouteAliases(
        '/workspaces',
        workspaceAliasBases,
        workspaceFileRouteSuffixes,
      ),
      meta: { title: `Workspace File – ${title}` },
    },
    {
      path: '/exposures',
      name: 'exposures',
      component: ExposureView,
      alias: createAliases(exposureAliasBases, ''),
      meta: { title: `Exposures – ${title}` },
    },
    {
      path: '/exposures/:alias',
      name: 'exposure-detail',
      component: ExposureDetailView,
      alias: createAliases(exposureAliasBases, '/:alias', '/:alias/view'),
      meta: { title: `Exposure Detail – ${title}` },
    },
    {
      path: '/exposures/:alias/:file(.+)/:view([^./]+)',
      name: 'exposure-file-detail-view',
      component: ExposureDetailView,
      // biome-ignore format: keep the formatting for readability
      alias: createPluralRouteAliases(
        '/exposures',
        exposureAliasBases,
        exposureFileViewRouteSuffixes
      ),
      meta: { title: `Exposure File – ${title}` },
    },
    {
      path: '/exposures/:alias/:file(.+)',
      name: 'exposure-file-detail',
      component: ExposureDetailView,
      // biome-ignore format: keep the formatting for readability
      alias: createPluralRouteAliases(
        '/exposures',
        exposureAliasBases,
        exposureFileRouteSuffixes
      ),
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

router.beforeResolve(async (to) => {
  const resolvedTitle = await resolveRouteTitle(to)
  if (resolvedTitle) {
    to.meta.title = resolvedTitle
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router

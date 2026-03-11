import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import List from '@/components/molecules/List.vue'

const mockRouterReplace = vi.fn()
const mockRouteQuery = ref<Record<string, string>>({})

// Mock Vue Router.
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: mockRouteQuery.value }),
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}))

type TestItem = {
  alias: string
  entity: {
    id: number
    created_ts: number
    description: string | null
  }
}

const testItems: TestItem[] = [
  { alias: 'item-1', entity: { id: 1, created_ts: 1000, description: 'Alpha' } },
  { alias: 'item-2', entity: { id: 2, created_ts: 2000, description: 'Beta' } },
  { alias: 'item-3', entity: { id: 3, created_ts: 3000, description: 'Gamma' } },
]

const mountList = (queryOverrides: Record<string, string> = {}) => {
  mockRouteQuery.value = queryOverrides

  return mount(List, {
    props: {
      items: testItems,
      isLoading: false,
      error: null,
      errorTitle: 'Error',
      contentSection: 'Test Listing',
      emptyMessage: 'No items.',
      routeBase: '/test',
      getTitle: (item: TestItem) => item.entity.description || item.alias,
    },
    global: {
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
        ListToolbar: {
          name: 'ListToolbar',
          template: '<div />',
          props: ['filterQuery', 'sortBy', 'isLoading', 'contentSection'],
          emits: ['update:filterQuery', 'update:sortBy', 'refresh'],
        },
        ListContent: {
          template: '<div><slot name="item" /></div>',
          props: ['items', 'error', 'isLoading', 'errorTitle', 'emptyMessage'],
        },
        ListItem: {
          template: '<div>{{ title }}</div>',
          props: ['title', 'link'],
        },
      },
    },
  })
}

describe('List.vue – sort URL persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteQuery.value = {}
  })

  it('initialises sortBy to DEFAULT_SORT_OPTION when no sort query param is present', async () => {
    const wrapper = mountList()
    await flushPromises()
    await nextTick()

    const toolbar = wrapper.findComponent({ name: 'ListToolbar' })
    expect(toolbar.props('sortBy')).toBe('description-asc')
  })

  it('initialises sortBy from a valid sort query param in the URL', async () => {
    const wrapper = mountList({ sort: 'id-desc' })
    await flushPromises()
    await nextTick()

    const toolbar = wrapper.findComponent({ name: 'ListToolbar' })
    expect(toolbar.props('sortBy')).toBe('id-desc')
  })

  it('ignores an invalid sort query param and falls back to DEFAULT_SORT_OPTION', async () => {
    const wrapper = mountList({ sort: 'invalid-value' })
    await flushPromises()
    await nextTick()

    const toolbar = wrapper.findComponent({ name: 'ListToolbar' })
    expect(toolbar.props('sortBy')).toBe('description-asc')
  })

  it('initialises filterQuery from filter query param and sortBy from sort query param', async () => {
    const wrapper = mountList({ filter: 'alpha', sort: 'date-asc' })
    await flushPromises()
    await nextTick()

    const toolbar = wrapper.findComponent({ name: 'ListToolbar' })
    expect(toolbar.props('filterQuery')).toBe('alpha')
    expect(toolbar.props('sortBy')).toBe('date-asc')
  })

  it('updates the URL when sortBy changes, preserving existing filter', async () => {
    const wrapper = mountList({ filter: 'beta' })
    await flushPromises()
    await nextTick()

    mockRouterReplace.mockClear()

    // Simulate user changing the sort option via the toolbar emit.
    await wrapper.findComponent({ name: 'ListToolbar' }).vm.$emit('update:sortBy', 'id-asc')
    await nextTick()

    const lastCall = mockRouterReplace.mock.calls.at(-1)?.[0]
    expect(lastCall?.query?.filter).toBe('beta')
    expect(lastCall?.query?.sort).toBe('id-asc')
  })

  it('removes the sort query param when sortBy is reset to the default', async () => {
    const wrapper = mountList({ sort: 'id-desc' })
    await flushPromises()
    await nextTick()

    mockRouterReplace.mockClear()

    // Simulate user resetting sort back to description-asc (the default).
    await wrapper
      .findComponent({ name: 'ListToolbar' })
      .vm.$emit('update:sortBy', 'description-asc')
    await nextTick()

    const lastCall = mockRouterReplace.mock.calls.at(-1)?.[0]
    expect(lastCall?.query?.sort).toBeUndefined()
  })
})

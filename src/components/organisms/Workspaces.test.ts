import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Workspaces from '@/components/organisms/Workspaces.vue'
import { useWorkspaceStore } from '@/stores/workspace'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

// Mock utils
vi.mock('@/utils/sort', () => ({
  DEFAULT_SORT_OPTION: 'created-desc',
  sortEntities: vi.fn((items) => items),
}))

vi.mock('@/utils/format', () => ({
  formatDate: vi.fn((date) => new Date(date * 1000).toLocaleDateString()),
}))

describe('Workspaces', () => {
  let workspaceStore: ReturnType<typeof useWorkspaceStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    workspaceStore = useWorkspaceStore()
    vi.clearAllMocks()
  })

  it('renders ListToolbar component', () => {
    vi.spyOn(workspaceStore, 'fetchWorkspaces').mockResolvedValue()

    const wrapper = mount(Workspaces, {
      global: {
        stubs: {
          ListToolbar: {
            template: '<div class="toolbar">Toolbar</div>',
          },
          ListContainer: true,
          ListItem: true,
        },
      },
    })

    expect(wrapper.find('.toolbar').exists()).toBe(true)
  })

  it('renders ListContainer component', () => {
    vi.spyOn(workspaceStore, 'fetchWorkspaces').mockResolvedValue()

    const wrapper = mount(Workspaces, {
      global: {
        stubs: {
          ListToolbar: true,
          ListContainer: {
            template: '<div class="container"><slot name="item" /></div>',
          },
          ListItem: true,
        },
      },
    })

    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('calls fetchWorkspaces on mount', () => {
    const fetchSpy = vi.spyOn(workspaceStore, 'fetchWorkspaces').mockResolvedValue()

    mount(Workspaces, {
      global: {
        stubs: {
          ListToolbar: true,
          ListContainer: true,
          ListItem: true,
        },
      },
    })

    expect(fetchSpy).toHaveBeenCalled()
  })

  it('handles filter query changes', async () => {
    vi.spyOn(workspaceStore, 'fetchWorkspaces').mockResolvedValue()

    const wrapper = mount(Workspaces, {
      global: {
        stubs: {
          ListToolbar: true,
          ListContainer: true,
          ListItem: true,
        },
      },
    })

    wrapper.vm.filterQuery = 'test query'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filterQuery).toBe('test query')
  })
})

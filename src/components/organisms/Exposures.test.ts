import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Exposures from '@/components/organisms/Exposures.vue'
import { useExposureStore } from '@/stores/exposure'

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

describe('Exposures', () => {
  let exposureStore: ReturnType<typeof useExposureStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    exposureStore = useExposureStore()
    vi.clearAllMocks()
  })

  it('renders ListToolbar component', () => {
    vi.spyOn(exposureStore, 'fetchExposures').mockResolvedValue()

    const wrapper = mount(Exposures, {
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
    vi.spyOn(exposureStore, 'fetchExposures').mockResolvedValue()

    const wrapper = mount(Exposures, {
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

  it('calls fetchExposures on mount', () => {
    const fetchSpy = vi.spyOn(exposureStore, 'fetchExposures').mockResolvedValue()

    mount(Exposures, {
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
    vi.spyOn(exposureStore, 'fetchExposures').mockResolvedValue()

    const wrapper = mount(Exposures, {
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

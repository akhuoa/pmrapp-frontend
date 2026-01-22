import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ExposureFileDetail from '@/components/organisms/ExposureFileDetail.vue'
import { useExposureStore } from '@/stores/exposure'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/exposures/test/file',
  }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock composables
vi.mock('@/composables/useBackNavigation', () => ({
  useBackNavigation: vi.fn(() => ({
    goBack: vi.fn(),
  })),
}))

describe('ExposureFileDetail', () => {
  let exposureStore: ReturnType<typeof useExposureStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    exposureStore = useExposureStore()
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    vi.spyOn(exposureStore, 'getExposureFileInfo').mockImplementation(
      () => new Promise(() => {}),
    )

    const wrapper = mount(ExposureFileDetail, {
      props: {
        alias: 'test-alias',
        file: 'test.cellml',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: {
            template: '<div class="loading">Loading...</div>',
          },
          ErrorBlock: true,
          PageHeader: true,
        },
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('renders error when file fails to load', async () => {
    vi.spyOn(exposureStore, 'getExposureFileInfo').mockRejectedValue(new Error('File not found'))

    const wrapper = mount(ExposureFileDetail, {
      props: {
        alias: 'test-alias',
        file: 'test.cellml',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: true,
          ErrorBlock: {
            template: '<div class="error">{{ error }}</div>',
            props: ['title', 'error'],
          },
          PageHeader: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('renders BackButton component', () => {
    const wrapper = mount(ExposureFileDetail, {
      props: {
        alias: 'test-alias',
        file: 'test.cellml',
      },
      global: {
        stubs: {
          BackButton: {
            template: '<div class="back-button">Back</div>',
          },
          LoadingBox: true,
          ErrorBlock: true,
          PageHeader: true,
        },
      },
    })

    expect(wrapper.find('.back-button').exists()).toBe(true)
  })
})

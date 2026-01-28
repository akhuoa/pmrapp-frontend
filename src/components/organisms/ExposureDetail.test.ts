import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ExposureDetail from '@/components/organisms/ExposureDetail.vue'
import { useExposureStore } from '@/stores/exposure'
import { mockExposureInfo } from '@/mocks/exposureInfo'

// Mock Vue Router.
vi.mock('vue-router', () => ({
  useRoute: () => ({}),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock analytics.
vi.mock('@/utils/analytics', () => ({
  trackButtonClick: vi.fn(),
}))

describe('ExposureDetail', () => {
  let exposureStore: ReturnType<typeof useExposureStore>

  const mountComponent = async () => {
    vi.spyOn(exposureStore, 'getExposureInfo').mockResolvedValue(mockExposureInfo)
    vi.spyOn(exposureStore, 'getExposureSafeHTML').mockImplementation(async (_id, _fileId, _view, filename) => {
      if (filename === 'index.html') return '<h4>Model Status</h4>'
      if (filename === 'license.txt') return 'https://creativecommons.org/licenses/by/3.0/'
      return ''
    })
    vi.spyOn(exposureStore, 'getExposureRawContent').mockImplementation(async (_id, _fileId, _view, filename) => {
      if (filename === 'cmeta.json') return '{}'
      if (filename === 'math.json') return '[]'
      return ''
    })

    const wrapper = mount(ExposureDetail, {
      props: {
        alias: mockExposureInfo.exposure_alias,
        file: '',
        view: '',
      },
      global: {
        stubs: {
          RouterLink: true,
          BackButton: true,
          CodeBlock: true,
          CopyButton: true,
          LoadingBox: true,
          ErrorBlock: true,
          TermButton: true,
          ChevronDownIcon: true,
          DownloadIcon: true,
          FileIcon: true,
        },
      },
    })

    await flushPromises()
    await nextTick()

    return wrapper
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    exposureStore = useExposureStore()
    vi.clearAllMocks()
  })

  it('renders title with correct description', async () => {
    const wrapper = await mountComponent()
    const titleText = mockExposureInfo.exposure.description

    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe(titleText)
  })

  it('renders html-view with content', async () => {
    const wrapper = await mountComponent()

    const htmlView = wrapper.find('.html-view')
    expect(htmlView.exists()).toBe(true)

    const modelStatusHeading = htmlView.find('h4')
    expect(modelStatusHeading.exists()).toBe(true)
    expect(modelStatusHeading.text()).toBe('Model Status')
  })

  it('renders "Open in OpenCOR\'s Web app" link that opens in new tab', async () => {
    const wrapper = await mountComponent()

    const openCorLink = wrapper
      .findAll('a')
      .find((link) => link.text().trim() === "Open in OpenCOR's Web app")

    expect(openCorLink?.exists()).toBe(true)
    expect(openCorLink?.attributes('target')).toBe('_blank')
    expect(openCorLink?.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders h4 with "Source" text', async () => {
    const wrapper = await mountComponent()

    const sourceHeading = wrapper
      .findAll('h4')
      .find((heading) => heading.text().trim() === 'Source')

    expect(sourceHeading?.exists()).toBe(true)
    expect(sourceHeading?.text()).toBe('Source')
  })

  it('renders h4 with "Views Available" text', async () => {
    const wrapper = await mountComponent()

    const sourceHeading = wrapper
      .findAll('h4')
      .find((heading) => heading.text().trim() === 'Views Available')

    expect(sourceHeading?.exists()).toBe(true)
    expect(sourceHeading?.text()).toBe('Views Available')
  })

  it('renders h4 with "Navigation" text', async () => {
    const wrapper = await mountComponent()

    const sourceHeading = wrapper
      .findAll('h4')
      .find((heading) => heading.text().trim() === 'Navigation')

    expect(sourceHeading?.exists()).toBe(true)
    expect(sourceHeading?.text()).toBe('Navigation')
  })

  it('renders h4 with "Downloads" text', async () => {
    const wrapper = await mountComponent()

    const sourceHeading = wrapper
      .findAll('h4')
      .find((heading) => heading.text().trim() === 'Downloads')

    expect(sourceHeading?.exists()).toBe(true)
    expect(sourceHeading?.text()).toBe('Downloads')
  })

  it('renders h4 with "License" text', async () => {
    const wrapper = await mountComponent()

    const sourceHeading = wrapper
      .findAll('h4')
      .find((heading) => heading.text().trim() === 'License')

    expect(sourceHeading?.exists()).toBe(true)
    expect(sourceHeading?.text()).toBe('License')
  })
})

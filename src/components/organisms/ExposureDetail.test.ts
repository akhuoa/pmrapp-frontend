import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ExposureDetail from '@/components/organisms/ExposureDetail.vue'
import { useExposureStore } from '@/stores/exposure'
import type { ExposureInfo } from '@/types/exposure'

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

const mockExposureInfo: ExposureInfo = {
  exposure: {
    id: 1,
    description: 'NCE protein knowledge page',
    workspace_id: 2,
    workspace_tag_id: null,
    commit_id: '536fb3ace66e523b5ad41b5333faf90f1251df51',
    created_ts: 1765425335,
    default_file_id: null,
    files: [
      {
        id: 1,
        exposure_id: 1,
        workspace_file_path: 'exposure/alphafold_NCE2.png',
        default_view_id: null,
        views: [],
      },
      {
        id: 2,
        exposure_id: 1,
        workspace_file_path: 'BG_NCE.cellml',
        default_view_id: null,
        views: [
          {
            id: 1,
            exposure_file_id: 2,
            view_task_template_id: 2,
            exposure_file_view_task_id: 1,
            view_key: 'view',
            updated_ts: 1765425335,
          },
          {
            id: 2,
            exposure_file_id: 2,
            view_task_template_id: 3,
            exposure_file_view_task_id: 2,
            view_key: 'cellml_codegen',
            updated_ts: 1765425335,
          },
          {
            id: 3,
            exposure_file_id: 2,
            view_task_template_id: 4,
            exposure_file_view_task_id: 3,
            view_key: 'cellml_math',
            updated_ts: 1765425335,
          },
          {
            id: 4,
            exposure_file_id: 2,
            view_task_template_id: 5,
            exposure_file_view_task_id: 4,
            view_key: 'cellml_metadata',
            updated_ts: 1765425335,
          },
          {
            id: 5,
            exposure_file_id: 2,
            view_task_template_id: 6,
            exposure_file_view_task_id: 5,
            view_key: 'license_citation',
            updated_ts: 1765425335,
          },
          {
            id: 6,
            exposure_file_id: 2,
            view_task_template_id: 7,
            exposure_file_view_task_id: 6,
            view_key: 'references',
            updated_ts: 1765425335,
          },
        ],
      },
    ],
  },
  exposure_alias: 'ce8',
  files: [
    ['BG_NCE.cellml', true],
    ['NCE_annotations.rdf', false],
    ['exposure/alphafold_NCE2.png', true],
    ['exposure/exposure_frontpage.rst', false],
    ['units_and_constants/constants_BG.cellml', false],
    ['units_and_constants/ion_valency.cellml', false],
    ['units_and_constants/units_BG.cellml', false],
  ],
  workspace: {
    id: 2,
    url: 'https://models.physiomeproject.org/workspace/bd6/',
    superceded_by_id: null,
    description: 'NCE protein knowledge page',
    long_description: null,
    created_ts: 1765425314,
    exposures: null,
  },
  workspace_alias: 'bd6',
}

describe('ExposureDetail', () => {
  let exposureStore: ReturnType<typeof useExposureStore>

  const mountComponent = async () => {
    vi.spyOn(exposureStore, 'getExposureInfo').mockResolvedValue(mockExposureInfo)
    vi.spyOn(exposureStore, 'getExposureSafeHTML').mockImplementation(async (_id, _fileId, _view, filename) => {
      if (filename === 'cmeta.json') return '{}'
      if (filename === 'math.json') return '[]'
      if (filename === 'license.txt') return 'https://creativecommons.org/licenses/by/3.0/'
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

  it('renders title with "NCE protein knowledge page"', async () => {
    const wrapper = await mountComponent()

    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('NCE protein knowledge page')
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

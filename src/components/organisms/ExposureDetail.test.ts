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

  beforeEach(() => {
    setActivePinia(createPinia())
    exposureStore = useExposureStore()
    vi.clearAllMocks()
  })

  it('renders "Open in OpenCOR\'s Web app" link that opens in new tab', async () => {
    vi.spyOn(exposureStore, 'getExposureInfo').mockResolvedValue(mockExposureInfo)
    vi.spyOn(exposureStore, 'getExposureSafeHTML').mockResolvedValue('<div>Test HTML</div>')

    const wrapper = mount(ExposureDetail, {
      props: {
        alias: 'test-alias',
        file: '',
        view: '',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          ActionButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
          PageHeader: true,
          ErrorBlock: true,
          FileIcon: true,
        },
      },
    })

    // Wait for all promises to resolve.
    await flushPromises()
    await nextTick()

    // Find the "Open in OpenCOR's Web app" link.
    const openCORLink = wrapper.find('a[target="_blank"][rel="noopener noreferrer"]')

    expect(openCORLink.exists()).toBe(true)
    expect(openCORLink.text()).toContain("Open in OpenCOR's Web app")
    expect(openCORLink.attributes('target')).toBe('_blank')
    expect(openCORLink.attributes('rel')).toBe('noopener noreferrer')
    expect(openCORLink.attributes('href')).toContain('opencor.ws/app')
  })

  it('calls trackButtonClick when "Open in OpenCOR\'s Web app" is clicked', async () => {
    const { trackButtonClick } = await import('@/utils/analytics')

    vi.spyOn(exposureStore, 'getExposureInfo').mockResolvedValue(mockExposureInfo)
    vi.spyOn(exposureStore, 'getExposureSafeHTML').mockResolvedValue('<div>Test HTML</div>')

    const wrapper = mount(ExposureDetail, {
      props: {
        alias: 'test-alias',
        file: '',
        view: '',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          ActionButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
          PageHeader: true,
          ErrorBlock: true,
          FileIcon: true,
        },
      },
    })

    // Wait for all promises to resolve.
    await flushPromises()
    await nextTick()

    // Find and click the "Open in OpenCOR's Web app" link.
    const openCORLink = wrapper.find('a[target="_blank"][rel="noopener noreferrer"]')
    await openCORLink.trigger('click')

    expect(trackButtonClick).toHaveBeenCalledWith({
      button_name: expect.stringContaining("Open in OpenCOR's Web app"),
      content_section: 'Exposure Detail - NCE protein knowledge page',
      link_category: expect.stringContaining('opencor'),
    })
  })
})

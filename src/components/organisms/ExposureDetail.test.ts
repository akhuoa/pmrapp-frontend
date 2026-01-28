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
  "exposure": {
    "id": 523,
    "description": "Baylor, Hollingworth, Chandler, 2002",
    "workspace_id": 682,
    "workspace_tag_id": null,
    "commit_id": "29a94f9c5718c0aa7438593c2e55d1a2088eeb19",
    "created_ts": 1768824129,
    "default_file_id": null,
    "files": [
      {
        "id": 598,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_a.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1440,
            "exposure_file_id": 598,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1440,
            "view_key": "view",
            "updated_ts": 1768824129
          },
          {
            "id": 1441,
            "exposure_file_id": 598,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1441,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824129
          },
          {
            "id": 1442,
            "exposure_file_id": 598,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1442,
            "view_key": "cellml_math",
            "updated_ts": 1768824129
          },
          {
            "id": 1443,
            "exposure_file_id": 598,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1443,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824129
          },
          {
            "id": 1444,
            "exposure_file_id": 598,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1444,
            "view_key": "license_citation",
            "updated_ts": 1768824129
          },
          {
            "id": 1445,
            "exposure_file_id": 598,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1445,
            "view_key": "references",
            "updated_ts": 1768824129
          }
        ]
      },
      {
        "id": 599,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_b.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1446,
            "exposure_file_id": 599,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1446,
            "view_key": "view",
            "updated_ts": 1768824129
          },
          {
            "id": 1447,
            "exposure_file_id": 599,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1447,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824129
          },
          {
            "id": 1448,
            "exposure_file_id": 599,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1448,
            "view_key": "cellml_math",
            "updated_ts": 1768824129
          },
          {
            "id": 1449,
            "exposure_file_id": 599,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1449,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824129
          },
          {
            "id": 1450,
            "exposure_file_id": 599,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1450,
            "view_key": "license_citation",
            "updated_ts": 1768824129
          },
          {
            "id": 1451,
            "exposure_file_id": 599,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1451,
            "view_key": "references",
            "updated_ts": 1768824129
          }
        ]
      },
      {
        "id": 600,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_c.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1452,
            "exposure_file_id": 600,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1452,
            "view_key": "view",
            "updated_ts": 1768824129
          },
          {
            "id": 1453,
            "exposure_file_id": 600,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1453,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824129
          },
          {
            "id": 1454,
            "exposure_file_id": 600,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1454,
            "view_key": "cellml_math",
            "updated_ts": 1768824129
          },
          {
            "id": 1455,
            "exposure_file_id": 600,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1455,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824129
          },
          {
            "id": 1456,
            "exposure_file_id": 600,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1456,
            "view_key": "license_citation",
            "updated_ts": 1768824129
          },
          {
            "id": 1457,
            "exposure_file_id": 600,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1457,
            "view_key": "references",
            "updated_ts": 1768824130
          }
        ]
      },
      {
        "id": 601,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_d.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1458,
            "exposure_file_id": 601,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1458,
            "view_key": "view",
            "updated_ts": 1768824130
          },
          {
            "id": 1459,
            "exposure_file_id": 601,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1459,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824130
          },
          {
            "id": 1460,
            "exposure_file_id": 601,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1460,
            "view_key": "cellml_math",
            "updated_ts": 1768824130
          },
          {
            "id": 1461,
            "exposure_file_id": 601,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1461,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824130
          },
          {
            "id": 1462,
            "exposure_file_id": 601,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1462,
            "view_key": "license_citation",
            "updated_ts": 1768824130
          },
          {
            "id": 1463,
            "exposure_file_id": 601,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1463,
            "view_key": "references",
            "updated_ts": 1768824130
          }
        ]
      },
      {
        "id": 602,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_e.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1464,
            "exposure_file_id": 602,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1464,
            "view_key": "view",
            "updated_ts": 1768824130
          },
          {
            "id": 1465,
            "exposure_file_id": 602,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1465,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824130
          },
          {
            "id": 1466,
            "exposure_file_id": 602,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1466,
            "view_key": "cellml_math",
            "updated_ts": 1768824130
          },
          {
            "id": 1467,
            "exposure_file_id": 602,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1467,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824130
          },
          {
            "id": 1468,
            "exposure_file_id": 602,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1468,
            "view_key": "license_citation",
            "updated_ts": 1768824130
          },
          {
            "id": 1469,
            "exposure_file_id": 602,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1469,
            "view_key": "references",
            "updated_ts": 1768824130
          }
        ]
      },
      {
        "id": 603,
        "exposure_id": 523,
        "workspace_file_path": "baylor_hollingworth_chandler_2002_f.cellml",
        "default_view_id": null,
        "views": [
          {
            "id": 1470,
            "exposure_file_id": 603,
            "view_task_template_id": 2,
            "exposure_file_view_task_id": 1470,
            "view_key": "view",
            "updated_ts": 1768824130
          },
          {
            "id": 1471,
            "exposure_file_id": 603,
            "view_task_template_id": 3,
            "exposure_file_view_task_id": 1471,
            "view_key": "cellml_codegen",
            "updated_ts": 1768824130
          },
          {
            "id": 1472,
            "exposure_file_id": 603,
            "view_task_template_id": 4,
            "exposure_file_view_task_id": 1472,
            "view_key": "cellml_math",
            "updated_ts": 1768824130
          },
          {
            "id": 1473,
            "exposure_file_id": 603,
            "view_task_template_id": 5,
            "exposure_file_view_task_id": 1473,
            "view_key": "cellml_metadata",
            "updated_ts": 1768824130
          },
          {
            "id": 1474,
            "exposure_file_id": 603,
            "view_task_template_id": 6,
            "exposure_file_view_task_id": 1474,
            "view_key": "license_citation",
            "updated_ts": 1768824130
          },
          {
            "id": 1475,
            "exposure_file_id": 603,
            "view_task_template_id": 7,
            "exposure_file_view_task_id": 1475,
            "view_key": "references",
            "updated_ts": 1768824130
          }
        ]
      }
    ]
  },
  "exposure_alias": "210f6601f6461be8443592ff071d2592",
  "files": [
    [
      "baylor_2002.png",
      false
    ],
    [
      "baylor_hollingworth_chandler_2002_a.cellml",
      true
    ],
    [
      "baylor_hollingworth_chandler_2002_b.cellml",
      true
    ],
    [
      "baylor_hollingworth_chandler_2002_c.cellml",
      true
    ],
    [
      "baylor_hollingworth_chandler_2002_d.cellml",
      true
    ],
    [
      "baylor_hollingworth_chandler_2002_e.cellml",
      true
    ],
    [
      "baylor_hollingworth_chandler_2002_f.cellml",
      true
    ]
  ],
  "workspace": {
    "id": 682,
    "url": "https://models.physiomeproject.org/workspace/baylor_hollingworth_chandler_2002/",
    "superceded_by_id": null,
    "description": "Baylor, Hollingworth, Chandler, 2002",
    "long_description": null,
    "created_ts": 1768823983,
    "exposures": null
  },
  "workspace_alias": "baylor_hollingworth_chandler_2002"
}

describe('ExposureDetail', () => {
  let exposureStore: ReturnType<typeof useExposureStore>

  const mountComponent = async () => {
    vi.spyOn(exposureStore, 'getExposureInfo').mockResolvedValue(mockExposureInfo)
    vi.spyOn(exposureStore, 'getExposureSafeHTML').mockImplementation(async (_id, _fileId, _view, filename) => {
      if (filename === 'index.html') return ''
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

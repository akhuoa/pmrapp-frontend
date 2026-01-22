import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WorkspaceDetail from '@/components/organisms/WorkspaceDetail.vue'
import { useWorkspaceStore } from '@/stores/workspace'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

// Mock services
vi.mock('@/services/downloadUrlService', () => ({
  getArchiveDownloadUrls: vi.fn(),
}))

// Mock utils
vi.mock('@/utils/download', () => ({
  downloadWorkspaceFile: vi.fn(),
}))

vi.mock('@/utils/format', () => ({
  formatFileCount: vi.fn((count) => `${count} items`),
}))

describe('WorkspaceDetail', () => {
  let workspaceStore: ReturnType<typeof useWorkspaceStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    workspaceStore = useWorkspaceStore()
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    vi.spyOn(workspaceStore, 'getWorkspaceInfo').mockImplementation(
      () => new Promise(() => {}),
    )

    const wrapper = mount(WorkspaceDetail, {
      props: {
        alias: 'test-alias',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: {
            template: '<div class="loading">Loading...</div>',
          },
          ErrorBlock: true,
          PageHeader: true,
          ActionButton: true,
          FileIcon: true,
          FolderIcon: true,
          DownloadIcon: true,
        },
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('renders error when workspace fails to load', async () => {
    vi.spyOn(workspaceStore, 'getWorkspaceInfo').mockRejectedValue(new Error('Workspace not found'))

    const wrapper = mount(WorkspaceDetail, {
      props: {
        alias: 'test-alias',
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
          ActionButton: true,
          FileIcon: true,
          FolderIcon: true,
          DownloadIcon: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('renders BackButton component', () => {
    const wrapper = mount(WorkspaceDetail, {
      props: {
        alias: 'test-alias',
      },
      global: {
        stubs: {
          BackButton: {
            template: '<div class="back-button">Back</div>',
          },
          LoadingBox: true,
          ErrorBlock: true,
          PageHeader: true,
          ActionButton: true,
          FileIcon: true,
          FolderIcon: true,
          DownloadIcon: true,
        },
      },
    })

    expect(wrapper.find('.back-button').exists()).toBe(true)
  })

  it('component loads with required props', () => {
    vi.spyOn(workspaceStore, 'getWorkspaceInfo').mockImplementation(
      () => new Promise(() => {}),
    )

    const wrapper = mount(WorkspaceDetail, {
      props: {
        alias: 'test-workspace',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: true,
          ErrorBlock: true,
          PageHeader: true,
          ActionButton: true,
          FileIcon: true,
          FolderIcon: true,
          DownloadIcon: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$props.alias).toBe('test-workspace')
  })
})

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WorkspaceFileDetail from '@/components/organisms/WorkspaceFileDetail.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/workspaces/test/file',
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

// Mock services
vi.mock('@/services', () => ({
  getWorkspaceService: vi.fn(() => ({
    getRawFile: vi.fn(),
    getRawFileBlob: vi.fn(),
  })),
}))

// Mock utils
vi.mock('@/utils/download', () => ({
  downloadFileFromContent: vi.fn(),
  downloadFileFromBlob: vi.fn(),
}))

vi.mock('@/utils/file', () => ({
  isCodeFile: vi.fn(),
  isImageFile: vi.fn(),
  isMarkdownFile: vi.fn(),
  isPdfFile: vi.fn(),
  isSvgFile: vi.fn(),
}))

vi.mock('@/utils/markdown', () => ({
  renderMarkdown: vi.fn((text) => text),
}))

describe('WorkspaceFileDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    const { getWorkspaceService } = require('@/services')
    vi.mocked(getWorkspaceService)().getRawFile = vi.fn(() => new Promise(() => {}))

    const wrapper = mount(WorkspaceFileDetail, {
      props: {
        alias: 'test-alias',
        commitId: 'abc123',
        path: 'test.txt',
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
          CodeBlock: true,
          CodeIcon: true,
          DownloadIcon: true,
          PreviewIcon: true,
        },
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('renders error when file fails to load', async () => {
    const { getWorkspaceService } = require('@/services')
    vi.mocked(getWorkspaceService)().getRawFile = vi.fn().mockRejectedValue(new Error('File not found'))

    const wrapper = mount(WorkspaceFileDetail, {
      props: {
        alias: 'test-alias',
        commitId: 'abc123',
        path: 'test.txt',
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
          CodeBlock: true,
          CodeIcon: true,
          DownloadIcon: true,
          PreviewIcon: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('renders BackButton component', () => {
    const wrapper = mount(WorkspaceFileDetail, {
      props: {
        alias: 'test-alias',
        commitId: 'abc123',
        path: 'test.txt',
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
          CodeBlock: true,
          CodeIcon: true,
          DownloadIcon: true,
          PreviewIcon: true,
        },
      },
    })

    expect(wrapper.find('.back-button').exists()).toBe(true)
  })

  it('component loads with required props', () => {
    const { getWorkspaceService } = require('@/services')
    vi.mocked(getWorkspaceService)().getRawFile = vi.fn(() => new Promise(() => {}))

    const wrapper = mount(WorkspaceFileDetail, {
      props: {
        alias: 'test-workspace',
        commitId: 'commit-hash',
        path: 'folder/file.txt',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: true,
          ErrorBlock: true,
          PageHeader: true,
          ActionButton: true,
          CodeBlock: true,
          CodeIcon: true,
          DownloadIcon: true,
          PreviewIcon: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$props.alias).toBe('test-workspace')
    expect(wrapper.vm.$props.commitId).toBe('commit-hash')
    expect(wrapper.vm.$props.path).toBe('folder/file.txt')
  })

  it('extracts filename from path correctly', () => {
    const { getWorkspaceService } = require('@/services')
    vi.mocked(getWorkspaceService)().getRawFile = vi.fn(() => new Promise(() => {}))

    const wrapper = mount(WorkspaceFileDetail, {
      props: {
        alias: 'test-alias',
        commitId: 'abc123',
        path: 'folder/subfolder/test.txt',
      },
      global: {
        stubs: {
          BackButton: true,
          LoadingBox: true,
          ErrorBlock: true,
          PageHeader: true,
          ActionButton: true,
          CodeBlock: true,
          CodeIcon: true,
          DownloadIcon: true,
          PreviewIcon: true,
        },
      },
    })

    expect(wrapper.vm.filename).toBe('test.txt')
  })
})

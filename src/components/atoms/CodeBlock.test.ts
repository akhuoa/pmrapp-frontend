import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CodeBlock from '@/components/atoms/CodeBlock.vue'

// Mock PrismJS to avoid real syntax highlighting in tests.
vi.mock('prismjs', () => ({
  default: {
    highlightElement: vi.fn(),
    plugins: {
      lineNumbers: {
        resize: vi.fn(),
      },
    },
  },
}))

// Mock PrismJS language and plugin imports.
vi.mock('prismjs/components/prism-markup', () => ({}))
vi.mock('prismjs/components/prism-css', () => ({}))
vi.mock('prismjs/components/prism-c', () => ({}))
vi.mock('prismjs/components/prism-cpp', () => ({}))
vi.mock('prismjs/components/prism-fortran', () => ({}))
vi.mock('prismjs/components/prism-javascript', () => ({}))
vi.mock('prismjs/components/prism-json', () => ({}))
vi.mock('prismjs/components/prism-python', () => ({}))
vi.mock('prismjs/components/prism-markdown', () => ({}))
vi.mock('prismjs/components/prism-matlab', () => ({}))
vi.mock('prismjs/plugins/line-numbers/prism-line-numbers.css', () => ({}))
vi.mock('prismjs/plugins/line-numbers/prism-line-numbers', () => ({}))
vi.mock('prismjs/themes/prism-okaidia.css?url', () => ({ default: '' }))
vi.mock('prismjs/themes/prism.css?url', () => ({ default: '' }))

beforeEach(() => {
  // ResizeObserver must be a proper constructor for the component's typeof check.
  class MockResizeObserver {
    observe = vi.fn()
    disconnect = vi.fn()
  }
  vi.stubGlobal('ResizeObserver', MockResizeObserver)

  // jsdom does not implement matchMedia; provide a minimal stub.
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})

const MAX_HIGHLIGHT_SIZE_BYTES = 500 * 1024 // 500 KB – mirrors the constant in CodeBlock.vue

const smallCode = 'const x = 1'
const largeCode = 'x'.repeat(MAX_HIGHLIGHT_SIZE_BYTES + 1)

describe('CodeBlock', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders code content', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.js' },
    })
    expect(wrapper.find('code').text()).toBe(smallCode)
    wrapper.unmount()
  })

  it('includes the line-numbers class for small files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.py' },
    })
    expect(wrapper.find('pre').classes()).toContain('line-numbers')
    wrapper.unmount()
  })

  it('does not include line-numbers class for large files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: largeCode, filename: 'model.cellml' },
    })
    expect(wrapper.find('pre').classes()).not.toContain('line-numbers')
    wrapper.unmount()
  })

  it('shows warning notice for large files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: largeCode, filename: 'model.cellml' },
    })
    const notice = wrapper.find('[class*="bg-amber"]')
    expect(notice.exists()).toBe(true)
    expect(notice.text()).toContain('too large for syntax highlighting')
    wrapper.unmount()
  })

  it('does not show warning notice for small files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'model.cellml' },
    })
    expect(wrapper.find('[class*="bg-amber"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('applies the correct language class for .cellml files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'model.cellml' },
    })
    expect(wrapper.find('code').classes()).toContain('language-markup')
    wrapper.unmount()
  })

  it('applies plaintext language class for unknown extensions', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'data.xyz' },
    })
    expect(wrapper.find('code').classes()).toContain('language-plaintext')
    wrapper.unmount()
  })

  it('updates warning visibility when code changes from small to large', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'model.cellml' },
    })

    expect(wrapper.find('[class*="bg-amber"]').exists()).toBe(false)

    await wrapper.setProps({ code: largeCode })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="bg-amber"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('removes warning when code changes from large to small', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: largeCode, filename: 'model.cellml' },
    })

    expect(wrapper.find('[class*="bg-amber"]').exists()).toBe(true)

    await wrapper.setProps({ code: smallCode })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="bg-amber"]').exists()).toBe(false)
    wrapper.unmount()
  })
})

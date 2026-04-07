import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CodeBlock from '@/components/atoms/CodeBlock.vue'

// Use vi.hoisted so the mock function reference is available to both the
// vi.mock() factory and the test bodies that inspect call arguments.
const { mockHighlight } = vi.hoisted(() => ({
  mockHighlight: vi.fn(),
}))

// Mock the composable so tests control what the service worker returns.
vi.mock('@/composables/usePrismHighlight', () => ({
  usePrismHighlight: () => ({ highlight: mockHighlight }),
}))

// Mock PrismJS – used by syncWrapAndLineNumbers / triggerLineNumberHooks.
vi.mock('prismjs', () => ({
  default: {
    highlightElement: vi.fn(),
    hooks: {
      run: vi.fn(),
    },
    languages: {
      markup: {},
      javascript: {},
      python: {},
      plaintext: {},
    },
    plugins: {
      lineNumbers: {
        resize: vi.fn(),
      },
    },
  },
}))

// Mock PrismJS language and plugin side-effect imports.
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
  // Default: service worker returns highlighted HTML immediately.
  mockHighlight.mockResolvedValue('<span class="token">const x = 1</span>')

  // ResizeObserver must be a proper constructor for the component's typeof check.
  class MockResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
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

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

const sampleCode = 'const x = 1'

describe('CodeBlock', () => {
  it('renders code content immediately as escaped plain text before the SW responds', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })
    expect(wrapper.find('code').html()).toContain('const x = 1')
    wrapper.unmount()
  })

  it('shows loading indicator while the service worker request is in flight', async () => {
    // Never resolves so we can inspect the loading state.
    mockHighlight.mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="animate-pulse"]').exists()).toBe(true)
    expect(wrapper.find('[class*="animate-pulse"]').text()).toContain('Highlighting code')
    wrapper.unmount()
  })

  it('applies highlighted HTML returned by the service worker', async () => {
    mockHighlight.mockResolvedValue('<span class="token keyword">const</span> x = 1')

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('code').html()).toContain('token keyword')
    wrapper.unmount()
  })

  it('clears the loading indicator after highlighting completes', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="animate-pulse"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('calls highlight with the correct code and language', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.py' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockHighlight).toHaveBeenCalledWith(sampleCode, 'python')
    wrapper.unmount()
  })

  it('always includes the line-numbers class on the pre element', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'model.cellml' },
    })
    expect(wrapper.find('pre').classes()).toContain('line-numbers')
    wrapper.unmount()
  })

  it('applies the correct language class for .cellml files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'model.cellml' },
    })
    expect(wrapper.find('code').classes()).toContain('language-markup')
    wrapper.unmount()
  })

  it('applies plaintext language class for unknown file extensions', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'data.xyz' },
    })
    expect(wrapper.find('code').classes()).toContain('language-plaintext')
    wrapper.unmount()
  })

  it('discards a stale response when the code prop changes before the SW replies', async () => {
    const resolverBox: { fn: (() => void) | null } = { fn: null }
    let callCount = 0

    mockHighlight.mockImplementation(
      (code: string) =>
        new Promise<string>((resolve) => {
          callCount++
          if (callCount === 1) {
            // First request stalls – captured so we can fire it late.
            resolverBox.fn = () => resolve('<span>first (stale)</span>')
          } else {
            queueMicrotask(() => resolve(`<span>${code}</span>`))
          }
        }),
    )

    const wrapper = mount(CodeBlock, {
      props: { code: 'first', filename: 'example.js' },
    })

    // Change code before the first request resolves.
    await wrapper.setProps({ code: 'second' })
    await new Promise((resolve) => setTimeout(resolve, 20))
    await wrapper.vm.$nextTick()

    // Now fire the stale first response.
    resolverBox.fn?.()
    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('code').html()).not.toContain('first (stale)')
    expect(wrapper.find('code').html()).toContain('second')
    wrapper.unmount()
  })

  it('calls highlight again when the code prop changes', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    const callsBefore = mockHighlight.mock.calls.length

    await wrapper.setProps({ code: 'let y = 2' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockHighlight.mock.calls.length).toBeGreaterThan(callsBefore)
    wrapper.unmount()
  })
})

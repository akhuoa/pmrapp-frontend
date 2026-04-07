import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CodeBlock from '@/components/atoms/CodeBlock.vue'

// Mock the highlight service so tests control what the server returns.
vi.mock('@/services/highlightService', () => ({
  highlightService: {
    highlight: vi.fn().mockResolvedValue('<span class="token">const x = 1</span>'),
  },
}))

// Mock PrismJS – used by the main-thread fallback path.
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

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

const sampleCode = 'const x = 1'
const largeCode = 'x'.repeat(1_000_000)

// Lazily import the mock so we can override it per test.
const getHighlightServiceMock = async () => {
  const mod = await import('@/services/highlightService')
  return vi.mocked(mod.highlightService.highlight)
}

describe('CodeBlock', () => {
  it('renders code content immediately as plain text before the service responds', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })
    // Initial displayCode is HTML-escaped plain text.
    expect(wrapper.find('code').html()).toContain('const x = 1')
    wrapper.unmount()
  })

  it('shows the loading indicator while the service request is in flight', async () => {
    const highlight = await getHighlightServiceMock()
    // Never resolves so we can observe the loading state.
    highlight.mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="animate-pulse"]').exists()).toBe(true)
    expect(wrapper.find('[class*="animate-pulse"]').text()).toContain('Highlighting code')
    wrapper.unmount()
  })

  it('applies highlighted HTML returned by the service', async () => {
    const highlight = await getHighlightServiceMock()
    highlight.mockResolvedValue('<span class="token keyword">const</span> x = 1')

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('code').html()).toContain('token keyword')
    wrapper.unmount()
  })

  it('clears the loading indicator after the service responds', async () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[class*="animate-pulse"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('calls the highlight service with the correct code and language', async () => {
    const highlight = await getHighlightServiceMock()

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.py' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(highlight).toHaveBeenCalledWith(sampleCode, 'python')
    wrapper.unmount()
  })

  it('includes the line-numbers class for all files', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: largeCode, filename: 'model.cellml' },
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

  it('applies plaintext language class for unknown extensions', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'data.xyz' },
    })
    expect(wrapper.find('code').classes()).toContain('language-plaintext')
    wrapper.unmount()
  })

  it('falls back to main-thread Prism when the service call fails', async () => {
    const highlight = await getHighlightServiceMock()
    highlight.mockRejectedValue(new Error('Service unavailable'))

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    // Component should not crash and the code element should still be present.
    expect(wrapper.find('code').exists()).toBe(true)
    wrapper.unmount()
  })

  it('discards a stale service response when code changes rapidly', async () => {
    const resolverBox: { fn: (() => void) | null } = { fn: null }
    let callCount = 0

    const highlight = await getHighlightServiceMock()
    highlight.mockImplementation(
      (code: string) =>
        new Promise<string>((resolve) => {
          callCount++
          if (callCount === 1) {
            // First request stalls.
            resolverBox.fn = () => resolve('<span>first (stale)</span>')
          } else {
            // Subsequent requests resolve immediately.
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

    // Fire the stale first response now.
    resolverBox.fn?.()
    await new Promise((resolve) => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('code').html()).not.toContain('first (stale)')
    expect(wrapper.find('code').html()).toContain('second')
    wrapper.unmount()
  })

  it('calls the service again when code prop changes', async () => {
    const highlight = await getHighlightServiceMock()

    const wrapper = mount(CodeBlock, {
      props: { code: sampleCode, filename: 'example.js' },
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    const callsBefore = highlight.mock.calls.length

    await wrapper.setProps({ code: 'let y = 2' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(highlight.mock.calls.length).toBeGreaterThan(callsBefore)
    wrapper.unmount()
  })
})

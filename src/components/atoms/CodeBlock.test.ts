import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CodeBlock from '@/components/atoms/CodeBlock.vue'

// Mock Prism
vi.mock('prismjs', () => ({
  default: {
    highlightElement: vi.fn(),
  },
}))

vi.mock('prismjs/components/prism-markup', () => ({}))
vi.mock('prismjs/components/prism-css', () => ({}))
vi.mock('prismjs/components/prism-javascript', () => ({}))
vi.mock('prismjs/components/prism-python', () => ({}))
vi.mock('prismjs/components/prism-markdown', () => ({}))
vi.mock('prismjs/plugins/line-numbers/prism-line-numbers.css', () => ({}))
vi.mock('prismjs/plugins/line-numbers/prism-line-numbers', () => ({}))

describe('CodeBlock', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders code block with filename', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'const x = 1;',
        filename: 'test.js',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect(wrapper.find('code').exists()).toBe(true)
  })

  it('detects JavaScript language from .js extension', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'const x = 1;',
        filename: 'test.js',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect((wrapper.vm as any).detectedLanguage).toBe('javascript')
  })

  it('detects Python language from .py extension', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'x = 1',
        filename: 'test.py',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect((wrapper.vm as any).detectedLanguage).toBe('python')
  })

  it('detects markup language from .html extension', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: '<div>test</div>',
        filename: 'test.html',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect((wrapper.vm as any).detectedLanguage).toBe('markup')
  })

  it('detects CSS language from .css extension', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'body { color: red; }',
        filename: 'test.css',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect((wrapper.vm as any).detectedLanguage).toBe('css')
  })

  it('returns none for unknown extensions', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'some code',
        filename: 'test.unknown',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect((wrapper.vm as any).detectedLanguage).toBe('none')
  })

  it('displays the code content', () => {
    const testCode = 'const greeting = "Hello World";'
    const wrapper = mount(CodeBlock, {
      props: {
        code: testCode,
        filename: 'test.js',
      },
      global: {
        stubs: {
          CopyButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain(testCode)
  })
})

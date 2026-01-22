import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CopyButton from '@/components/atoms/CopyButton.vue'

describe('CopyButton', () => {
  const mockClipboard = {
    writeText: vi.fn(),
  }

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    })
    mockClipboard.writeText.mockResolvedValue(undefined)
    vi.clearAllMocks()
  })

  it('renders copy button', () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: 'test text',
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('copies text to clipboard when clicked', async () => {
    const testText = 'Copy this text'
    const wrapper = mount(CopyButton, {
      props: {
        text: testText,
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText)
  })

  it('shows "Copied!" message after successful copy', async () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: 'test',
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Copied!')
  })

  it('uses custom title prop', () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: 'test',
        title: 'Copy Code',
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Copy Code')
  })

  it('defaults to "Copy" title when not specified', () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: 'test',
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Copy')
  })

  it('handles copy failure gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockClipboard.writeText.mockRejectedValue(new Error('Copy failed'))

    const wrapper = mount(CopyButton, {
      props: {
        text: 'test',
      },
      global: {
        stubs: {
          CopyIcon: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })
})

import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BackToTop from '@/components/atoms/BackToTop.vue'

describe('BackToTop', () => {
  beforeEach(() => {
    // Reset window scroll position
    window.scrollY = 0
    vi.clearAllMocks()
  })

  it('renders button when not visible initially', () => {
    const wrapper = mount(BackToTop, {
      global: {
        stubs: {
          ArrowUpIcon: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('shows button when scrolled down more than 300px', async () => {
    const wrapper = mount(BackToTop, {
      global: {
        stubs: {
          ArrowUpIcon: true,
        },
      },
    })

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('hides button when scrolled less than 300px', async () => {
    const wrapper = mount(BackToTop, {
      global: {
        stubs: {
          ArrowUpIcon: true,
        },
      },
    })

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
    window.dispatchEvent(new Event('scroll'))

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isVisible).toBe(false)
  })

  it('scrolls to top when button is clicked', async () => {
    const scrollToMock = vi.fn()
    window.scrollTo = scrollToMock

    const wrapper = mount(BackToTop, {
      global: {
        stubs: {
          ArrowUpIcon: true,
        },
      },
    })

    // Make button visible
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    await wrapper.find('button').trigger('click')

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('has proper aria-label', () => {
    const wrapper = mount(BackToTop, {
      global: {
        stubs: {
          ArrowUpIcon: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Back to top')
  })
})

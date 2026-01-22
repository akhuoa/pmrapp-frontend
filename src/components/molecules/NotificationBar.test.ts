import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NotificationBar from '@/components/molecules/NotificationBar.vue'

// Mock cookie utility
vi.mock('@/utils/cookie', () => ({
  Cookie: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

describe('NotificationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders notification when not dismissed', async () => {
    const { Cookie } = await import('@/utils/cookie')
    vi.mocked(Cookie.get).mockResolvedValue(null)

    const wrapper = mount(NotificationBar, {
      global: {
        stubs: {
          CloseButton: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('This is a general notification message.')
  })

  it('hides notification when previously dismissed', async () => {
    const { Cookie } = await import('@/utils/cookie')
    vi.mocked(Cookie.get).mockResolvedValue('true')

    const wrapper = mount(NotificationBar, {
      global: {
        stubs: {
          CloseButton: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('hides notification and sets cookie when close button is clicked', async () => {
    const { Cookie } = await import('@/utils/cookie')
    vi.mocked(Cookie.get).mockResolvedValue(null)
    vi.mocked(Cookie.set).mockResolvedValue(undefined)

    const wrapper = mount(NotificationBar, {
      global: {
        stubs: {
          CloseButton: {
            template: '<button @click="$emit(\'click\')">Close</button>',
          },
        },
      },
    })

    await flushPromises()

    expect(wrapper.vm.isVisible).toBe(true)

    await wrapper.findComponent({ name: 'CloseButton' }).trigger('click')
    await flushPromises()

    expect(wrapper.vm.isVisible).toBe(false)
    expect(Cookie.set).toHaveBeenCalledWith('pmr_notification_dismissed', 'true', 7)
  })

  it('includes warning emoji in notification', async () => {
    const { Cookie } = await import('@/utils/cookie')
    vi.mocked(Cookie.get).mockResolvedValue(null)

    const wrapper = mount(NotificationBar, {
      global: {
        stubs: {
          CloseButton: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('⚠️')
  })
})

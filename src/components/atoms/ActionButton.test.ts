import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ActionButton from '@/components/atoms/ActionButton.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/test',
  }),
  RouterLink: {
    template: '<a :to="to"><slot /></a>',
    props: ['to'],
  },
}))

// Mock analytics
vi.mock('@/utils/analytics', () => ({
  trackButtonClick: vi.fn(),
}))

describe('ActionButton', () => {
  it('renders as button by default', () => {
    const wrapper = mount(ActionButton, {
      slots: {
        default: 'Click me',
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Click me')
  })

  it('renders as link when href is provided', () => {
    const wrapper = mount(ActionButton, {
      props: {
        href: 'https://example.com',
      },
      slots: {
        default: 'Link text',
      },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('renders as RouterLink when to is provided', () => {
    const wrapper = mount(ActionButton, {
      props: {
        to: '/home',
      },
      slots: {
        default: 'Router Link',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.html()).toContain('Router Link')
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(ActionButton, {
      slots: {
        default: 'Button',
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-primary')
  })

  it('applies secondary variant classes when specified', () => {
    const wrapper = mount(ActionButton, {
      props: {
        variant: 'secondary',
      },
      slots: {
        default: 'Button',
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('border-primary')
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(ActionButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('calls trackButtonClick on click', async () => {
    const { trackButtonClick } = await import('@/utils/analytics')

    const wrapper = mount(ActionButton, {
      props: {
        contentSection: 'test-section',
      },
      slots: {
        default: 'Click me',
      },
    })

    await wrapper.find('button').trigger('click')

    expect(trackButtonClick).toHaveBeenCalledWith({
      button_name: 'Click me',
      content_section: 'test-section',
      link_category: '/test',
    })
  })

  it('applies size classes correctly', () => {
    const wrapper = mount(ActionButton, {
      props: {
        size: 'lg',
      },
      slots: {
        default: 'Large Button',
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('px-4')
    expect(button.classes()).toContain('py-2')
  })

  it('supports download attribute for links', () => {
    const wrapper = mount(ActionButton, {
      props: {
        href: 'https://example.com/file.pdf',
        download: true,
      },
      slots: {
        default: 'Download',
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('download')).toBeDefined()
  })

  it('supports target and rel attributes for links', () => {
    const wrapper = mount(ActionButton, {
      props: {
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      slots: {
        default: 'External Link',
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })
})

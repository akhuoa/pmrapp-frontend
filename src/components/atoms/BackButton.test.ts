import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BackButton from '@/components/atoms/BackButton.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/test',
  }),
}))

// Mock analytics
vi.mock('@/utils/analytics', () => ({
  trackButtonClick: vi.fn(),
}))

describe('BackButton', () => {
  it('renders with default label', () => {
    const wrapper = mount(BackButton, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Back')
  })

  it('renders with custom label', () => {
    const wrapper = mount(BackButton, {
      props: {
        label: 'Go Back',
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Go Back')
  })

  it('calls onClick callback when clicked', async () => {
    const onClickMock = vi.fn()
    const wrapper = mount(BackButton, {
      props: {
        onClick: onClickMock,
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(onClickMock).toHaveBeenCalled()
  })

  it('passes contentSection prop to ActionButton', () => {
    const wrapper = mount(BackButton, {
      props: {
        contentSection: 'test-section',
      },
      global: {
        stubs: {
          ActionButton: {
            name: 'ActionButton',
            template: '<button :content-section="contentSection"><slot /></button>',
            props: ['contentSection'],
          },
        },
      },
    })

    const button = wrapper.findComponent({ name: 'ActionButton' })
    expect(button.props('contentSection')).toBe('test-section')
  })
})

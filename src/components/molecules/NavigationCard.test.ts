import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NavigationCard from '@/components/molecules/NavigationCard.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a :to="to" class="box"><slot /></a>',
    props: ['to'],
  },
}))

describe('NavigationCard', () => {
  it('renders title and description', () => {
    const wrapper = mount(NavigationCard, {
      props: {
        to: '/test',
        title: 'Test Title',
        description: 'Test Description',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to" class="box"><slot /></a>',
            props: ['to'],
          },
          ArrowRightIcon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Description')
  })

  it('renders title in h2 tag', () => {
    const wrapper = mount(NavigationCard, {
      props: {
        to: '/test',
        title: 'Navigation Title',
        description: 'Description',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to" class="box"><slot /></a>',
            props: ['to'],
          },
          ArrowRightIcon: true,
        },
      },
    })

    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.text()).toBe('Navigation Title')
  })

  it('renders description in p tag', () => {
    const wrapper = mount(NavigationCard, {
      props: {
        to: '/test',
        title: 'Title',
        description: 'Card description text',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to" class="box"><slot /></a>',
            props: ['to'],
          },
          ArrowRightIcon: true,
        },
      },
    })

    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('Card description text')
  })

  it('includes ArrowRightIcon', () => {
    const wrapper = mount(NavigationCard, {
      props: {
        to: '/test',
        title: 'Title',
        description: 'Description',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to" class="box"><slot /></a>',
            props: ['to'],
          },
          ArrowRightIcon: {
            template: '<svg class="arrow-icon"></svg>',
          },
        },
      },
    })

    expect(wrapper.find('.arrow-icon').exists()).toBe(true)
  })
})

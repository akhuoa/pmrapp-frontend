import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ListItem from '@/components/molecules/ListItem.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a :to="to"><slot /></a>',
    props: ['to'],
  },
}))

describe('ListItem', () => {
  it('renders title as a link', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'Test Item',
        link: '/test',
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

    expect(wrapper.text()).toContain('Test Item')
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'Test Item',
        subtitle: 'This is a subtitle',
        link: '/test',
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

    expect(wrapper.text()).toContain('This is a subtitle')
  })

  it('does not render subtitle when not provided', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'Test Item',
        link: '/test',
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

    const p = wrapper.find('p')
    expect(p.exists()).toBe(false)
  })

  it('renders slot content', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'Test Item',
        link: '/test',
      },
      slots: {
        default: '<div class="custom-content">Custom content</div>',
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

    expect(wrapper.html()).toContain('Custom content')
  })

  it('has proper styling classes', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'Test Item',
        link: '/test',
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

    const h3 = wrapper.find('h3')
    expect(h3.classes()).toContain('text-link')
  })
})

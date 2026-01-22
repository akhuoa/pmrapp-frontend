import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Header from '@/components/organisms/Header.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/workspaces',
  }),
  RouterLink: {
    template: '<a :to="to" :class="$attrs.class"><slot /></a>',
    props: ['to'],
  },
}))

describe('Header', () => {
  it('renders logo link to home', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          UserDropdown: true,
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Physiome Model Repository')
  })

  it('renders navigation links for Workspaces and Exposures', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          UserDropdown: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Workspaces')
    expect(wrapper.text()).toContain('Exposures')
  })

  it('renders UserDropdown component', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          RouterLink: true,
          UserDropdown: {
            template: '<div class="user-dropdown-stub">User Dropdown</div>',
          },
        },
      },
    })

    expect(wrapper.find('.user-dropdown-stub').exists()).toBe(true)
  })

  it('has sticky header with proper classes', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          RouterLink: true,
          UserDropdown: true,
        },
      },
    })

    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.classes()).toContain('sticky')
  })

  it('renders nav element with list items', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          RouterLink: true,
          UserDropdown: true,
        },
      },
    })

    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)

    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Home from '@/components/organisms/Home.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a :to="to"><slot /></a>',
    props: ['to'],
  },
}))

describe('Home', () => {
  it('renders main title', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Physiome Model Repository')
  })

  it('renders description text', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: true,
        },
      },
    })

    expect(wrapper.text()).toContain('public resource for storing')
    expect(wrapper.text()).toContain('CellML models')
  })

  it('renders NavigationCard for Workspaces', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: {
            template: '<div class="nav-card">{{ title }}</div>',
            props: ['to', 'title', 'description'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Workspaces')
  })

  it('renders NavigationCard for Exposures', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: {
            template: '<div class="nav-card">{{ title }}</div>',
            props: ['to', 'title', 'description'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Exposures')
  })

  it('has proper heading hierarchy', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: true,
        },
      },
    })

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Physiome Model Repository')
  })

  it('displays description paragraph', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          NavigationCard: true,
        },
      },
    })

    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.classes()).toContain('text-xl')
  })
})

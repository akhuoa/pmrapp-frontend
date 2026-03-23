import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Breadcrumbs from '@/components/molecules/Breadcrumbs.vue'

describe('Breadcrumbs', () => {
  it('renders a single item without a link', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Home' }] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders linked items except the last one', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'Workspaces', to: '/workspaces' },
          { label: 'My Workspace', to: '/workspaces/ws1' },
          { label: 'file.txt' },
        ],
      },
      global: { stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } },
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(2)
    expect(links[0].text()).toBe('Workspaces')
    expect(links[1].text()).toBe('My Workspace')
    expect(wrapper.text()).toContain('file.txt')
  })

  it('renders separators between items', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'A', to: '/a' },
          { label: 'B', to: '/b' },
          { label: 'C' },
        ],
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    const separators = wrapper.findAll('[aria-hidden="true"]')
    expect(separators).toHaveLength(2)
    for (const sep of separators) {
      expect(sep.text()).toBe('/')
    }
  })

  it('marks the last item as current page', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { label: 'Workspaces', to: '/workspaces' },
          { label: 'Current' },
        ],
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('Current')
  })

  it('has a nav element with breadcrumb label', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Home' }] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('breadcrumb')
  })
})

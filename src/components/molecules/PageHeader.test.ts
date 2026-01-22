import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageHeader from '@/components/molecules/PageHeader.vue'

describe('PageHeader', () => {
  it('renders title in h1 tag', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Page Title',
      },
    })

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Page Title')
  })

  it('renders description when provided', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Page Title',
        description: 'This is a page description',
      },
    })

    expect(wrapper.text()).toContain('This is a page description')
  })

  it('does not render description when not provided', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Page Title',
      },
    })

    const p = wrapper.find('p')
    expect(p.exists()).toBe(false)
  })

  it('centers content when centered prop is true', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Centered Title',
        centered: true,
      },
    })

    const div = wrapper.find('div')
    expect(div.classes()).toContain('text-center')
  })

  it('does not center content by default', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Default Title',
      },
    })

    const div = wrapper.find('div')
    expect(div.classes()).not.toContain('text-center')
  })

  it('applies proper text size classes to title', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Title',
      },
    })

    const h1 = wrapper.find('h1')
    expect(h1.classes()).toContain('text-4xl')
    expect(h1.classes()).toContain('font-bold')
  })

  it('applies proper text size classes to description', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Title',
        description: 'Description text',
      },
    })

    const p = wrapper.find('p')
    expect(p.classes()).toContain('text-lg')
  })
})

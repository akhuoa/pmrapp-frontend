import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Footer from '@/components/organisms/Footer.vue'

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          GitHubIcon: true,
        },
      },
    })

    const currentYear = new Date().getFullYear()
    expect(wrapper.text()).toContain(`Copyright 2025-${currentYear} IUPS Physiome project`)
  })

  it('renders GitHub repository links', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          GitHubIcon: true,
        },
      },
    })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('Platform')
    expect(wrapper.text()).toContain('Web App')
  })

  it('links open in new tab with proper security attributes', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          GitHubIcon: true,
        },
      },
    })

    const links = wrapper.findAll('a')
    links.forEach(link => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  it('has correct GitHub URLs', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          GitHubIcon: true,
        },
      },
    })

    const html = wrapper.html()
    expect(html).toContain('https://github.com/Physiome/pmrplatform')
    expect(html).toContain('https://github.com/Physiome/pmrapp-frontend')
  })

  it('has footer tag with appropriate styling', () => {
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          GitHubIcon: true,
        },
      },
    })

    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.classes()).toContain('bg-gray-800')
  })
})

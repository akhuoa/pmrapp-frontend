import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BackToTop from '@/components/atoms/BackToTop.vue'

describe('BackToTop', () => {
  it('does not render the button when not scrolled down', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('button has cursor-pointer class when visible', async () => {
    const wrapper = mount(BackToTop)
    // Simulate scrolling down more than 300px
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('cursor-pointer')
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CloseButton from '@/components/atoms/CloseButton.vue'

describe('CloseButton', () => {
  it('renders close button', () => {
    const wrapper = mount(CloseButton)

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(CloseButton)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toBeTruthy()
  })

  it('has proper aria-label', () => {
    const wrapper = mount(CloseButton)

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Close')
  })

  it('has button type', () => {
    const wrapper = mount(CloseButton)

    const button = wrapper.find('button')
    expect(button.attributes('type')).toBe('button')
  })

  it('displays close symbol', () => {
    const wrapper = mount(CloseButton)

    expect(wrapper.text()).toContain('✕')
  })

  it('applies hover styles via classes', () => {
    const wrapper = mount(CloseButton)

    const button = wrapper.find('button')
    expect(button.classes()).toContain('hover:opacity-70')
    expect(button.classes()).toContain('transition-opacity')
    expect(button.classes()).toContain('cursor-pointer')
  })
})

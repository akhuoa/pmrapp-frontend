import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoadingBox from '@/components/atoms/LoadingBox.vue'

describe('LoadingBox', () => {
  it('renders with default message', () => {
    const wrapper = mount(LoadingBox)

    expect(wrapper.text()).toBe('Loading...')
  })

  it('renders with custom message', () => {
    const customMessage = 'Please wait...'
    const wrapper = mount(LoadingBox, {
      props: {
        message: customMessage,
      },
    })

    expect(wrapper.text()).toBe(customMessage)
  })

  it('has box class', () => {
    const wrapper = mount(LoadingBox)

    const div = wrapper.find('div')
    expect(div.classes()).toContain('box')
  })

  it('has text-center class', () => {
    const wrapper = mount(LoadingBox)

    const div = wrapper.find('div')
    expect(div.classes()).toContain('text-center')
  })
})

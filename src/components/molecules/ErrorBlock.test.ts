import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ErrorBlock from '@/components/molecules/ErrorBlock.vue'

describe('ErrorBlock', () => {
  it('renders error title and message', () => {
    const wrapper = mount(ErrorBlock, {
      props: {
        title: 'Error Title',
        error: 'This is an error message',
      },
    })

    expect(wrapper.text()).toContain('Error Title')
    expect(wrapper.text()).toContain('This is an error message')
  })

  it('displays title in h3 tag', () => {
    const wrapper = mount(ErrorBlock, {
      props: {
        title: 'Test Error',
        error: 'Error details',
      },
    })

    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('Test Error')
  })

  it('displays error in p tag', () => {
    const wrapper = mount(ErrorBlock, {
      props: {
        title: 'Error',
        error: 'Error message content',
      },
    })

    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('Error message content')
  })

  it('has error-box class', () => {
    const wrapper = mount(ErrorBlock, {
      props: {
        title: 'Error',
        error: 'Message',
      },
    })

    const div = wrapper.find('div')
    expect(div.classes()).toContain('error-box')
  })
})

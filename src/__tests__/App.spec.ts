import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import MockDataNotification from '../components/molecules/MockDataNotification.vue'
import BackToTop from '../components/BackToTop.vue'

describe('App', () => {
  it('mounts and renders the main layout components', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<div class="router-view-stub"></div>' },
        },
      },
    })
    expect(wrapper.findComponent(MockDataNotification).exists()).toBe(true)
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
    expect(wrapper.findComponent(BackToTop).exists()).toBe(true)
  })
})

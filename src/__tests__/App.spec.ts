import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.vue'
import BackToTop from '../components/BackToTop.vue'

describe('App', () => {
  beforeEach(() => {
    // Reset all mocks before each test.
    vi.clearAllMocks()
  })

  it('mounts and renders the main layout components', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<div class="router-view-stub"></div>' },
        },
      },
    })
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
    expect(wrapper.findComponent(BackToTop).exists()).toBe(true)
  })
})

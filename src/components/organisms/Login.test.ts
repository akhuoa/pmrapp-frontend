import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from '@/components/organisms/Login.vue'
import { useAuthStore } from '@/stores/auth'

// Mock services
const mockLogin = vi.fn()
vi.mock('@/services', () => ({
  getAuthService: vi.fn(() => ({
    login: mockLogin,
  })),
}))

// Mock Vue Router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Login', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
  })

  it('renders login form with username and password fields', () => {
    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit"><slot /></button>',
          },
        },
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  it('shows error when submitting empty form', async () => {
    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.vm.error).toBeTruthy()
  })

  it('calls login service with username and password', async () => {
    mockLogin.mockResolvedValue('mock-token')

    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit"><slot /></button>',
          },
        },
      },
    })

    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'testpass'

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockLogin).toHaveBeenCalledWith({
      login: 'testuser',
      password: 'testpass',
    })
  })

  it('redirects to home on successful login', async () => {
    mockLogin.mockResolvedValue('mock-token')

    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit"><slot /></button>',
          },
        },
      },
    })

    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'testpass'

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit"><slot /></button>',
          },
        },
      },
    })

    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'wrongpass'

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.vm.error).toBe('Invalid credentials')
  })

  it('sets loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('token'), 100)))

    const wrapper = mount(Login, {
      global: {
        stubs: {
          ActionButton: {
            template: '<button type="submit"><slot /></button>',
          },
        },
      },
    })

    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'testpass'

    const form = wrapper.find('form')
    const submitPromise = form.trigger('submit.prevent')

    expect(wrapper.vm.isLoading).toBe(true)

    await submitPromise
    await flushPromises()

    expect(wrapper.vm.isLoading).toBe(false)
  })
})

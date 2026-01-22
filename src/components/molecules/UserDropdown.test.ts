import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UserDropdown from '@/components/molecules/UserDropdown.vue'
import { useAuthStore } from '@/stores/auth'

// Mock services
vi.mock('@/services', () => ({
  getAuthService: vi.fn(() => ({
    logout: vi.fn().mockResolvedValue(undefined),
  })),
}))

// Mock Vue Router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  RouterLink: {
    template: '<a :to="to" class="nav-link"><slot /></a>',
    props: ['to'],
  },
}))

describe('UserDropdown', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
  })

  it('shows login link when not authenticated', () => {
    authStore.isAuthenticated = false

    const wrapper = mount(UserDropdown, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          UserIcon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Log in')
  })

  it('shows user icon button when authenticated', () => {
    authStore.isAuthenticated = true

    const wrapper = mount(UserDropdown, {
      global: {
        stubs: {
          RouterLink: true,
          UserIcon: {
            template: '<svg class="user-icon"></svg>',
          },
        },
      },
    })

    expect(wrapper.find('.user-icon').exists()).toBe(true)
  })

  it('toggles dropdown when user icon is clicked', async () => {
    authStore.isAuthenticated = true

    const wrapper = mount(UserDropdown, {
      global: {
        stubs: {
          RouterLink: true,
          UserIcon: true,
        },
      },
    })

    expect(wrapper.vm.isOpen).toBe(false)

    await wrapper.find('button[aria-label="User menu"]').trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('shows logout button when dropdown is open', async () => {
    authStore.isAuthenticated = true

    const wrapper = mount(UserDropdown, {
      global: {
        stubs: {
          RouterLink: true,
          UserIcon: true,
        },
      },
    })

    await wrapper.find('button[aria-label="User menu"]').trigger('click')

    expect(wrapper.text()).toContain('Log out')
  })

  it('calls logout and redirects to home on logout click', async () => {
    const { getAuthService } = await import('@/services')
    const mockAuthService = vi.mocked(getAuthService)()

    authStore.isAuthenticated = true

    const wrapper = mount(UserDropdown, {
      global: {
        stubs: {
          RouterLink: true,
          UserIcon: true,
        },
      },
    })

    await wrapper.find('button[aria-label="User menu"]').trigger('click')

    const logoutButtons = wrapper.findAll('button')
    const logoutButton = logoutButtons.find(btn => btn.text() === 'Log out')
    await logoutButton?.trigger('click')

    await flushPromises()

    expect(mockAuthService.logout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initialises with unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.username).toBeNull()
  })

  describe('setAuth', () => {
    it('sets authenticated state in the store', () => {
      const store = useAuthStore()
      store.setAuth('test-token', 'testuser')
      expect(store.isAuthenticated).toBe(true)
      expect(store.token).toBe('test-token')
      expect(store.username).toBe('testuser')
    })

    it('persists auth token and username to localStorage', () => {
      const store = useAuthStore()
      store.setAuth('test-token', 'testuser')
      expect(localStorage.getItem('auth_token')).toBe('test-token')
      expect(localStorage.getItem('username')).toBe('testuser')
    })
  })

  describe('clearAuth', () => {
    it('clears authenticated state from the store', () => {
      const store = useAuthStore()
      store.setAuth('test-token', 'testuser')
      store.clearAuth()
      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBeNull()
      expect(store.username).toBeNull()
    })

    it('removes auth token and username from localStorage', () => {
      const store = useAuthStore()
      store.setAuth('test-token', 'testuser')
      store.clearAuth()
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('username')).toBeNull()
    })
  })

  describe('initAuth', () => {
    it('restores authenticated state from localStorage', () => {
      localStorage.setItem('auth_token', 'stored-token')
      localStorage.setItem('username', 'storeduser')
      const store = useAuthStore()
      store.initAuth()
      expect(store.isAuthenticated).toBe(true)
      expect(store.token).toBe('stored-token')
      expect(store.username).toBe('storeduser')
    })

    it('remains unauthenticated when localStorage has no stored credentials', () => {
      const store = useAuthStore()
      store.initAuth()
      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBeNull()
      expect(store.username).toBeNull()
    })

    it('clears authenticated state when localStorage credentials are removed (cross-tab logout)', () => {
      const store = useAuthStore()
      store.setAuth('test-token', 'testuser')
      // Simulate another tab clearing localStorage on logout.
      localStorage.removeItem('auth_token')
      localStorage.removeItem('username')
      store.initAuth()
      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBeNull()
      expect(store.username).toBeNull()
    })

    it('updates state when localStorage credentials change (cross-tab login)', () => {
      const store = useAuthStore()
      // Simulate another tab logging in and writing to localStorage.
      localStorage.setItem('auth_token', 'new-token')
      localStorage.setItem('username', 'newuser')
      store.initAuth()
      expect(store.isAuthenticated).toBe(true)
      expect(store.token).toBe('new-token')
      expect(store.username).toBe('newuser')
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Cookie } from '@/utils/cookie'

// Mock cookieStore
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
}

global.cookieStore = mockCookieStore as any

describe('cookie', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Cookie.get', () => {
    it('returns cookie value when cookie exists', async () => {
      mockCookieStore.get.mockResolvedValue({ value: 'test-value' })

      const result = await Cookie.get('test-cookie')

      expect(result).toBe('test-value')
      expect(mockCookieStore.get).toHaveBeenCalledWith('test-cookie')
    })

    it('returns null when cookie does not exist', async () => {
      mockCookieStore.get.mockResolvedValue(null)

      const result = await Cookie.get('nonexistent-cookie')

      expect(result).toBeNull()
    })

    it('returns null when cookie value is undefined', async () => {
      mockCookieStore.get.mockResolvedValue({ value: undefined })

      const result = await Cookie.get('test-cookie')

      expect(result).toBeNull()
    })
  })

  describe('Cookie.set', () => {
    it('sets cookie with correct parameters', async () => {
      const mockDate = new Date('2024-01-01T00:00:00.000Z')
      vi.setSystemTime(mockDate)

      await Cookie.set('test-cookie', 'test-value', 7)

      const expectedExpires = new Date(mockDate.getTime() + 7 * 24 * 60 * 60 * 1000)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'test-cookie',
        value: 'test-value',
        expires: expectedExpires.getTime(),
        path: '/',
      })

      vi.useRealTimers()
    })

    it('calculates expiry correctly for different day counts', async () => {
      const mockDate = new Date('2024-01-01T00:00:00.000Z')
      vi.setSystemTime(mockDate)

      await Cookie.set('test-cookie', 'value', 30)

      const expectedExpires = new Date(mockDate.getTime() + 30 * 24 * 60 * 60 * 1000)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'test-cookie',
        value: 'value',
        expires: expectedExpires.getTime(),
        path: '/',
      })

      vi.useRealTimers()
    })
  })
})

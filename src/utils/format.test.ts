import { describe, expect, it } from 'vitest'
import { formatDate, formatFileCount, formatNumber } from '@/utils/format'

describe('format', () => {
  describe('formatNumber', () => {
    it('formats numbers with comma separators', () => {
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(100)).toBe('100')
    })

    it('formats zero correctly', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('formats negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234')
    })

    it('formats single digit numbers', () => {
      expect(formatNumber(5)).toBe('5')
    })
  })

  describe('formatDate', () => {
    it('formats Unix timestamp to readable date', () => {
      // January 1, 2024 00:00:00 UTC
      const timestamp = 1704067200
      const result = formatDate(timestamp)

      expect(result).toContain('2024')
      expect(result).toContain('January')
    })

    it('formats different timestamps correctly', () => {
      // June 15, 2024 00:00:00 UTC
      const timestamp = 1718409600
      const result = formatDate(timestamp)

      expect(result).toContain('2024')
      expect(result).toContain('June')
    })

    it('handles timestamp zero', () => {
      const result = formatDate(0)
      expect(result).toContain('1970')
    })
  })

  describe('formatFileCount', () => {
    it('formats single item', () => {
      expect(formatFileCount(1)).toBe('1 item')
    })

    it('formats multiple items', () => {
      expect(formatFileCount(5)).toBe('5 items')
      expect(formatFileCount(1234)).toBe('1,234 items')
    })

    it('returns empty string for zero', () => {
      expect(formatFileCount(0)).toBe('')
    })

    it('returns empty string for negative numbers', () => {
      expect(formatFileCount(-5)).toBe('')
    })

    it('returns empty string for null', () => {
      expect(formatFileCount(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(formatFileCount(undefined)).toBe('')
    })

    it('formats large numbers with commas', () => {
      expect(formatFileCount(10000)).toBe('10,000 items')
    })
  })
})

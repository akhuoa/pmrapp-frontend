import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mathFormatOptionsStorageService } from './mathFormatOptionsStorageService'

const STORAGE_KEY = 'math_format_options_v1'

describe('mathFormatOptionsStorageService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('load', () => {
    it('returns null when there is no saved state', () => {
      expect(mathFormatOptionsStorageService.load()).toBeNull()
    })

    it('loads saved state when payload is valid', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: true,
          options: {
            digitGrouping: false,
            greekSymbols: true,
            subscripts: true,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          digitGrouping: false,
          greekSymbols: true,
          subscripts: true,
        },
      })
    })

    it('defaults missing option fields to false', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: false,
          options: {
            subscripts: true,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: false,
        options: {
          digitGrouping: false,
          greekSymbols: false,
          subscripts: true,
        },
      })
    })

    it('defaults malformed option values to false', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: true,
          options: {
            digitGrouping: 1,
            greekSymbols: null,
            subscripts: 'true',
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          digitGrouping: false,
          greekSymbols: false,
          subscripts: false,
        },
      })
    })

    it('derives transformMaths from enabled options when saved transformMaths is missing', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: true,
          options: {
            digitGrouping: false,
            greekSymbols: false,
            subscripts: false,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          digitGrouping: false,
          greekSymbols: false,
          subscripts: false,
        },
      })
    })

    it('returns null when saved payload is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{broken-json')

      expect(mathFormatOptionsStorageService.load()).toBeNull()
    })

    it('returns null when localStorage throws while loading', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable')
      })

      expect(mathFormatOptionsStorageService.load()).toBeNull()
    })
  })

  describe('save', () => {
    it('writes normalised state to localStorage', () => {
      mathFormatOptionsStorageService.save(true, {
        digitGrouping: false,
        greekSymbols: true,
        subscripts: true,
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe(
        JSON.stringify({
          transformMaths: true,
          options: {
            digitGrouping: false,
            greekSymbols: true,
            subscripts: true,
          },
        }),
      )
    })

    it('swallows localStorage errors when saving', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })

      expect(() =>
        mathFormatOptionsStorageService.save(false, {
          digitGrouping: false,
          greekSymbols: false,
          subscripts: false,
        }),
      ).not.toThrow()
    })
  })
})

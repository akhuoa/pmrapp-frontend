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
            subscript: true,
            numberFormat: false,
            greekSymbols: true,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: true,
          numberFormat: false,
          greekSymbols: true,
        },
      })
    })

    it('defaults missing option fields to false', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: false,
          options: {
            subscript: true,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: false,
        options: {
          subscript: true,
          numberFormat: false,
          greekSymbols: false,
        },
      })
    })

    it('defaults malformed option values to false', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transformMaths: true,
          options: {
            subscript: 'true',
            numberFormat: 1,
            greekSymbols: null,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: false,
          numberFormat: false,
          greekSymbols: false,
        },
      })
    })

    it('derives transformMaths from enabled options when saved transformMaths is missing', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          options: {
            subscript: false,
            numberFormat: false,
            greekSymbols: false,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: false,
          numberFormat: false,
          greekSymbols: false,
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
        subscript: true,
        numberFormat: false,
        greekSymbols: true,
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe(
        JSON.stringify({
          transformMaths: true,
          options: {
            subscript: true,
            numberFormat: false,
            greekSymbols: true,
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
          subscript: false,
          numberFormat: false,
          greekSymbols: false,
        }),
      ).not.toThrow()
    })
  })
})

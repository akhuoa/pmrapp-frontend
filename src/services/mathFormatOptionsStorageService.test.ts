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
            scientificENotation: false,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: true,
          numberFormat: false,
          greekSymbols: true,
          scientificENotation: false,
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
          scientificENotation: false,
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
            scientificENotation: 'yes',
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: false,
          numberFormat: false,
          greekSymbols: false,
          scientificENotation: false,
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
            scientificENotation: true,
          },
        }),
      )

      expect(mathFormatOptionsStorageService.load()).toEqual({
        transformMaths: true,
        options: {
          subscript: false,
          numberFormat: false,
          greekSymbols: false,
          scientificENotation: true,
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
        scientificENotation: false,
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe(
        JSON.stringify({
          transformMaths: true,
          options: {
            subscript: true,
            numberFormat: false,
            greekSymbols: true,
            scientificENotation: false,
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
          scientificENotation: false,
        }),
      ).not.toThrow()
    })
  })
})

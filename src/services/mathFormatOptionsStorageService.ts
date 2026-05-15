import type { MathMLFormatOptions } from '@/types/mathml'

const MATH_FORMAT_OPTIONS_STORAGE_KEY = 'math_format_options_v1'

type NormalisedMathFormatOptions = Required<MathMLFormatOptions>

const normaliseOptionFlag = (value: unknown): boolean => value === true

export type SavedMathFormatState = {
  transformMaths: boolean
  options: NormalisedMathFormatOptions
}

const normaliseMathFormatOptions = (
  options: Partial<MathMLFormatOptions> | null | undefined,
): NormalisedMathFormatOptions => ({
  digitGrouping: normaliseOptionFlag(options?.digitGrouping),
  greekSymbols: normaliseOptionFlag(options?.greekSymbols),
  subscripts: normaliseOptionFlag(options?.subscripts),
})

export const mathFormatOptionsStorageService = {
  load(): SavedMathFormatState | null {
    if (typeof window === 'undefined') return null

    try {
      const raw = localStorage.getItem(MATH_FORMAT_OPTIONS_STORAGE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw) as Partial<SavedMathFormatState>
      const options = normaliseMathFormatOptions(parsed.options)
      const hasEnabledOption = Object.values(options).some(Boolean)

      return {
        transformMaths:
          typeof parsed.transformMaths === 'boolean' ? parsed.transformMaths : hasEnabledOption,
        options,
      }
    } catch {
      return null
    }
  },

  save(transformMathsEnabled: boolean, options: MathMLFormatOptions) {
    if (typeof window === 'undefined') return

    const payload: SavedMathFormatState = {
      transformMaths: transformMathsEnabled,
      options: normaliseMathFormatOptions(options),
    }

    try {
      localStorage.setItem(MATH_FORMAT_OPTIONS_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore quota/storage errors to avoid blocking rendering.
    }
  },
}

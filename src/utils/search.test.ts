import { describe, expect, it } from 'vitest'
import { isValidTerm, normalizeSearchText } from '@/utils/search'

describe('isValidTerm', () => {
  it('returns false for empty string', () => {
    expect(isValidTerm('')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(isValidTerm('   ')).toBe(false)
  })

  it('returns false for incomplete pubmed URN', () => {
    expect(isValidTerm('urn:miriam:pubmed:')).toBe(false)
  })

  it('returns false for unknown author placeholder', () => {
    expect(isValidTerm('unknown')).toBe(false)
    expect(isValidTerm('unknown unknown')).toBe(false)
    expect(isValidTerm('unknown, unknown')).toBe(false)
  })

  it('returns true for valid search term', () => {
    expect(isValidTerm('O\'Hara-Rudy')).toBe(true)
    expect(isValidTerm('CiPA')).toBe(true)
    expect(isValidTerm('2017')).toBe(true)
  })
})

describe('normalizeSearchText', () => {
  it('replaces hyphens with spaces', () => {
    expect(normalizeSearchText('O\'Hara-Rudy-CiPA')).toBe('O Hara Rudy CiPA')
  })

  it('replaces single quotes with spaces', () => {
    expect(normalizeSearchText("O'Hara")).toBe('O Hara')
  })

  it('replaces double quotes with spaces', () => {
    expect(normalizeSearchText('"quoted text"')).toBe('quoted text')
  })

  it('replaces commas with spaces', () => {
    expect(normalizeSearchText('a,b,c')).toBe('a b c')
  })

  it('replaces parentheses with spaces', () => {
    expect(normalizeSearchText('model (2017)')).toBe('model 2017')
  })

  it('replaces dots with spaces', () => {
    expect(normalizeSearchText('v1.0')).toBe('v1 0')
  })

  it('collapses multiple spaces into one', () => {
    expect(normalizeSearchText('O   Hara')).toBe('O Hara')
  })

  it('trims leading and trailing whitespace', () => {
    expect(normalizeSearchText('  hello  ')).toBe('hello')
  })

  it('handles a full description string', () => {
    expect(normalizeSearchText("O'Hara-Rudy-CiPA-v1.0 (2017)")).toBe('O Hara Rudy CiPA v1 0 2017')
  })

  it('returns empty string for empty input', () => {
    expect(normalizeSearchText('')).toBe('')
  })

  it('preserves alphanumeric characters and spaces', () => {
    expect(normalizeSearchText('hello world 123')).toBe('hello world 123')
  })

  it('is case-preserving (lowercasing is left to the caller)', () => {
    expect(normalizeSearchText('CiPA')).toBe('CiPA')
    expect(normalizeSearchText('cipa')).toBe('cipa')
  })
})

describe('filter matching with normalizeSearchText', () => {
  const description = "O'Hara-Rudy-CiPA-v1.0 (2017)"

  const matches = (query: string): boolean => {
    const normalizedDesc = normalizeSearchText(description.toLowerCase())
    const normalizedQuery = normalizeSearchText(query.toLowerCase())
    const tokens = normalizedQuery.split(' ').filter((t) => t.length > 0)
    return tokens.every((token) => normalizedDesc.includes(token))
  }

  it('matches exact description', () => {
    expect(matches("O'Hara-Rudy-CiPA-v1.0 (2017)")).toBe(true)
  })

  it('matches with spaces instead of hyphens', () => {
    expect(matches('O Hara Rudy CiPA')).toBe(true)
  })

  it('matches partial query with spaces', () => {
    expect(matches('O Hara')).toBe(true)
    expect(matches('o hara rudy')).toBe(true)
    expect(matches('rudy cipa')).toBe(true)
  })

  it('matches single token', () => {
    expect(matches('cipa')).toBe(true)
    expect(matches('2017')).toBe(true)
  })

  it('matches with original hyphenated query', () => {
    expect(matches("O'Hara-Rudy-CiPA")).toBe(true)
  })

  it('matches with mixed separators in query', () => {
    expect(matches("O'Hara Rudy CiPA")).toBe(true)
  })

  it('does not match unrelated query', () => {
    expect(matches('Noble')).toBe(false)
    expect(matches('2018')).toBe(false)
  })

  it('does not match when not all tokens present', () => {
    expect(matches('Rudy Noble')).toBe(false)
  })
})

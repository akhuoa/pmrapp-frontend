import { describe, expect, it } from 'vitest'
import { filterItemsByQuery, highlightTokens, isValidTerm, normaliseSearchText } from './search'

interface TestItem {
  id: number
  text: string
}

const items: TestItem[] = [
  { id: 505, text: "O'Hara-Rudy-CiPA-v1.0 (2017)" },
  { id: 961, text: 'Mcallister, Noble, Tsien, 1975' },
  { id: 164, text: 'A 3D human whole-body model with integrated organs' },
]

describe('filterItemsByQuery', () => {
  it('returns filtered results by search text', () => {
    const results = filterItemsByQuery({
      query: 'cipa 2017',
      items,
      getSearchText: (item) => item.text,
      getIdText: (item) => item.id.toString(),
    })

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe(505)
  })

  it('returns filtered results by id', () => {
    const results = filterItemsByQuery({
      query: '505',
      items,
      getSearchText: (item) => item.text,
      getIdText: (item) => item.id.toString(),
    })

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe(505)
  })

  it('returns all items when query is empty', () => {
    const results = filterItemsByQuery({
      query: '',
      items,
      getSearchText: (item) => item.text,
      getIdText: (item) => item.id.toString(),
    })

    expect(results).toHaveLength(items.length)
  })

  it('returns count via .length', () => {
    const results = filterItemsByQuery({
      query: 'noble',
      items,
      getSearchText: (item) => item.text,
      getIdText: (item) => item.id.toString(),
    })

    expect(results.length).toBe(1)
  })
})

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
    expect(isValidTerm("O'Hara-Rudy")).toBe(true)
    expect(isValidTerm('CiPA')).toBe(true)
    expect(isValidTerm('2017')).toBe(true)
  })
})

describe('normaliseSearchText', () => {
  it('replaces hyphens with spaces', () => {
    expect(normaliseSearchText("O'Hara-Rudy-CiPA")).toBe('O Hara Rudy CiPA')
  })

  it('replaces single quotes with spaces', () => {
    expect(normaliseSearchText("O'Hara")).toBe('O Hara')
  })

  it('replaces double quotes with spaces', () => {
    expect(normaliseSearchText('"quoted text"')).toBe('quoted text')
  })

  it('replaces commas with spaces', () => {
    expect(normaliseSearchText('a,b,c')).toBe('a b c')
  })

  it('replaces parentheses with spaces', () => {
    expect(normaliseSearchText('model (2017)')).toBe('model 2017')
  })

  it('replaces dots with spaces', () => {
    expect(normaliseSearchText('v1.0')).toBe('v1 0')
  })

  it('collapses multiple spaces into one', () => {
    expect(normaliseSearchText('O   Hara')).toBe('O Hara')
  })

  it('trims leading and trailing whitespace', () => {
    expect(normaliseSearchText('  hello  ')).toBe('hello')
  })

  it('handles a full description string', () => {
    expect(normaliseSearchText("O'Hara-Rudy-CiPA-v1.0 (2017)")).toBe('O Hara Rudy CiPA v1 0 2017')
  })

  it('returns empty string for empty input', () => {
    expect(normaliseSearchText('')).toBe('')
  })

  it('preserves alphanumeric characters and spaces', () => {
    expect(normaliseSearchText('hello world 123')).toBe('hello world 123')
  })

  it('is case-preserving (lowercasing is left to the caller)', () => {
    expect(normaliseSearchText('CiPA')).toBe('CiPA')
    expect(normaliseSearchText('cipa')).toBe('cipa')
  })
})

describe('filter matching with normaliseSearchText', () => {
  const description = "O'Hara-Rudy-CiPA-v1.0 (2017)"

  const matches = (query: string): boolean => {
    const normalisedDesc = normaliseSearchText(description.toLowerCase())
    const normalisedQuery = normaliseSearchText(query.toLowerCase())
    const tokens = normalisedQuery.split(' ').filter((t) => t.length > 0)
    return tokens.every((token) => normalisedDesc.includes(token))
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

describe('highlightTokens', () => {
  it('highlights exact matched substring without index drift', () => {
    const segments = highlightTokens('Yasuhara', ['hara'])
    const highlightedText = segments.filter((s) => s.highlighted).map((s) => s.text)
    expect(highlightedText).toEqual(['hara'])
  })

  it('highlights expected substring in longer word', () => {
    const segments = highlightTokens('Vetharaniam', ['hara'])
    const highlightedText = segments.filter((s) => s.highlighted).map((s) => s.text)
    expect(highlightedText).toEqual(['hara'])
  })

  it('returns non-highlighted whole text when no token matches', () => {
    const segments = highlightTokens('Yasuhara', ['noble'])
    expect(segments).toEqual([{ text: 'Yasuhara', highlighted: false }])
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SearchQueryRequest, SearchResult } from '@/types/search'

const { mockSearchQuery } = vi.hoisted(() => ({
  mockSearchQuery: vi.fn<(search: SearchQueryRequest) => Promise<{ results: SearchResult[] }>>(),
}))

vi.mock('@/services', () => ({
  getSearchService: () => ({
    searchQuery: mockSearchQuery,
  }),
}))

import { useSearchStore } from './search'

const buildResult = (resourcePath: string): SearchResult => ({
  resource_path: resourcePath,
  data: {
    aliased_uri: [],
    cellml_keyword: [],
    commit_authored_ts: [],
    created_ts: [],
    description: [],
    exposure_alias: [],
    citation_author_family_name: [],
    citation_id: [],
    model_author: [],
  },
})

describe('useSearchStore searchQuery', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockSearchQuery.mockReset()
  })

  it('supports query-only payloads', async () => {
    const store = useSearchStore()
    const results = [buildResult('/r/query-only')]
    mockSearchQuery.mockResolvedValue({ results })

    const payload: SearchQueryRequest = { query: 'query only' }
    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith(payload)
    expect(response).toEqual(results)
  })

  it('passes query+filters payload through to the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: 'combined query',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    }
    const results = [buildResult('/r/combined')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith(payload)
    expect(response).toEqual(results)
  })

  it('trims query and filter values before calling the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: '  combined query  ',
      filters: [{ kind: '  cellml_keyword  ', term: '  action-potential  ' }],
    }
    const results = [buildResult('/r/trimmed')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      query: 'combined query',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    })
    expect(response).toEqual(results)
  })

  it('replaces unsupported special characters in query values before calling the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: "  Noble (1962) Bhalla & Iyengar O'Hara-Rudy ca2+ ca2 +  ",
      filters: [{ kind: '  cellml_keyword  ', term: '  action-potential  ' }],
    }
    const results = [buildResult('/r/sanitised-query')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      query: 'Noble 1962 Bhalla Iyengar O Hara Rudy ca2+ ca2',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    })
    expect(response).toEqual(results)
  })

  it('preserves plus only for tokens with two or more characters', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: 'ca2+ ca+ c+ ca 2+ Ca+/K+',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    }
    const results = [buildResult('/r/plus-token-length')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      query: 'ca2+ ca+ c ca 2 Ca+ K',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    })
    expect(response).toEqual(results)
  })

  it('does not alter literal placeholder text in query values', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: 'PMRSEARCHPLUSPLACEHOLDER ca2+ ca2 +',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    }
    const results = [buildResult('/r/placeholder-literal')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      query: 'PMRSEARCHPLUSPLACEHOLDER ca2+ ca2',
      filters: [{ kind: 'cellml_keyword', term: 'action-potential' }],
    })
    expect(response).toEqual(results)
  })

  it('supports filters-only payloads', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      filters: [{ kind: 'model_author', term: 'Noble' }],
    }
    const results = [buildResult('/r/filters-only')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith(payload)
    expect(response).toEqual(results)
  })

  it('omits empty query values before calling the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: '',
      filters: [{ kind: 'model_author', term: 'Noble' }],
    }
    const results = [buildResult('/r/filters-only')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      filters: [{ kind: 'model_author', term: 'Noble' }],
    })
    expect(response).toEqual(results)
  })

  it('omits whitespace-only query values before calling the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: '   ',
      filters: [{ kind: 'model_author', term: 'Noble' }],
    }
    const results = [buildResult('/r/filters-only')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      filters: [{ kind: 'model_author', term: 'Noble' }],
    })
    expect(response).toEqual(results)
  })

  it('omits query values that become empty after sanitisation', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: ' () & - ',
      filters: [{ kind: 'model_author', term: 'Noble' }],
    }
    const results = [buildResult('/r/filters-only')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      filters: [{ kind: 'model_author', term: 'Noble' }],
    })
    expect(response).toEqual(results)
  })

  it('filters out invalid filters before calling the service', async () => {
    const store = useSearchStore()
    const payload: SearchQueryRequest = {
      query: 'valid query',
      filters: [
        { kind: 'model_author', term: 'Noble' },
        { kind: '', term: 'invalid' },
        { kind: 'invalid', term: '' },
      ],
    }
    const results = [buildResult('/r/filtered-filters')]
    mockSearchQuery.mockResolvedValue({ results })

    const response = await store.searchQuery(payload)

    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith({
      query: 'valid query',
      filters: [{ kind: 'model_author', term: 'Noble' }],
    })
    expect(response).toEqual(results)
  })

  it('uses separate cache entries for distinct filters', async () => {
    const store = useSearchStore()
    const resultA = [buildResult('/r/filter-a')]
    const resultB = [buildResult('/r/filter-b')]

    mockSearchQuery.mockImplementation(async (search) => {
      const term = search.filters?.[0]?.term
      return { results: term === 'a' ? resultA : resultB }
    })

    const payloadA: SearchQueryRequest = {
      query: 'same query',
      filters: [{ kind: 'cellml_keyword', term: 'a' }],
    }
    const payloadB: SearchQueryRequest = {
      query: 'same query',
      filters: [{ kind: 'cellml_keyword', term: 'b' }],
    }

    const first = await store.searchQuery(payloadA)
    const second = await store.searchQuery(payloadA)
    const third = await store.searchQuery(payloadB)

    expect(first).toEqual(resultA)
    expect(second).toEqual(resultA)
    expect(third).toEqual(resultB)
    expect(mockSearchQuery).toHaveBeenCalledTimes(2)
    expect(mockSearchQuery).toHaveBeenNthCalledWith(1, payloadA)
    expect(mockSearchQuery).toHaveBeenNthCalledWith(2, payloadB)
  })

  it('reuses the cache for semantically identical trimmed searches', async () => {
    const store = useSearchStore()
    const results = [buildResult('/r/trimmed-cache')]
    mockSearchQuery.mockResolvedValue({ results })

    const paddedPayload: SearchQueryRequest = {
      query: '  same query  ',
      filters: [{ kind: '  cellml_keyword  ', term: '  a  ' }],
    }
    const trimmedPayload: SearchQueryRequest = {
      query: 'same query',
      filters: [{ kind: 'cellml_keyword', term: 'a' }],
    }

    const first = await store.searchQuery(paddedPayload)
    const second = await store.searchQuery(trimmedPayload)

    expect(first).toEqual(results)
    expect(second).toEqual(results)
    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith(trimmedPayload)
  })

  it('reuses the cache for semantically identical sanitised queries', async () => {
    const store = useSearchStore()
    const results = [buildResult('/r/sanitised-cache')]
    mockSearchQuery.mockResolvedValue({ results })

    const unsanitisedPayload: SearchQueryRequest = {
      query: '  Noble (1962)  ',
      filters: [{ kind: 'cellml_keyword', term: 'a' }],
    }
    const sanitisedPayload: SearchQueryRequest = {
      query: 'Noble 1962',
      filters: [{ kind: 'cellml_keyword', term: 'a' }],
    }

    const first = await store.searchQuery(unsanitisedPayload)
    const second = await store.searchQuery(sanitisedPayload)

    expect(first).toEqual(results)
    expect(second).toEqual(results)
    expect(mockSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSearchQuery).toHaveBeenCalledWith(sanitisedPayload)
  })
})

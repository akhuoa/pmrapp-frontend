import type {
  IndexesResponse,
  IndexKindResponse,
  IndexSearchResult,
  SearchQueryRequest,
  SearchQueryResponse,
} from '@/types/search'

export const searchService = {
  async getIndexes(): Promise<IndexesResponse> {
    const response = await fetch('/api/search/indexes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  },

  async getIndexKind(kind: string): Promise<IndexKindResponse> {
    const response = await fetch(`/api/search/index/${encodeURIComponent(kind)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  },

  async searchIndexTerm(kind: string, term: string): Promise<IndexSearchResult> {
    const response = await fetch(
      `/api/search/index/${encodeURIComponent(kind)}/${encodeURIComponent(term)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  },

  async searchQuery(payload: SearchQueryRequest): Promise<SearchQueryResponse> {
    const response = await fetch('/api/search/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  },
}

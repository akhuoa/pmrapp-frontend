import type {
  IndexesResponse,
  IndexKindResponse,
  IndexSearchResult,
  SearchQueryRequest,
  SearchQueryResponse,
} from '@/types/search'

export const useSearchApi = () => {
  const getIndexes = async (): Promise<IndexesResponse> => {
    return await $fetch<IndexesResponse>('/api/search/indexes')
  }

  const getIndexKind = async (kind: string): Promise<IndexKindResponse> => {
    return await $fetch<IndexKindResponse>(`/api/search/index/${encodeURIComponent(kind)}`)
  }

  const searchIndexTerm = async (kind: string, term: string): Promise<IndexSearchResult> => {
    return await $fetch<IndexSearchResult>(
      `/api/search/index/${encodeURIComponent(kind)}/${encodeURIComponent(term)}`,
    )
  }

  const searchQuery = async (payload: SearchQueryRequest): Promise<SearchQueryResponse> => {
    return await $fetch<SearchQueryResponse>('/api/search/query', {
      method: 'POST',
      body: payload,
    })
  }

  return {
    getIndexes,
    getIndexKind,
    searchIndexTerm,
    searchQuery,
  }
}

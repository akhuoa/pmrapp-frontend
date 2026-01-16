export interface IndexesResponse {
  indexes: string[]
}

export interface KindInfo {
  id: number
  description: string
}

export interface IndexKindResponse {
  kind: KindInfo
  terms: string[]
}

export interface IndexSearchResult {
  // Define the structure based on what the API returns
  // This can be updated when you know the actual response structure
  [key: string]: unknown
}

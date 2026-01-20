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

export interface SearchResult {
  data: {
    aliased_uri: string[]
    cellml_keyword: string[]
    commit_authored_ts: string[]
    created_ts: string[]
    description: string[]
    exposure_alias: string[]
  }
  resource_path: string
}

export interface IndexSearchResult {
  kind: {
    description: string
    id: number
  }
  resource_paths: SearchResult[]
  term: string
}

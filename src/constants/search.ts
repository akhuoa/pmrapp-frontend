export const SEARCH_CATEGORIES = [
  { value: 'model_author', label: 'Model authors' },
  { value: 'citation_author_family_name', label: 'Publication authors' },
  { value: 'cellml_keyword', label: 'CellML keywords' },
  { value: 'citation_id', label: 'Publication references' },
] as const

export const SEARCH_KIND_LABEL_MAP: Record<string, string> = Object.fromEntries(
  SEARCH_CATEGORIES.map((cat) => [cat.value, cat.label])
)

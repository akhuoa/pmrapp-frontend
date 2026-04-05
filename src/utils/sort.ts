import type { SortableEntity, SortOption } from '@/types/common'
import type { SearchResult } from '@/types/search'
import { getExposureIdFromResourcePath } from '@/utils/exposure'

/**
 * Grouped sort options for dropdown with two groups: Fields and Direction
 */
export interface SortOptionGroup {
  group: string
  options: Array<{ value: string; label: string; type: 'field' | 'direction' }>
}

export const SORT_OPTIONS_GROUPED: SortOptionGroup[] = [
  {
    group: 'Fields',
    options: [
      { value: 'description', label: 'Description', type: 'field' },
      { value: 'id', label: 'ID', type: 'field' },
      { value: 'date', label: 'Date', type: 'field' },
    ],
  },
  {
    group: 'Direction',
    options: [
      { value: 'asc', label: 'Ascending', type: 'direction' },
      { value: 'desc', label: 'Descending', type: 'direction' },
    ],
  },
]

export const DEFAULT_SORT_OPTION: SortOption = 'description-asc'

/**
 * Returns true if the given runtime value is a valid SortOption.
 */
export const isValidSortOption = (value: unknown): value is SortOption => {
  if (typeof value !== 'string') {
    return false
  }

  const fields =
    SORT_OPTIONS_GROUPED.find((g) => g.group === 'Fields')?.options.map((o) => o.value) ?? []
  const directions =
    SORT_OPTIONS_GROUPED.find((g) => g.group === 'Direction')?.options.map((o) => o.value) ?? []
  return fields.some((f) => directions.some((d) => `${f}-${d}` === value))
}

/**
 * Sorting function for search results, which use a different data shape to SortableEntity.
 */
export function sortSearchResults(items: SearchResult[], sortBy: SortOption): SearchResult[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'description-asc': {
        const descA = a.data.description?.[0] ?? null
        const descB = b.data.description?.[0] ?? null

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descA.localeCompare(descB)
      }
      case 'description-desc': {
        const descA = a.data.description?.[0] ?? null
        const descB = b.data.description?.[0] ?? null

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descB.localeCompare(descA)
      }
      case 'id-asc': {
        const idA = getExposureIdFromResourcePath(a.resource_path)
        const idB = getExposureIdFromResourcePath(b.resource_path)

        if (idA === null && idB === null) return 0
        if (idA === null) return 1
        if (idB === null) return -1

        return idA - idB
      }
      case 'id-desc': {
        const idA = getExposureIdFromResourcePath(a.resource_path)
        const idB = getExposureIdFromResourcePath(b.resource_path)

        if (idA === null && idB === null) return 0
        if (idA === null) return 1
        if (idB === null) return -1

        return idB - idA
      }
      case 'date-asc': {
        const dateA = a.data.created_ts?.[0] != null ? Number(a.data.created_ts[0]) : null
        const dateB = b.data.created_ts?.[0] != null ? Number(b.data.created_ts[0]) : null

        if (dateA === null && dateB === null) return 0
        if (dateA === null) return 1
        if (dateB === null) return -1

        return dateA - dateB
      }
      case 'date-desc': {
        const dateA = a.data.created_ts?.[0] != null ? Number(a.data.created_ts[0]) : null
        const dateB = b.data.created_ts?.[0] != null ? Number(b.data.created_ts[0]) : null

        if (dateA === null && dateB === null) return 0
        if (dateA === null) return 1
        if (dateB === null) return -1

        return dateB - dateA
      }
      default:
        return 0
    }
  })
}

/**
 * Generic sorting function for entities with id, description, and created_ts.
 */
export function sortEntities<T extends SortableEntity>(items: T[], sortBy: SortOption): T[] {
  return [...items].sort((a: T, b: T) => {
    switch (sortBy) {
      case 'description-asc': {
        const descA = a.entity.description
        const descB = b.entity.description

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descA.localeCompare(descB)
      }
      case 'description-desc': {
        const descA = a.entity.description
        const descB = b.entity.description

        if (descA === null && descB === null) return 0
        if (descA === null) return 1
        if (descB === null) return -1

        return descB.localeCompare(descA)
      }
      case 'id-asc':
        return a.entity.id - b.entity.id
      case 'id-desc':
        return b.entity.id - a.entity.id
      case 'date-asc':
        return a.entity.created_ts - b.entity.created_ts
      case 'date-desc':
        return b.entity.created_ts - a.entity.created_ts
      default:
        return 0
    }
  })
}

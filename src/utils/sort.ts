import type { SortableEntity, SortOption, SortOptionConfig } from '@/types/common'

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'description-asc', label: 'Description (A-Z)' },
  { value: 'description-desc', label: 'Description (Z-A)' },
  { value: 'id-asc', label: 'ID (Ascending)' },
  { value: 'id-desc', label: 'ID (Descending)' },
  { value: 'date-asc', label: 'Date (Oldest First)' },
  { value: 'date-desc', label: 'Date (Newest First)' },
]

export const DEFAULT_SORT_OPTION: SortOption = 'description-asc'

/**
 * Generic sorting function for entities with id, description, and created_ts.
 */
export function sortEntities<T extends SortableEntity>(
  items: T[],
  sortBy: SortOption
): T[] {
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

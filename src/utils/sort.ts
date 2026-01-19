import type { SortableEntity, SortOption } from '@/types/common'

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

import { describe, expect, it } from 'vitest'
import { DEFAULT_SORT_OPTION, SORT_OPTIONS_GROUPED, sortEntities } from '@/utils/sort'
import type { SortableEntity } from '@/types/common'

describe('sort', () => {
  const mockEntities: SortableEntity[] = [
    {
      entity: {
        id: 3,
        description: 'Zebra model',
        created_ts: 1704067200, // 2024-01-01
      },
      entity_alias: 'zebra',
    },
    {
      entity: {
        id: 1,
        description: 'Apple model',
        created_ts: 1704153600, // 2024-01-02
      },
      entity_alias: 'apple',
    },
    {
      entity: {
        id: 2,
        description: null,
        created_ts: 1704240000, // 2024-01-03
      },
      entity_alias: 'no-desc',
    },
  ]

  describe('SORT_OPTIONS_GROUPED', () => {
    it('exports grouped sort options', () => {
      expect(SORT_OPTIONS_GROUPED).toBeDefined()
      expect(SORT_OPTIONS_GROUPED).toHaveLength(2)
      expect(SORT_OPTIONS_GROUPED[0].group).toBe('Fields')
      expect(SORT_OPTIONS_GROUPED[1].group).toBe('Direction')
    })

    it('has field options', () => {
      const fieldsGroup = SORT_OPTIONS_GROUPED.find(g => g.group === 'Fields')
      expect(fieldsGroup).toBeDefined()
      expect(fieldsGroup?.options.length).toBeGreaterThan(0)
    })

    it('has direction options', () => {
      const directionGroup = SORT_OPTIONS_GROUPED.find(g => g.group === 'Direction')
      expect(directionGroup).toBeDefined()
      expect(directionGroup?.options).toContainEqual({
        value: 'asc',
        label: 'Ascending',
        type: 'direction',
      })
      expect(directionGroup?.options).toContainEqual({
        value: 'desc',
        label: 'Descending',
        type: 'direction',
      })
    })
  })

  describe('DEFAULT_SORT_OPTION', () => {
    it('exports default sort option', () => {
      expect(DEFAULT_SORT_OPTION).toBe('description-asc')
    })
  })

  describe('sortEntities', () => {
    it('sorts by description ascending', () => {
      const sorted = sortEntities(mockEntities, 'description-asc')
      expect(sorted[0].entity.description).toBe('Apple model')
      expect(sorted[1].entity.description).toBe('Zebra model')
      expect(sorted[2].entity.description).toBeNull()
    })

    it('sorts by description descending', () => {
      const sorted = sortEntities(mockEntities, 'description-desc')
      expect(sorted[0].entity.description).toBe('Zebra model')
      expect(sorted[1].entity.description).toBe('Apple model')
      expect(sorted[2].entity.description).toBeNull()
    })

    it('sorts by id ascending', () => {
      const sorted = sortEntities(mockEntities, 'id-asc')
      expect(sorted[0].entity.id).toBe(1)
      expect(sorted[1].entity.id).toBe(2)
      expect(sorted[2].entity.id).toBe(3)
    })

    it('sorts by id descending', () => {
      const sorted = sortEntities(mockEntities, 'id-desc')
      expect(sorted[0].entity.id).toBe(3)
      expect(sorted[1].entity.id).toBe(2)
      expect(sorted[2].entity.id).toBe(1)
    })

    it('sorts by date ascending', () => {
      const sorted = sortEntities(mockEntities, 'date-asc')
      expect(sorted[0].entity.created_ts).toBe(1704067200)
      expect(sorted[1].entity.created_ts).toBe(1704153600)
      expect(sorted[2].entity.created_ts).toBe(1704240000)
    })

    it('sorts by date descending', () => {
      const sorted = sortEntities(mockEntities, 'date-desc')
      expect(sorted[0].entity.created_ts).toBe(1704240000)
      expect(sorted[1].entity.created_ts).toBe(1704153600)
      expect(sorted[2].entity.created_ts).toBe(1704067200)
    })

    it('handles null descriptions correctly', () => {
      const sorted = sortEntities(mockEntities, 'description-asc')
      // Null descriptions should come last
      expect(sorted[sorted.length - 1].entity.description).toBeNull()
    })

    it('does not mutate original array', () => {
      const original = [...mockEntities]
      sortEntities(mockEntities, 'id-asc')
      expect(mockEntities).toEqual(original)
    })

    it('returns new array', () => {
      const sorted = sortEntities(mockEntities, 'id-asc')
      expect(sorted).not.toBe(mockEntities)
    })
  })
})

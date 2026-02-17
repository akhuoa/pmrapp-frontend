import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SortDropdown from '@/components/molecules/SortDropdown.vue'

describe('SortDropdown', () => {
  const mockOptions = [
    {
      group: 'Fields',
      options: [
        { value: 'description', label: 'Description', type: 'field' as const },
        { value: 'id', label: 'ID', type: 'field' as const },
        { value: 'date', label: 'Date', type: 'field' as const },
      ],
    },
    {
      group: 'Direction',
      options: [
        { value: 'asc', label: 'Ascending', type: 'direction' as const },
        { value: 'desc', label: 'Descending', type: 'direction' as const },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dropdown button with current field label', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'description-asc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: {
            name: 'ActionButton',
            template: '<button><slot /></button>',
            props: ['variant', 'size', 'contentSection'],
          },
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Description')
  })
})

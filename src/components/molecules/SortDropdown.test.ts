import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SortDropdown from '@/components/molecules/SortDropdown.vue'

// Mock sort utils
vi.mock('@/utils/sort', () => ({
  SortOptionGroup: {},
}))

describe('SortDropdown', () => {
  const mockOptions = [
    {
      group: 'Fields',
      options: [
        { label: 'Created', value: 'created', type: 'field' as const },
        { label: 'Updated', value: 'updated', type: 'field' as const },
      ],
    },
    {
      group: 'Direction',
      options: [
        { label: 'Ascending', value: 'asc', type: 'direction' as const },
        { label: 'Descending', value: 'desc', type: 'direction' as const },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dropdown button', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('displays current field label', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Created')
  })

  it('toggles dropdown when button is clicked', async () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    expect(wrapper.vm.isOpen).toBe(false)

    await wrapper.find('button').trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('parses sort option into field and direction', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: true,
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    expect(wrapper.vm.currentSort).toEqual({
      field: 'created',
      direction: 'desc',
    })
  })

  it('emits update:modelValue with new field when field option is selected', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: true,
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    wrapper.vm.handleSelectOption('updated', 'field')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['updated-desc'])
  })

  it('emits update:modelValue with new direction when direction option is selected', () => {
    const wrapper = mount(SortDropdown, {
      props: {
        modelValue: 'created-desc',
        options: mockOptions,
      },
      global: {
        stubs: {
          ActionButton: true,
          ArrowUpIcon: true,
          ChevronDownIcon: true,
          CheckmarkIcon: true,
        },
      },
    })

    wrapper.vm.handleSelectOption('asc', 'direction')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['created-asc'])
  })
})

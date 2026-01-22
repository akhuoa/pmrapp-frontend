import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ListToolbar from '@/components/molecules/ListToolbar.vue'

// Mock utils/sort
vi.mock('@/utils/sort', () => ({
  DEFAULT_SORT_OPTION: 'created-desc',
  SORT_OPTIONS_GROUPED: [
    {
      group: 'Fields',
      options: [
        { label: 'Created', value: 'created', type: 'field' },
        { label: 'Updated', value: 'updated', type: 'field' },
      ],
    },
    {
      group: 'Direction',
      options: [
        { label: 'Ascending', value: 'asc', type: 'direction' },
        { label: 'Descending', value: 'desc', type: 'direction' },
      ],
    },
  ],
}))

describe('ListToolbar', () => {
  it('renders filter input with default placeholder', () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: false,
        contentSection: 'test',
      },
      global: {
        stubs: {
          ActionButton: true,
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Filter by description...')
  })

  it('renders filter input with custom placeholder', () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: false,
        contentSection: 'test',
        filterPlaceholder: 'Custom placeholder',
      },
      global: {
        stubs: {
          ActionButton: true,
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    const input = wrapper.find('input[type="search"]')
    expect(input.attributes('placeholder')).toBe('Custom placeholder')
  })

  it('emits update:filterQuery when input changes', async () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: false,
        contentSection: 'test',
      },
      global: {
        stubs: {
          ActionButton: true,
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    const input = wrapper.find('input[type="search"]')
    await input.setValue('test query')

    expect(wrapper.emitted('update:filterQuery')).toBeTruthy()
    expect(wrapper.emitted('update:filterQuery')?.[0]).toEqual(['test query'])
  })

  it('emits refresh event when refresh button is clicked', async () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: false,
        contentSection: 'test',
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('refresh')).toBeTruthy()
  })

  it('shows "Refreshing..." when isLoading is true', () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: true,
        contentSection: 'test',
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Refreshing...')
  })

  it('shows "Refresh" when isLoading is false', () => {
    const wrapper = mount(ListToolbar, {
      props: {
        filterQuery: '',
        isLoading: false,
        contentSection: 'test',
      },
      global: {
        stubs: {
          ActionButton: {
            template: '<button><slot /></button>',
          },
          RefreshIcon: true,
          SortDropdown: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Refresh')
  })
})

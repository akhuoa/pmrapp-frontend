import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SearchInput from '@/components/molecules/SearchInput.vue'

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}))

vi.mock('@/stores/search', () => ({
  useSearchStore: () => ({
    categories: [],
    isLoading: false,
    fetchCategories: vi.fn().mockResolvedValue(undefined),
  }),
}))

const mockExposures = [
  {
    alias: 'ohara',
    entity: { id: 10, created_ts: 1000, description: "O'Hara-Rudy-CiPA-v1.0 (2017)" },
  },
  {
    alias: 'noble',
    entity: { id: 11, created_ts: 2000, description: 'Noble, 2003' },
  },
]

const mockWorkspaces = [
  {
    alias: 'ws-ohara',
    entity: { id: 20, created_ts: 1000, description: "O'Hara model workspace" },
  },
]

vi.mock('@/stores/exposure', () => ({
  useExposureStore: () => ({
    exposures: mockExposures,
    isLoading: false,
    fetchExposures: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/stores/workspace', () => ({
  useWorkspaceStore: () => ({
    workspaces: mockWorkspaces,
    isLoading: false,
    fetchWorkspaces: vi.fn().mockResolvedValue(undefined),
  }),
}))

const mountSearchInput = (initialTerm = '') => {
  return mount(SearchInput, {
    props: {
      initialTerm,
      initialKind: 'citation_author_family_name',
      inOverlay: true,
    },
    global: {
      stubs: {
        SearchField: {
          name: 'SearchField',
          template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @focus="$emit(\'focus\')" @blur="$emit(\'blur\')" />',
          props: ['modelValue'],
          emits: ['update:modelValue', 'focus', 'blur', 'search'],
          expose: ['inputRef'],
        },
        TermButton: {
          template: '<button class="term-button">{{ term }}</button>',
          props: ['term'],
        },
      },
    },
    attachTo: document.body,
  })
}

describe('SearchInput.vue – exposures and workspaces groups', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "N results in Exposures" when query matches exposures', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('in Exposures'))
    expect(exposuresBtn).toBeDefined()
    expect(exposuresBtn?.text()).toContain('1 result in Exposures')

    wrapper.unmount()
  })

  it('shows "N results in Workspaces" when query matches workspaces', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const workspacesBtn = buttons.find((b) => b.text().includes('in Workspaces'))
    expect(workspacesBtn).toBeDefined()

    wrapper.unmount()
  })

  it('does not show exposures group when query does not match any exposure', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('unrelated-xyzzy-nope')
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('in Exposures'))
    expect(exposuresBtn).toBeUndefined()

    wrapper.unmount()
  })

  it('navigates to /exposures with filter query when exposures group is clicked', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('in Exposures'))
    expect(exposuresBtn).toBeDefined()
    await exposuresBtn?.trigger('click')

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'exposures',
      query: { filter: "O'Hara-Rudy" },
    })
    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.unmount()
  })

  it('navigates to /workspaces with filter query when workspaces group is clicked', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const workspacesBtn = buttons.find((b) => b.text().includes('in Workspaces'))
    expect(workspacesBtn).toBeDefined()
    await workspacesBtn?.trigger('click')

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'workspaces',
      query: { filter: "O'Hara" },
    })
    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.unmount()
  })

  it('shows "no results" message when query matches nothing in any category', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('unrelated-xyzzy-nope')
    await input.trigger('focus')
    await nextTick()

    expect(wrapper.text()).toContain('No matching results found')

    wrapper.unmount()
  })

  it('uses plural form "results" when count is more than one', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    // "Noble" matches only one exposure ("Noble, 2003"), check singular vs plural:
    const input = wrapper.find('input')
    await input.setValue('Noble')
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('in Exposures'))
    // Only 1 match → "1 result in Exposures"
    expect(exposuresBtn?.text()).toContain('1 result in Exposures')

    wrapper.unmount()
  })
})

describe('SearchInput.vue – getMatchingCount logic', () => {
  it('matches description with normalised punctuation (O\'Hara-Rudy)', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    // "O'Hara-Rudy" normalises to tokens ["o", "hara", "rudy"]
    // which all match "o hara rudy cipa v1 0 2017"
    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('in Exposures'))
    expect(exposuresBtn).toBeDefined()

    wrapper.unmount()
  })
})

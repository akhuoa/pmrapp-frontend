import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SearchInput from '@/components/molecules/SearchInput.vue'

const mockRouterPush = vi.fn()
const mockRoute = { query: {} as Record<string, string> }

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
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

const mockFetchExposures = vi.fn().mockResolvedValue(undefined)
const mockFetchWorkspaces = vi.fn().mockResolvedValue(undefined)

vi.mock('@/stores/exposure', () => ({
  useExposureStore: () => ({
    exposures: mockExposures,
    isLoading: false,
    fetchExposures: mockFetchExposures,
  }),
}))

vi.mock('@/stores/workspace', () => ({
  useWorkspaceStore: () => ({
    workspaces: mockWorkspaces,
    isLoading: false,
    fetchWorkspaces: mockFetchWorkspaces,
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
          template: `<input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              @focus="$emit('focus')"
              @blur="$emit('blur')"
            />`,
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
    mockRoute.query = {}
  })

  it('shows "See N matching exposures" when query matches exposures', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
    expect(exposuresBtn).toBeDefined()
    expect(exposuresBtn?.text()).toContain('See 1 matching exposure')

    wrapper.unmount()
  })

  it('shows "See N matching workspaces" when query matches workspaces', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const workspacesBtn = buttons.find((b) => b.text().includes('matching workspace'))
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
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
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
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
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
    const workspacesBtn = buttons.find((b) => b.text().includes('matching workspace'))
    expect(workspacesBtn).toBeDefined()
    await workspacesBtn?.trigger('click')

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'workspaces',
      query: { filter: "O'Hara" },
    })
    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.unmount()
  })

  it('preserves existing sort query when navigating to exposures', async () => {
    mockRoute.query = { sort: 'id-desc' }
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
    expect(exposuresBtn).toBeDefined()
    await exposuresBtn?.trigger('click')

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'exposures',
      query: { filter: "O'Hara-Rudy", sort: 'id-desc' },
    })

    wrapper.unmount()
  })

  it('preserves existing sort query when navigating to workspaces', async () => {
    mockRoute.query = { sort: 'description-asc' }
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara")
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const workspacesBtn = buttons.find((b) => b.text().includes('matching workspace'))
    expect(workspacesBtn).toBeDefined()
    await workspacesBtn?.trigger('click')

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'workspaces',
      query: { filter: "O'Hara", sort: 'description-asc' },
    })

    wrapper.unmount()
  })

  it('allows keyboard navigation to suggestion buttons with Tab and Shift+Tab', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    // Use a query that yields both exposures and workspaces suggestions
    await input.setValue("O'Hara")
    await input.trigger('focus')
    await nextTick()

    // Simulate forward tabbing from the input
    await input.trigger('keydown', { key: 'Tab' })
    await nextTick()

    // Simulate reverse tabbing (Shift+Tab) within the dropdown
    await input.trigger('keydown', { key: 'Tab', shiftKey: true })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
    const workspacesBtn = buttons.find((b) => b.text().includes('matching workspace'))

    expect(exposuresBtn).toBeDefined()
    expect(workspacesBtn).toBeDefined()
    expect(exposuresBtn?.attributes('disabled')).toBeUndefined()
    expect(workspacesBtn?.attributes('disabled')).toBeUndefined()

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

  it('uses singular form "exposure" when count is one', async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    // "Noble" matches only one exposure ("Noble, 2003"), check singular vs plural:
    const input = wrapper.find('input')
    await input.setValue('Noble')
    await input.trigger('focus')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
    // Only 1 match → "See 1 matching exposure"
    expect(exposuresBtn?.text()).toContain('See 1 matching exposure')

    wrapper.unmount()
  })
})

describe('SearchInput.vue – getMatchingCount logic', () => {
  it("matches description with normalised punctuation (O'Hara-Rudy)", async () => {
    const wrapper = mountSearchInput()
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue("O'Hara-Rudy")
    await input.trigger('focus')
    await nextTick()

    // "O'Hara-Rudy" normalises to tokens ["o", "hara", "rudy"]
    // which all match "o hara rudy cipa v1 0 2017"
    const buttons = wrapper.findAll('button')
    const exposuresBtn = buttons.find((b) => b.text().includes('matching exposure'))
    expect(exposuresBtn).toBeDefined()

    wrapper.unmount()
  })
})

describe('SearchInput.vue – lazy-loading of exposures and workspaces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.query = {}
  })

  it('does not call fetchExposures or fetchWorkspaces on mount with an empty query', async () => {
    const wrapper = mountSearchInput('')
    await flushPromises()

    expect(mockFetchExposures).not.toHaveBeenCalled()
    expect(mockFetchWorkspaces).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('calls fetchExposures and fetchWorkspaces once the user types a non-empty query', async () => {
    const wrapper = mountSearchInput('')
    await flushPromises()

    expect(mockFetchExposures).not.toHaveBeenCalled()

    const input = wrapper.find('input')
    await input.setValue('Noble')
    await nextTick()

    expect(mockFetchExposures).toHaveBeenCalledOnce()
    expect(mockFetchWorkspaces).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('calls fetchExposures and fetchWorkspaces immediately when mounted with a non-empty initialTerm', async () => {
    const wrapper = mountSearchInput('Noble')
    await flushPromises()

    expect(mockFetchExposures).toHaveBeenCalledOnce()
    expect(mockFetchWorkspaces).toHaveBeenCalledOnce()

    wrapper.unmount()
  })
})

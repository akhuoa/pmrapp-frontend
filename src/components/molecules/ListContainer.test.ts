import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ListContainer from '@/components/molecules/ListContainer.vue'

describe('ListContainer', () => {
  it('renders error when error prop is provided', () => {
    const wrapper = mount(ListContainer, {
      props: {
        items: [],
        error: 'Something went wrong',
        errorTitle: 'Error',
        emptyMessage: 'No items',
      },
      global: {
        stubs: {
          ErrorBlock: {
            template: '<div class="error-stub">{{ title }}: {{ error }}</div>',
            props: ['title', 'error'],
          },
        },
      },
    })

    expect(wrapper.html()).toContain('Error')
    expect(wrapper.html()).toContain('Something went wrong')
  })

  it('shows loading message when isLoading is true', () => {
    const wrapper = mount(ListContainer, {
      props: {
        items: [],
        error: null,
        errorTitle: 'Error',
        emptyMessage: 'No items',
        isLoading: true,
      },
      global: {
        stubs: {
          ErrorBlock: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Loading...')
  })

  it('shows empty message when items array is empty', () => {
    const wrapper = mount(ListContainer, {
      props: {
        items: [],
        error: null,
        errorTitle: 'Error',
        emptyMessage: 'No items found',
        isLoading: false,
      },
      global: {
        stubs: {
          ErrorBlock: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No items found')
  })

  it('renders slot content when items exist', () => {
    const wrapper = mount(ListContainer, {
      props: {
        items: [{ id: 1 }, { id: 2 }],
        error: null,
        errorTitle: 'Error',
        emptyMessage: 'No items',
      },
      slots: {
        item: '<div class="item">Item content</div>',
      },
      global: {
        stubs: {
          ErrorBlock: true,
        },
      },
    })

    expect(wrapper.html()).toContain('Item content')
  })

  it('has box class when rendering items', () => {
    const wrapper = mount(ListContainer, {
      props: {
        items: [{ id: 1 }],
        error: null,
        errorTitle: 'Error',
        emptyMessage: 'No items',
      },
      global: {
        stubs: {
          ErrorBlock: true,
        },
      },
    })

    const boxDiv = wrapper.find('.box')
    expect(boxDiv.exists()).toBe(true)
  })
})

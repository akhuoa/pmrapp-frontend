import { EditorView } from '@codemirror/view'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import CodeBlock from '@/components/atoms/CodeBlock.vue'

// jsdom does not implement layout, which CodeMirror measures; provide empty rectangles.
beforeAll(() => {
  const emptyRect = () => new DOMRect(0, 0, 0, 0)
  const emptyRectList = () => [] as unknown as DOMRectList
  Range.prototype.getBoundingClientRect = emptyRect
  Range.prototype.getClientRects = emptyRectList
})

const smallCode = 'const x = 1'

const getEditorView = (wrapper: VueWrapper): EditorView => {
  const editor = wrapper.find('.cm-editor').element as HTMLElement
  const view = EditorView.findFromDOM(editor)
  if (!view) throw new Error('CodeMirror view not found')
  return view
}

describe('CodeBlock', () => {
  let wrapper: VueWrapper | null = null

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
  })

  it('renders code content in a CodeMirror editor', () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.js' },
      attachTo: document.body,
    })

    expect(wrapper.find('.cm-editor').exists()).toBe(true)
    expect(getEditorView(wrapper).state.doc.toString()).toBe(smallCode)
  })

  it('shows line numbers', () => {
    wrapper = mount(CodeBlock, {
      props: { code: 'line 1\nline 2', filename: 'example.py' },
      attachTo: document.body,
    })

    expect(wrapper.find('.cm-lineNumbers').exists()).toBe(true)
  })

  it('is read-only', () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.py' },
      attachTo: document.body,
    })

    expect(getEditorView(wrapper).state.readOnly).toBe(true)
  })

  it('updates code when props change', async () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'model.cellml' },
      attachTo: document.body,
    })

    await wrapper.setProps({ code: 'new code' })

    expect(getEditorView(wrapper).state.doc.toString()).toBe('new code')
  })

  it.each([
    ['model.cellml', 'xml'],
    ['generated.neon', 'json'],
    ['model.xul', 'xml'],
    ['data.xyz', 'plaintext'],
  ])('sets the detected language for %s to %s', (filename, expected) => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename },
      attachTo: document.body,
    })

    expect(wrapper.attributes('data-language')).toBe(expected)
  })

  it('applies syntax highlighting once the language is loaded', async () => {
    wrapper = mount(CodeBlock, {
      props: { code: '<model name="test"/>', filename: 'model.cellml' },
      attachTo: document.body,
    })

    // The language pack is imported asynchronously and the parse is time-sliced.
    await vi.waitFor(() => {
      expect(wrapper?.find('.tok-tagName').exists()).toBe(true)
      expect(wrapper?.find('.tok-attributeName').exists()).toBe(true)
    })
  })

  it('starts wrapped when startWrapped is true', () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.js', startWrapped: true },
      attachTo: document.body,
    })

    expect(wrapper.find('.cm-content').classes()).toContain('cm-lineWrapping')
  })

  it('toggles line wrapping when startWrapped changes', async () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.js' },
      attachTo: document.body,
    })

    expect(wrapper.find('.cm-content').classes()).not.toContain('cm-lineWrapping')

    await wrapper.setProps({ startWrapped: true })
    expect(wrapper.find('.cm-content').classes()).toContain('cm-lineWrapping')

    await wrapper.setProps({ startWrapped: false })
    expect(wrapper.find('.cm-content').classes()).not.toContain('cm-lineWrapping')
  })

  it('labels the code content with the filename', () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'model.cellml' },
      attachTo: document.body,
    })

    expect(wrapper.find('.cm-content').attributes('aria-label')).toBe('Code view of model.cellml')
  })

  it('destroys the editor on unmount', () => {
    wrapper = mount(CodeBlock, {
      props: { code: smallCode, filename: 'example.js' },
      attachTo: document.body,
    })

    const view = getEditorView(wrapper)
    wrapper.unmount()
    wrapper = null

    expect(view.dom.isConnected).toBe(false)
  })
})

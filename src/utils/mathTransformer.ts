// @ts-ignore - The polyfill lib might not have @types
import { _MathTransforms } from 'https://w3c.github.io/mathml-polyfills/all-polyfills.js'

let isMathPolyfillsInitialized = false
const MATH_POLYFILLS_STYLE_ATTR = 'data-math-polyfills'
const OPEN_TO_CLOSE_FENCE: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
  '⟨': '⟩',
  '⌊': '⌋',
  '⌈': '⌉',
}

const isFenceOperator = (element: Element): element is HTMLElement =>
  element.tagName.toLowerCase() === 'mo' && element.getAttribute('fence') === 'true'

const getFenceText = (element: Element): string => (element.textContent || '').trim()

const fixMismatchedFencePairs = (root: ParentNode) => {
  const rows = root.querySelectorAll('mrow')

  rows.forEach((row) => {
    const children = Array.from(row.children)
    if (children.length < 2) return

    const firstFence = children.find(isFenceOperator)
    const lastFence = [...children].reverse().find(isFenceOperator)

    if (!firstFence || !lastFence || firstFence === lastFence) return

    const openingFence = getFenceText(firstFence)
    const closingFence = getFenceText(lastFence)
    const expectedClosingFence = OPEN_TO_CLOSE_FENCE[openingFence]

    if (expectedClosingFence && closingFence && closingFence !== expectedClosingFence) {
      // Remove only the mismatched trailing fence injected by polyfills.
      lastFence.remove()
    }
  })
}

/**
 * Injects the necessary CSS for polyfills into the document head.
 */
export function initMathPolyfills() {
  if (typeof document === 'undefined' || isMathPolyfillsInitialized) {
    return
  }

  const existingStyle = document.head.querySelector(`[${MATH_POLYFILLS_STYLE_ATTR}="true"]`)
  if (existingStyle) {
    isMathPolyfillsInitialized = true
    return
  }

  const style = _MathTransforms.getCSSStyleSheet()
  style.setAttribute(MATH_POLYFILLS_STYLE_ATTR, 'true')
  document.head.appendChild(style)
  isMathPolyfillsInitialized = true
}

/**
 * Transforms a raw MathML string from an API into modern MathML Core.
 * @param rawMathML The string containing legacy <math> tags.
 */
export function transformMathString(rawMathML: string): string {
  const container = document.createElement('div')
  container.innerHTML = rawMathML

  _MathTransforms.transform(container)

  return container.innerHTML
}

/**
 * Formats a MathML string into a table structure for better rendering.
 * @param rawMathML The string containing updated <math> tags.
 * @returns The formatted MathML string.
 */
export const formatMathMLTable = (rawMathML: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawMathML, 'text/html')
  const mathBlocks = doc.querySelectorAll('math')

  mathBlocks.forEach((math) => {
    fixMismatchedFencePairs(math)

    const rows = Array.from(math.children).filter(
      (child) => child.tagName.toLowerCase() === 'mrow',
    )

    if (rows.length > 1) {
      const mtable = doc.createElement('mtable')
      mtable.setAttribute('columnalign', 'right center left')
      mtable.setAttribute('rowspacing', '0.75em')

      rows.forEach((row) => {
        const mtr = doc.createElement('mtr')

        Array.from(row.childNodes).forEach((node) => {
          const mtd = doc.createElement('mtd')
          mtd.appendChild(node)
          mtr.appendChild(mtd)
        })

        mtable.appendChild(mtr)
        row.remove()
      })

      math.appendChild(mtable)
    }
  })

  return doc.body.innerHTML
}

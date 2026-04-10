// @ts-ignore - The polyfill lib might not have @types
import { _MathTransforms } from 'https://w3c.github.io/mathml-polyfills/all-polyfills.js'

let isMathPolyfillsInitialized = false
const MATH_POLYFILLS_STYLE_ATTR = 'data-math-polyfills'

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
    const rows = Array.from(math.children).filter((child) => child.tagName === 'mrow')

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

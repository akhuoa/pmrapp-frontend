import { _MathTransforms as mathPolyfills } from '../vendor/mathml-polyfills/all-polyfills-bundle.js'

let sharedDOMParser: DOMParser | null = null

const getDOMParser = (): DOMParser => {
  if (!sharedDOMParser) {
    sharedDOMParser = new DOMParser()
  }
  return sharedDOMParser
}

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
const INVISIBLE_TIMES_CHAR = '\u2062'
const VISIBLE_MULTIPLICATION_DOT = '·'

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

const normalizeInvisibleTimesSeparators = (mathml: string): string =>
  mathml
    .replaceAll(INVISIBLE_TIMES_CHAR, VISIBLE_MULTIPLICATION_DOT)
    .replaceAll(/&#8290;|&#x2062;|&InvisibleTimes;/gi, VISIBLE_MULTIPLICATION_DOT)

/**
 * Injects the necessary CSS for polyfills into the document head.
 */
export async function initMathPolyfills() {
  if (typeof document === 'undefined' || isMathPolyfillsInitialized) return
  if (!mathPolyfills) return

  const existingStyle = document.head.querySelector(`[${MATH_POLYFILLS_STYLE_ATTR}="true"]`)
  if (existingStyle) {
    isMathPolyfillsInitialized = true
    return
  }

  const style = mathPolyfills.getCSSStyleSheet()
  style.setAttribute(MATH_POLYFILLS_STYLE_ATTR, 'true')
  document.head.appendChild(style)
  isMathPolyfillsInitialized = true
}

/**
 * Transforms a raw MathML string from an API into modern MathML Core.
 * @param rawMathML The string containing legacy <math> tags.
 */
export function transformMathString(rawMathML: string): string {
  if (typeof document === 'undefined') return rawMathML

  const container = document.createElement('div')
  container.innerHTML = rawMathML

  mathPolyfills?.transform(container)

  return normalizeInvisibleTimesSeparators(container.innerHTML)
}

/**
 * Formats a MathML string into a table structure for better rendering.
 * @param rawMathML The string containing updated <math> tags.
 * @returns The formatted MathML string.
 */
export const formatMathMLTable = (rawMathML: string): string => {
  if (typeof document === 'undefined') return rawMathML

  const parser = getDOMParser()
  const doc = parser.parseFromString(rawMathML, 'text/html')
  const mathBlocks = doc.querySelectorAll('math')
  const NS = 'http://www.w3.org/1998/Math/MathML'

  mathBlocks.forEach((math) => {
    fixMismatchedFencePairs(math)

    const rows = Array.from(math.children).filter((child) => child.tagName.toLowerCase() === 'mrow')

    if (rows.length) {
      const mtable = doc.createElementNS(NS, 'mtable')
      mtable.setAttribute('columnalign', 'right center left')
      mtable.setAttribute('rowspacing', '0.75em')

      rows.forEach((row) => {
        const mtr = doc.createElementNS(NS, 'mtr')

        Array.from(row.childNodes).forEach((node) => {
          const mtd = doc.createElementNS(NS, 'mtd')

          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).tagName.toLowerCase() === 'mo' &&
            ((node.textContent || '').trim() === '=' ||
              (node as Element).getAttribute('form') === 'infix')
          ) {
            mtd.setAttribute('data-math-operator', 'equals')
          }

          mtd.appendChild(node)
          mtr.appendChild(mtd)
        })

        mtable.appendChild(mtr)
        row.remove()
      })

      math.appendChild(mtable)
    }
  })

  return normalizeInvisibleTimesSeparators(doc.body.innerHTML)
}

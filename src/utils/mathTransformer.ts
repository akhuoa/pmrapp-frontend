import { _MathTransforms as mathPolyfills } from '../vendor/mathml-polyfills/all-polyfills-bundle.js'
import { formatNumber } from './format'

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
const PIECEWISE_KEYWORDS = new Set(['if', 'otherwise'])
const LOGICAL_OPERATOR_LABELS: Record<string, string> = {
  '∧': 'and',
  '∨': 'or',
  '⊻': 'xor',
  '⊕': 'xor',
  '¬': 'not',
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

const normalizeInvisibleTimesSeparators = (mathml: string): string =>
  mathml
    .replaceAll(INVISIBLE_TIMES_CHAR, VISIBLE_MULTIPLICATION_DOT)
    .replaceAll(/&#8290;|&#x2062;|&InvisibleTimes;/gi, VISIBLE_MULTIPLICATION_DOT)

const copyElementAttributes = (from: Element, to: Element) => {
  Array.from(from.attributes).forEach((attribute) => {
    to.setAttribute(attribute.name, attribute.value)
  })
}

const normalizeUnderscoreIdentifiers = (root: ParentNode) => {
  const identifiers = Array.from(root.querySelectorAll('mi'))

  identifiers.forEach((identifier) => {
    if (identifier.children.length > 0) return

    const rawText = (identifier.textContent || '').trim()
    if (!rawText.includes('_')) return

    const parts = rawText.split('_').map((part) => part.trim()).filter(Boolean)
    if (parts.length < 2) return

    const doc = identifier.ownerDocument
    const namespace = identifier.namespaceURI || 'http://www.w3.org/1998/Math/MathML'
    const createIdentifier = (text: string) => {
      const mi = doc.createElementNS(namespace, 'mi')
      mi.textContent = text
      return mi
    }

    const baseIdentifier = createIdentifier(parts[0] || '')
    copyElementAttributes(identifier, baseIdentifier)

    let current: Element = doc.createElementNS(namespace, 'msub')
    current.appendChild(baseIdentifier)
    current.appendChild(createIdentifier(parts[1] || ''))

    parts.slice(2).forEach((part) => {
      const next = doc.createElementNS(namespace, 'msub')
      next.appendChild(current)
      next.appendChild(createIdentifier(part))
      current = next
    })

    identifier.replaceWith(current)
  })
}

const normalizeLogicalOperators = (root: ParentNode) => {
  const operators = Array.from(root.querySelectorAll('mo'))

  operators.forEach((operator) => {
    if (operator.children.length > 0) return

    const normalizedText = (operator.textContent || '').trim()
    const replacement = LOGICAL_OPERATOR_LABELS[normalizedText]
    if (!replacement) return

    operator.textContent = replacement
  })
}

const normalizeNumericLiterals = (root: ParentNode) => {
  const numerals = Array.from(root.querySelectorAll('mn'))

  numerals.forEach((numeral) => {
    if (numeral.children.length > 0) return

    const rawText = (numeral.textContent || '').trim()
    if (!/^-?\d+$/.test(rawText)) return

    const parsed = Number(rawText)
    if (!Number.isInteger(parsed) || Math.abs(parsed) < 1000) return

    numeral.textContent = formatNumber(parsed)
  })
}

const isMathMLElement = (node: Node, tagName: string): node is Element =>
  node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === tagName

const normalizePiecewiseTables = (root: ParentNode, doc: Document, namespace: string) => {
  const mathTables = Array.from(root.querySelectorAll('mtable'))

  mathTables.forEach((table) => {
    const rows = Array.from(table.children).filter((child) => child.tagName.toLowerCase() === 'mtr')
    if (!rows.length) return

    let hasPiecewiseRows = false

    rows.forEach((row) => {
      const rowCells = Array.from(row.children).filter((child) => child.tagName.toLowerCase() === 'mtd')
      if (rowCells.length !== 1) return

      const [singleCell] = rowCells
      if (!singleCell) return

      const cellNodes = Array.from(singleCell.childNodes)
      const keywordIndex = cellNodes.findIndex(
        (node) =>
          isMathMLElement(node, 'mtext') &&
          PIECEWISE_KEYWORDS.has((node.textContent || '').trim().toLowerCase()),
      )

      if (keywordIndex <= 0) return

      hasPiecewiseRows = true

      const expressionCell = doc.createElementNS(namespace, 'mtd')
      expressionCell.setAttribute('data-math-piecewise', 'expression')

      cellNodes.slice(0, keywordIndex).forEach((node) => {
        expressionCell.appendChild(node)
      })

      const keywordCell = doc.createElementNS(namespace, 'mtd')
      keywordCell.setAttribute('data-math-piecewise', 'keyword')

      const keywordNode = cellNodes[keywordIndex]
      const keywordText = (keywordNode?.textContent || '').trim().toLowerCase()
      if (keywordText) {
        keywordCell.setAttribute('data-math-piecewise-keyword', keywordText)
      }
      if (keywordNode) {
        keywordCell.appendChild(keywordNode)
      }

      const conditionCell = doc.createElementNS(namespace, 'mtd')
      conditionCell.setAttribute('data-math-piecewise', 'condition')
      cellNodes.slice(keywordIndex + 1).forEach((node) => {
        conditionCell.appendChild(node)
      })

      while (row.firstChild) {
        row.removeChild(row.firstChild)
      }

      row.appendChild(expressionCell)
      row.appendChild(keywordCell)
      row.appendChild(conditionCell)
    })

    if (hasPiecewiseRows) {
      table.setAttribute('data-math-piecewise', 'true')
      table.setAttribute('columnalign', 'right left left')
    }
  })
}

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
    normalizeUnderscoreIdentifiers(math)
    normalizeLogicalOperators(math)
    normalizeNumericLiterals(math)

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

    normalizePiecewiseTables(math, doc, NS)
  })

  return normalizeInvisibleTimesSeparators(doc.body.innerHTML)
}

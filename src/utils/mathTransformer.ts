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

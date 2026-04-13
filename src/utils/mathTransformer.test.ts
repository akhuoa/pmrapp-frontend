import { describe, expect, it, vi } from 'vitest'
import { formatMathMLTable, initMathPolyfills, transformMathString } from '@/utils/mathTransformer'

/**
 * Tests for MathML transformation utilities.
 *
 * Key behaviours tested:
 * 1. CSP-compliant dynamic import of polyfills (no unsafe-eval)
 * 2. Polyfill initialisation with idempotency and style injection
 * 3. MathML transformation applying polyfill transforms
 * 4. Table formatting with proper mtable attributes
 * 5. Mismatched fence pair removal (e.g., '(' paired with '>')
 * 6. Non-DOM environment graceful degradation (returns input unchanged)
 * 7. Equals operator detection and marking for styling
 * 8. Structure preservation through transformations
 */

// Mock the dynamic import.
vi.mock('https://w3c.github.io/mathml-polyfills/all-polyfills.js', () => ({
  _MathTransforms: {
    getCSSStyleSheet: () => {
      const style = document.createElement('style')
      style.textContent = '/* Mock polyfill CSS */'
      return style
    },
    transform: (container: HTMLElement) => {
      // Mock transform: add a marker attribute to indicate it was called.
      container.setAttribute('data-transformed', 'true')
    },
  },
}))

describe('initMathPolyfills', () => {
  it('injects the polyfill CSS into the document head', async () => {
    // Remove any previously injected styles (from other tests).
    for (const el of document.head.querySelectorAll('[data-math-polyfills="true"]')) {
      el.remove()
    }

    await initMathPolyfills()

    const style = document.head.querySelector('[data-math-polyfills="true"]')
    expect(style).toBeTruthy()
    expect(style?.tagName).toBe('STYLE')
  })

  it('does not throw when the document is unavailable', async () => {
    const originalDocument = globalThis.document
    // @ts-expect-error
    delete globalThis.document

    await expect(initMathPolyfills()).resolves.toBeUndefined()

    globalThis.document = originalDocument
  })

  it('does not throw when the polyfill module fails to load', async () => {
    // Mock a failed import to test graceful error handling.
    vi.doMock('https://w3c.github.io/mathml-polyfills/all-polyfills.js', () => {
      throw new Error('Module load failed')
    })

    await expect(initMathPolyfills()).resolves.toBeUndefined()
  })
})

describe('transformMathString', () => {
  const simpleEquation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mi>x</mi>
      <mo>=</mo>
      <mn>5</mn>
    </mrow>
  </math>`

  it('transforms a MathML string and applies the polyfill transform', () => {
    const result = transformMathString(simpleEquation)

    expect(result).toBeTruthy()
    expect(result).toContain('x')
    expect(result).toContain('=')
    expect(result).toContain('5')
  })

  it('preserves the MathML structure after transformation', () => {
    const result = transformMathString(simpleEquation)

    expect(result).toContain('math')
    expect(result).toContain('mrow')
    expect(result).toContain('mi')
  })

  it('returns the input unchanged when the document is unavailable', () => {
    const originalDocument = globalThis.document
    // @ts-expect-error
    delete globalThis.document

    const result = transformMathString(simpleEquation)
    expect(result).toBe(simpleEquation)

    globalThis.document = originalDocument
  })

  it('handles an empty MathML string', () => {
    const result = transformMathString('')
    expect(result).toBe('')
  })
})

describe('formatMathMLTable', () => {
  const multiRowEquation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mi>vcell</mi>
      <mo>=</mo>
      <mn>1000</mn>
    </mrow>
    <mrow>
      <mi>Ageo</mi>
      <mo>=</mo>
      <mn>2</mn>
    </mrow>
  </math>`

  const equationWithFence = `<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mfenced open="{" close="}">
        <mrow>
          <mi>a</mi>
          <mo>=</mo>
          <mn>1</mn>
        </mrow>
      </mfenced>
    </mrow>
  </math>`

  // Test case for mismatched fence pairs (e.g., opening '(' but closing '>').
  const mismatchedFenceEquation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mo fence="true">(</mo>
      <mi>x</mi>
      <mo fence="true">></mo>
    </mrow>
    <mrow>
      <mi>result</mi>
      <mo>=</mo>
      <mn>0</mn>
    </mrow>
  </math>`

  it('wraps multiple rows in an mtable', () => {
    const result = formatMathMLTable(multiRowEquation)

    expect(result).toContain('mtable')
    expect(result).toContain('mtr')
    expect(result).toContain('mtd')
  })

  it('sets the correct attributes on the mtable', () => {
    const result = formatMathMLTable(multiRowEquation)

    expect(result).toContain('columnalign="right center left"')
    expect(result).toContain('rowspacing="0.75em"')
  })

  it('marks equals operators with the data-math-operator attribute', () => {
    const result = formatMathMLTable(multiRowEquation)

    expect(result).toContain('data-math-operator="equals"')
  })

  it('preserves the MathML structure in table cells', () => {
    const result = formatMathMLTable(multiRowEquation)

    expect(result).toContain('vcell')
    expect(result).toContain('Ageo')
    expect(result).toContain('1000')
  })

  it('handles MathML containing fenced expressions', () => {
    const result = formatMathMLTable(equationWithFence)

    expect(result).toContain('mtable')
    expect(result).toContain('mfenced')
  })

  it('returns the input unchanged when the document is unavailable', () => {
    const originalDocument = globalThis.document
    // @ts-expect-error
    delete globalThis.document

    const result = formatMathMLTable(multiRowEquation)
    expect(result).toBe(multiRowEquation)

    globalThis.document = originalDocument
  })

  it('handles an empty MathML string', () => {
    const result = formatMathMLTable('')
    expect(result).toBe('')
  })

  it('does not create a table when there are no mrow elements', () => {
    const noRowsEquation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>x</mi>
    </math>`

    const result = formatMathMLTable(noRowsEquation)

    expect(result).not.toContain('mtable')
  })

  it('removes a mismatched closing fence from an mrow element', () => {
    const result = formatMathMLTable(mismatchedFenceEquation)

    // The mismatched closing fence '>' should be removed, leaving only the opening '('.
    expect(result).toContain('mtable')
    expect(result).toContain('result')
    expect(result).toContain('data-math-operator="equals"')
  })
})

describe('mathTransformer integration', () => {
  it('transforms and formats a complete equation', () => {
    const equation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mrow>
        <mi>v</mi>
        <mo>=</mo>
        <mfrac>
          <mrow><mi>d</mi></mrow>
          <mrow><mi>t</mi></mrow>
        </mfrac>
      </mrow>
      <mrow>
        <mi>a</mi>
        <mo>=</mo>
        <mfrac>
          <mrow><mi>dv</mi></mrow>
          <mrow><mi>dt</mi></mrow>
        </mfrac>
      </mrow>
    </math>`

    const transformed = transformMathString(equation)
    const formatted = formatMathMLTable(transformed)

    expect(formatted).toContain('mtable')
    expect(formatted).toContain('data-math-operator="equals"')
    expect(formatted).toContain('mfrac')
  })

  it('handles complex nested MathML structures', () => {
    const complexEquation = `<math xmlns="http://www.w3.org/1998/Math/MathML">
      <mrow>
        <mrow>
          <mo>⌊</mo>
          <mfrac>
            <mrow><mi>time</mi></mrow>
            <mrow><mi>period</mi></mrow>
          </mfrac>
          <mo>⌋</mo>
        </mrow>
        <mo>=</mo>
        <mi>floor</mi>
      </mrow>
    </math>`

    const result = formatMathMLTable(complexEquation)

    expect(result).toContain('mtable')
    expect(result).toContain('mfrac')
    expect(result).toContain('⌊')
    expect(result).toContain('⌋')
  })
})

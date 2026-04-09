interface MathJaxGlobal {
  startup?: {
    typeset?: boolean
  }
  typesetClear?: (elements?: Element[]) => void
  typesetPromise?: (elements?: Element[]) => Promise<void>
}

declare global {
  interface Window {
    MathJax?: MathJaxGlobal
  }
}

export const loadMathJax = (): Promise<void> => {
  return new Promise((resolve) => {
    const scriptId = 'mathjax-script'

    if (window.MathJax?.typesetPromise) {
      resolve()
      return
    }

    if (document.getElementById(scriptId)) {
      const checkInterval = window.setInterval(() => {
        if (window.MathJax?.typesetPromise) {
          window.clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      return
    }

    window.MathJax = {
      startup: {
        typeset: false,
      },
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/mml-chtml.js'
    script.async = true

    script.onload = () => {
      resolve()
    }

    document.head.appendChild(script)
  })
}

export const renderMathInElement = async (element: Element | null): Promise<void> => {
  if (!element || !window.MathJax) {
    return
  }

  if (!window.MathJax.typesetClear || !window.MathJax.typesetPromise) {
    return
  }

  window.MathJax.typesetClear([element])

  await window.MathJax.typesetPromise([element]).catch((err: Error) => {
    console.error('MathJax rendering failed:', err)
  })
}

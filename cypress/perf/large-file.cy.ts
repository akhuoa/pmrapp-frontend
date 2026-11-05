// Performance check for the code viewer with a large generated CellML file.
// It is not part of the regular e2e suite; run it with cypress.perf.config.ts.

const WORKSPACE_FILE_URL = '/workspace/6b0/file/a8a92308e217ac5626809237dd90a31240b22834'
const LINE_PAIRS = 80000 // About 10 MB. Increase to test larger files (the preview limit is 20 MB).

const buildLargeCellML = (): string => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<model xmlns="http://www.cellml.org/cellml/2.0#" name="big">',
  ]
  for (let i = 0; i < LINE_PAIRS; i++) {
    lines.push(`  <!-- Component ${i} comment text -->`)
    lines.push(
      `  <variable name="v_${i}" units="millivolt" initial_value="${(i * 0.37).toFixed(3)}" interface="public"/>`,
    )
  }
  lines.push('  <variable name="needle_at_the_end" units="dimensionless"/>')
  lines.push('</model>')
  return lines.join('\n')
}

type PerfWindow = Window & { __longTasks: number[]; __searchStart: number }

// The application window is extended with fields that collect measurements during the test.
const asPerfWindow = (win: Window): PerfWindow => win as unknown as PerfWindow

describe('Large file code view', () => {
  it('renders, scrolls and searches a large CellML file without freezing', () => {
    const body = buildLargeCellML()
    cy.task(
      'log',
      `file size: ${(body.length / 1024 / 1024).toFixed(2)} MB, lines: ${LINE_PAIRS * 2 + 3}`,
    )

    // Serve the generated file in place of README.md, and rename README.md to big.cellml in the
    // workspace info so the page treats it as an existing CellML file.
    cy.intercept('GET', '**/rawfile/**/big.cellml', {
      body,
      headers: { 'content-type': 'text/plain' },
    })
    cy.intercept('POST', '**/api/get_workspace_info', (req) => {
      const reqBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (reqBody.path === 'big.cellml') {
        reqBody.path = 'README.md'
        req.body = reqBody
        req.continue((res) => {
          res.body = JSON.parse(JSON.stringify(res.body).split('README.md').join('big.cellml'))
        })
      }
    })

    let start = 0
    cy.visit(`${WORKSPACE_FILE_URL}/big.cellml`, {
      onBeforeLoad(win) {
        const perfWin = asPerfWindow(win)
        start = win.performance.now()
        perfWin.__longTasks = []
        new win.PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            perfWin.__longTasks.push(Math.round(entry.duration))
        }).observe({ type: 'longtask', buffered: true })
      },
    })

    // 1. First highlighted screen.
    cy.get('.code-block .tok-tagName', { timeout: 60000 }).should('exist')
    cy.window().then((win) => {
      cy.task(
        'log',
        `time to highlighted first screen: ${Math.round(win.performance.now() - start)} ms`,
      )
      cy.task('log', `lines in the DOM: ${win.document.querySelectorAll('.cm-line').length}`)
    })

    // 2. Jump to the end of the file.
    cy.window().then((win) => {
      const scrollStart = win.performance.now()
      win.scrollTo(0, win.document.body.scrollHeight)
      cy.get('.cm-line', { timeout: 60000 })
        .contains('needle_at_the_end')
        .should('exist')
        .then(() => {
          cy.task(
            'log',
            `time to render end of file: ${Math.round(win.performance.now() - scrollStart)} ms`,
          )
        })
    })
    cy.get('.cm-line')
      .contains('needle_at_the_end')
      .parent()
      .find('.tok-attributeName', { timeout: 60000 })
      .should('exist')

    // 3. Search for the last line with the built-in search panel.
    cy.scrollTo('top')
    cy.get('.cm-line').first().click()
    cy.window().then((win) => {
      const perfWin = asPerfWindow(win)
      const tasks = [...perfWin.__longTasks].sort((a, b) => b - a)
      cy.task(
        'log',
        `long tasks before search: count=${tasks.length}, longest=${tasks.slice(0, 5).join(', ')} ms`,
      )
      perfWin.__searchStart = win.performance.now()
    })
    const searchShortcut = Cypress.platform === 'darwin' ? '{meta}f' : '{ctrl}f'
    cy.get('.cm-content').type(searchShortcut, { force: true })
    cy.get('.cm-search input[name="search"]').type('needle_at_the_end{enter}')
    cy.get('.cm-line', { timeout: 30000 }).contains('needle_at_the_end').should('be.visible')
    cy.window().then((win) => {
      const perfWin = asPerfWindow(win)
      cy.task(
        'log',
        `time from search to match: ${Math.round(win.performance.now() - perfWin.__searchStart)} ms`,
      )
      const tasks = [...perfWin.__longTasks].sort((a, b) => b - a)
      cy.task(
        'log',
        `long tasks overall: count=${tasks.length}, longest=${tasks.slice(0, 5).join(', ')} ms`,
      )
    })
  })
})

describe('Exposures Page', () => {
  beforeEach(() => {
    cy.visit('/exposures')
  })

  it('has the correct URL and title', () => {
    cy.url().should('include', '/exposures')
    cy.title().should('include', 'Exposures')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', 'Exposure listing')
  })

  it('has a description with exposure count', () => {
    cy.get('h1 + p').should('exist')
    cy.get('h1 + p').should('contain.text', 'Browse and explore all 1,106 exposures.')
  })

  it('has filter and sort functionality', () => {
    cy.get('input[type="text"][aria-label="Filter items"]').should('exist')
    cy.get('button[aria-label="Sort options"]').should('exist')
    cy.get('button').contains('Refresh').should('exist')
  })

  it('has a listing with exposure data', () => {
    cy.get('.box').should('exist')
    cy.get('.box > div').should('have.length', 1106)
  })
})

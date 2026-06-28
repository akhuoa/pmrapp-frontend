describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', 'Physiome Model Repository')
  })

  it('has a description after the <h1> tag', () => {
    cy.get('h1 + p').should('exist')
    cy.get('h1 + p').should('contain.text', 'CellML models')
  })

  it('has a document title', () => {
    cy.contains('h1', 'Physiome Model Repository')
    cy.title().should('eq', 'Physiome Model Repository')
  })

  it('displays navigation cards for Workspaces and Exposures', () => {
    cy.contains('Workspaces').should('be.visible')
    cy.contains('Exposures').should('be.visible')
  })

  it('has a keyword browser component', () => {
    cy.contains('Browse by keyword').should('be.visible')
    cy.get('[aria-label="Filter keywords"]').should('be.visible')
    cy.contains('button', '1,4,5-triphosphate').should('be.visible')
  })

  it('navigates to Workspaces page from home', () => {
    cy.contains('a', 'Workspaces').first().click()
    cy.url().should('include', '/workspaces')
  })

  it('navigates to Exposures page from home', () => {
    cy.contains('a', 'Exposures').first().click()
    cy.url().should('include', '/exposures')
  })
})

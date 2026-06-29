// https://on.cypress.io/api

describe('Navigation and Routing', () => {
  describe('Header', () => {
    it('displays header with logo and navigation links', () => {
      cy.visit('/')
      cy.get('header').should('be.visible')
      cy.get('header').contains('Workspaces')
      cy.get('header').contains('Exposures')
      cy.get('header').contains('Log in')
    })

    it('navigates to home when clicking logo', () => {
      cy.visit('/workspaces')
      cy.get('header .nav-link').first().click()
      cy.url().should('eq', Cypress.config().baseUrl)
    })

    it('navigates between pages using header links', () => {
      cy.visit('/')
      cy.get('header').contains('a', 'Workspaces').click()
      cy.url().should('include', '/workspaces')

      cy.get('header').contains('a', 'Exposures').click()
      cy.url().should('include', '/exposures')

      cy.get('header').contains('a', 'Log in').click()
      cy.url().should('include', '/login')
    })

    it('opens search dialog when clicking search icon in header', () => {
      cy.visit('/')
      cy.get('header').contains('button', 'Open search').click()

      const searchDialog = cy.get('div[role="dialog"][aria-label="Search"]')
      searchDialog.should('be.visible')
      searchDialog.contains('h2', 'Search').should('be.visible')
      searchDialog.get('button[aria-label="Close"]').should('be.visible')
      searchDialog.get('input[type="text"][aria-label="Search term"]').should('be.visible')
    })
  })

  describe('Footer', () => {
    it('displays footer with copyright information', () => {
      cy.visit('/')
      cy.get('footer').should('be.visible')
      cy.get('footer').contains('IUPS Physiome project')
      cy.get('footer').contains(new Date().getFullYear().toString())
    })

    it('footer contains GitHub repository links', () => {
      cy.visit('/')
      cy.get('footer a[href*="github.com"]').should('have.length', 2)
    })
  })
})

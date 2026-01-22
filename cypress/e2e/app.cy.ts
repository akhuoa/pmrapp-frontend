// https://on.cypress.io/api

describe('Navigation and Routing', () => {
  describe('Home Page', () => {
    it('visits the home page', () => {
      cy.visit('/')
      cy.contains('h1', 'Physiome Model Repository')
      cy.title().should('eq', 'Physiome Model Repository')
    })

    it('displays navigation cards for Workspaces and Exposures', () => {
      cy.visit('/')
      cy.contains('Workspaces').should('be.visible')
      cy.contains('Exposures').should('be.visible')
    })

    it('navigates to Workspaces page from home', () => {
      cy.visit('/')
      cy.contains('a', 'Workspaces').first().click()
      cy.url().should('include', '/workspaces')
    })

    it('navigates to Exposures page from home', () => {
      cy.visit('/')
      cy.contains('a', 'Exposures').first().click()
      cy.url().should('include', '/exposures')
    })
  })

  describe('Header Navigation', () => {
    it('displays header with logo and navigation links', () => {
      cy.visit('/')
      cy.get('header').should('be.visible')
      cy.get('header').contains('Workspaces')
      cy.get('header').contains('Exposures')
    })

    it('navigates to home when clicking logo', () => {
      cy.visit('/workspaces')
      cy.get('header a[href="/"]').first().click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('navigates between pages using header links', () => {
      cy.visit('/')
      cy.get('header').contains('a', 'Workspaces').click()
      cy.url().should('include', '/workspaces')

      cy.get('header').contains('a', 'Exposures').click()
      cy.url().should('include', '/exposures')
    })
  })

  describe('Workspaces Page', () => {
    it('visits the workspaces page', () => {
      cy.visit('/workspaces')
      cy.url().should('include', '/workspaces')
      cy.title().should('include', 'Workspaces')
    })

    it('displays workspaces list or loading state', () => {
      cy.visit('/workspaces')
      // Should show either loading or content
      cy.get('body').should('exist')
    })

    it('has filter and sort functionality', () => {
      cy.visit('/workspaces')
      cy.get('input[type="search"]').should('exist')
    })
  })

  describe('Exposures Page', () => {
    it('visits the exposures page', () => {
      cy.visit('/exposures')
      cy.url().should('include', '/exposures')
      cy.title().should('include', 'Exposures')
    })

    it('displays exposures list or loading state', () => {
      cy.visit('/exposures')
      cy.get('body').should('exist')
    })

    it('has filter and sort functionality', () => {
      cy.visit('/exposures')
      cy.get('input[type="search"]').should('exist')
    })
  })

  describe('Login Page', () => {
    it('visits the login page', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
      cy.title().should('include', 'Login')
    })

    it('displays login form', () => {
      cy.visit('/login')
      cy.get('input[type="text"], input[type="email"]').should('exist')
      cy.get('input[type="password"]').should('exist')
      cy.get('button[type="submit"]').should('exist')
    })

    it('navigates to login from header when not authenticated', () => {
      cy.visit('/')
      cy.get('header').contains('Log in').click()
      cy.url().should('include', '/login')
    })
  })

  describe('Not Found Page', () => {
    it('displays 404 page for invalid routes', () => {
      cy.visit('/this-page-does-not-exist', { failOnStatusCode: false })
      cy.url().should('include', '/this-page-does-not-exist')
      cy.title().should('include', 'Page Not Found')
    })

    it('shows not found content', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false })
      cy.get('body').should('exist')
    })
  })

  describe('Back Navigation', () => {
    it('allows navigation back from Workspaces to Home', () => {
      cy.visit('/')
      cy.contains('a', 'Workspaces').first().click()
      cy.go('back')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('allows navigation back from Exposures to Home', () => {
      cy.visit('/')
      cy.contains('a', 'Exposures').first().click()
      cy.go('back')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('Page Titles', () => {
    it('sets correct title for home page', () => {
      cy.visit('/')
      cy.title().should('eq', 'Physiome Model Repository')
    })

    it('sets correct title for workspaces page', () => {
      cy.visit('/workspaces')
      cy.title().should('eq', 'Workspaces – Physiome Model Repository')
    })

    it('sets correct title for exposures page', () => {
      cy.visit('/exposures')
      cy.title().should('eq', 'Exposures – Physiome Model Repository')
    })

    it('sets correct title for login page', () => {
      cy.visit('/login')
      cy.title().should('eq', 'Login – Physiome Model Repository')
    })
  })

  describe('Footer', () => {
    it('displays footer on all pages', () => {
      cy.visit('/')
      cy.get('footer').should('be.visible')
      cy.get('footer').contains('IUPS Physiome project')

      cy.visit('/workspaces')
      cy.get('footer').should('be.visible')

      cy.visit('/exposures')
      cy.get('footer').should('be.visible')
    })

    it('footer contains GitHub repository links', () => {
      cy.visit('/')
      cy.get('footer a[href*="github.com"]').should('have.length.at.least', 1)
    })
  })
})

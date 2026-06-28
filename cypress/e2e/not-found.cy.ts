describe('Not Found Page', () => {
  beforeEach(() => {
    cy.visit('/this-page-does-not-exist', { failOnStatusCode: false })
    cy.url().should('include', '/this-page-does-not-exist')
    cy.title().should('include', 'Page Not Found')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', '404')
  })

  it('has an <h2> tag', () => {
    cy.get('h2').should('exist')
    cy.get('h2').should('contain.text', 'Page not found')
  })

  it('has a description text', () => {
    cy.get('p').should('exist')
    cy.get('p').should('contain.text', "The page you are looking for doesn't exist or has been moved.")
  })
})

describe('Navigation from Not Found Page', () => {
  it('has a link to go back to the home page', () => {
    cy.visit('/')
    cy.visit('/this-page-does-not-exist', { failOnStatusCode: false })

    cy.get('main button').should('exist')
    cy.get('main button').should('contain.text', 'Go back')
    cy.get('main button').click()
    cy.url().should('eq', Cypress.config().baseUrl)
  })
})

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('has the correct URL and title', () => {
    cy.url().should('include', '/login')
    cy.title().should('include', 'Login')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', 'Login')
  })

  it('displays login form', () => {
    cy.get('input[type="text"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
    cy.get('button[type="submit"]').should('contain.text', 'Login')
  })
})

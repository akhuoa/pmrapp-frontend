describe('Exposure Detail Page', () => {
  beforeEach(() => {
    cy.visit('/exposures/da9')
  })

  it('has the correct URL and title', () => {
    cy.title().should('include', 'Noble, Denyer, Brown, DiFrancesco, 1992')
    cy.title().should('include', 'Physiome Model Repository')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', 'Noble, Denyer, Brown, DiFrancesco, 1992')
  })

  it('has html-view content', () => {
    cy.get('.html-view').should('exist')
  })

  it('has file browser', () => {
    cy.get('ul.divide-y').should('exist')
    cy.get('ul.divide-y > li').should('have.length', 7)
  })

  it('has source section', () => {
    cy.get('h4').contains('Source').should('exist')
  })

  it('has citation section', () => {
    cy.get('h4').contains('Citation').should('exist')
  })

  it('has views available section', () => {
    cy.get('h4').contains('Views available').should('exist')
  })

  it('has navigation section', () => {
    cy.get('h4').contains('Navigation').should('exist')
  })

  it('has downloads section', () => {
    cy.get('h4').contains('Downloads').should('exist')
  })

  it('has licence section', () => {
    cy.get('h4').contains('Licence').should('exist')
  })
})

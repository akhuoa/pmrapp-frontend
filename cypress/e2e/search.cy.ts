describe('Search Page', () => {
  beforeEach(() => {
    cy.visit('/search')
  })

  it('has the correct URL and title', () => {
    cy.url().should('include', '/search')
    cy.title().should('include', 'Search')
  })

  it('has a header component', () => {
    cy.get('header').should('be.visible')
  })

  it('has a footer component', () => {
    cy.get('footer').should('be.visible')
  })

  it('has an <h1> tag', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain.text', 'Search')
  })

  it('displays search results for a valid query', () => {
    cy.get('input[type="text"][aria-label="Search term"]').type('mnt')
    cy.get('button[aria-label="Search"]').click()
    cy.contains('5 results for mnt.').should('exist')
    cy.get('main .box > div').should('have.length', 5)

    cy.get('button[aria-label="Clear search"]').should('exist')
    cy.get('button[aria-label="Clear search"]').click()

    cy.get('button[aria-label="Advanced Search"]').contains('More...').should('exist')
    cy.get('button[aria-label="Advanced Search"]').contains('More...').click()

    cy.get('input[type="text"][aria-label="Filter search terms"]').should('exist')
    cy.get('input[type="text"][aria-label="Filter search terms"]').type('catherine')
    cy.get('button[aria-label="Search for Catherine Lloyd"]').contains('Catherine Lloyd').should('exist')
    cy.get('button[aria-label="Search for Catherine Lloyd"]').contains('Catherine Lloyd').click()

    cy.get('input[type="text"][aria-label="Filter search terms"]').clear().type('beeler')
    cy.get('button[aria-label="Search for Beeler"]').contains('Beeler').should('exist')
    cy.get('button[aria-label="Search for Beeler"]').contains('Beeler').click()

    cy.get('button[aria-label="Search"]').click()
    cy.contains('3 results for Publication author: Beeler and Model author: Catherine Lloyd.').should('exist')
    cy.get('main .box > div').should('have.length', 3)
  })
})

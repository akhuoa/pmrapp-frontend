describe('Workspace Detail Page', () => {
  beforeEach(() => {
    cy.visit('/workspaces/da8')
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

  it('has git repository section', () => {
    cy.contains('Git repository').should('exist')
    cy.get('a[href*="https://models.physiomeproject.org/workspace/da8/"]').should('exist')
  })

  it('has author section', () => {
    cy.contains('Author').should('exist')
    cy.get('a.text-link').contains('Alan Garny').should('exist')
  })

  it('has downloads section', () => {
    cy.contains('Downloads').should('exist')
    cy.get('button').contains('.zip').should('exist')
    cy.get('button').contains('.tgz').should('exist')
  })

  it('has file browser section', () => {
    cy.get('.box').contains('7 items').should('exist')
    cy.get('ul.divide-y').should('exist')
    cy.get('ul.divide-y > li').should('have.length', 7)
  })
})

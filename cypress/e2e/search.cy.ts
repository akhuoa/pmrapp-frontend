describe('Search Page', () => {
  const selectors = {
    searchInput: 'input[type="text"][aria-label="Search term"]',
    searchButton: 'button[aria-label="Search"]',
    clearSearchButton: 'button[aria-label="Clear search"]',
    advancedSearchButton: 'button[aria-label="Advanced Search"]',
    filterInput: 'input[type="text"][aria-label="Filter search terms"]',
    resultItems: 'main .box > div',
  }

  const runSearch = () => cy.get(selectors.searchButton).click()

  const expectResults = (summaryText: string, itemCount: number) => {
    cy.contains(summaryText).should('exist')
    cy.get(selectors.resultItems).should('have.length', itemCount)
  }

  const chooseAdvancedSearchTerm = (filter: string, optionLabel: string) => {
    cy.get(selectors.filterInput).clear().type(filter)
    cy.get(`button[aria-label="Search for ${optionLabel}"]`).contains(optionLabel).should('exist').click()
  }

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
    cy.get(selectors.searchInput).type('mnt')
    runSearch()
    expectResults('5 results for mnt.', 5)

    cy.get(selectors.clearSearchButton).should('exist').click()

    cy.get(selectors.advancedSearchButton).contains('More...').should('exist').click()
    cy.get(selectors.filterInput).should('exist')

    chooseAdvancedSearchTerm('catherine', 'Catherine Lloyd')
    chooseAdvancedSearchTerm('beeler', 'Beeler')

    runSearch()
    expectResults('3 results for Publication author: Beeler and Model author: Catherine Lloyd.', 3)
  })
})

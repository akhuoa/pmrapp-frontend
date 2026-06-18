import { describe, expect, it } from 'vitest'
import { formatCitation } from './citation'

describe('formatCitation', () => {
  it('formats a complete citation with authors, year, title, journal, volume, pages, publisher, and URL', () => {
    const citation = {
      authors: [
        { family: 'Doe', given: 'Jane' },
        { family: 'Smith', given: 'John' },
      ],
      issued: '2024-05-20',
      title: 'Example research article',
      journal: 'Journal of Testing',
      volume: '12',
      first_page: '34',
      last_page: '56',
      publisher: 'Test Publisher',
      url: 'https://example.com/article?query=1#section',
    }

    expect(formatCitation(citation)).toBe(
      `Doe, J., & Smith, J. (2024). Example research article. Journal of Testing, 12, 34-56. Test Publisher. ` +
        `<a href="https://example.com/article" target="_blank" rel="noopener noreferrer">https://example.com/article</a>`,
    )
  })

  it('places title before year when no author is provided', () => {
    const citation = {
      issued: '2023-01-01',
      title: 'An anonymous study',
      journal: 'Journal of Anonymous Research',
    }

    expect(formatCitation(citation)).toBe(
      'An anonymous study. (2023). Journal of Anonymous Research.',
    )
  })

  it('places year after title when there is no author and only issued and title are present', () => {
    const citation = {
      issued: '2022-12-31',
      title: 'Title without author',
    }

    expect(formatCitation(citation)).toBe('Title without author. (2022).')
  })

  it('formats year and title correctly when author list is missing but title exists', () => {
    const citation = {
      issued: '2021',
      title: 'Missing author, present title',
    }

    expect(formatCitation(citation)).toBe('Missing author, present title. (2021).')
  })

  it('formats year only when author and title are both missing', () => {
    const citation = {
      issued: '2020-07-15',
    }

    expect(formatCitation(citation)).toBe('(2020).')
  })
})

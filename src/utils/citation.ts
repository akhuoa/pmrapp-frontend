import type { Author, Citation } from '@/types/citation'

/**
 * Format an array of author names to a readable string.
 * @param authors Array of author name strings.
 * @returns Formatted author string.
 */
export const formatCitationAuthors = (authors: string[]): string => {
  return authors
    .map((author) => {
      const parts = author
      if (parts.length === 3) {
        const [lastName, firstName, middleInitial] = parts
        return middleInitial
          ? `${firstName} ${middleInitial}. ${lastName}`
          : `${firstName} ${lastName}`
      }
      return author
    })
    .join(', ')
}

/**
 * Format a citation object to APA style citation string.
 * Format: Authors (Year). Title. Journal, Volume, Pages.
 * @param citation Citation object.
 * @returns APA formatted citation string.
 */

export const formatCitation = (citation: Citation): string => {
  const parts: string[] = []

  // Format authors.
  if (citation.authors && Array.isArray(citation.authors)) {
    const authorStrings = citation.authors.map((author: Author) => {
      const family = author.family || ''
      const given = author.given || ''
      const givenInitial = given ? `${given.charAt(0).toUpperCase()}.` : ''
      const otherInitials = author.other
        ? author.other.map((name: string) => `${name.charAt(0).toUpperCase()}.`).join(' ')
        : ''
      const allInitials = [givenInitial, otherInitials].filter(Boolean).join(' ')
      return `${family}${allInitials ? `, ${allInitials}` : ''}`
    })

    if (authorStrings.length === 1) {
      parts.push(authorStrings[0] || '')
    } else if (authorStrings.length === 2) {
      parts.push(`${authorStrings[0] || ''}, & ${authorStrings[1] || ''}`)
    } else if (authorStrings.length > 2) {
      parts.push(
        `${authorStrings.slice(0, -1).join(', ')}, & ${authorStrings[authorStrings.length - 1]}`,
      )
    }
  }

  // Format year.
  if (citation.issued) {
    const year = citation.issued.split('-')[0]
    parts.push(`(${year})`)
  }

  // Format title.
  if (citation.title) {
    parts.push(`${citation.title}.`)
  }

  // Format journal.
  if (citation.journal) {
    parts.push(`${citation.journal},`)
  }

  // Format volume and pages.
  if (citation.volume) {
    let volumeSection = citation.volume
    if (citation.first_page && citation.last_page) {
      volumeSection += `, ${citation.first_page}-${citation.last_page}`
    } else if (citation.first_page) {
      volumeSection += `, ${citation.first_page}`
    }
    parts.push(`${volumeSection}.`)
  }

  return parts.join(' ')
}

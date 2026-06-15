import type { Author, Citation } from '@/types/citation'

/**
 * Format an author name array to a readable string.
 * Author parts should be [lastName, firstName?, middleInitial?].
 * @param authorParts Array of name parts for one author.
 * @returns Formatted author name string.
 */
export const formatCitationAuthor = (authorParts: string[]): string => {
  if (authorParts.length >= 2) {
    const [lastName, firstName, middleInitial] = authorParts
    return middleInitial ? `${firstName} ${middleInitial}. ${lastName}` : `${firstName} ${lastName}`
  }
  return authorParts.join(' ')
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
      const otherInitials = author.other ? `${author.other.charAt(0).toUpperCase()}.` : ''
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

/**
 * Ensure a string ends with sentence punctuation.
 * @param value Input string.
 * @returns Trimmed sentence with trailing punctuation.
 */
export const ensureSentence = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

/**
 * Remove query and hash from a URL for cleaner citation output.
 * @param url URL string.
 * @returns Normalized URL string.
 */
export const normaliseUrl = (url: string): string => {
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return trimmed.split('#')[0]?.split('?')[0] || ''
  }
}

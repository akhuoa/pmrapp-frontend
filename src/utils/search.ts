/**
 * Returns true if a search term is valid (non-empty and not a broken URN).
 * Filters out:
 * - Empty or whitespace-only strings.
 * - Incomplete URN-style terms ending with 'pubmed:' (e.g. "urn:miriam:pubmed:").
 * - Unknown author placeholders (e.g. "unknown", "unknown unknown", or "unknown, unknown").
 */
export const isValidTerm = (term: string): boolean => {
  const trimmed = term.trim()
  if (!trimmed) return false
  if (trimmed.endsWith('pubmed:')) return false
  if (/^unknown([, ]+unknown)?$/i.test(trimmed)) return false
  return true
}

/**
 * Normalizes a string for fuzzy search by replacing non-alphanumeric characters
 * (dashes, hyphens, single/double quotes, commas, parentheses, dots, etc.) with
 * spaces, then collapsing multiple consecutive spaces and trimming.
 *
 * This allows users to search with spaces in place of any special character.
 * For example, "O Hara Rudy" will match "O'Hara-Rudy-CiPA-v1.0 (2017)".
 */
export const normalizeSearchText = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

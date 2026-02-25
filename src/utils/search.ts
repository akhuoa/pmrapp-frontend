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

import { TITLE } from '@/constants/global'

/**
 * Utility function to extract the exposure ID from a resource path string.
 *
 * @param resourcePath The resource path string to extract the exposure ID from.
 * @returns The exposure ID as a number, or null if not found.
 */
export const getExposureIdFromResourcePath = (resourcePath: string): number | null => {
  const match = resourcePath.match(/\/exposure\/(\d+)\//)
  if (match?.[1]) {
    // match[1] contains the captured digits, which is the exposure ID.
    return Number(match[1])
  }
  return null
}

/**
 * Generate exposure page title from description or ID.
 *
 * @param description The description of the exposure, if available.
 * @param id The ID of the exposure, used as a fallback if description is not available.
 * @returns A string representing the title for the exposure page.
 */
export const generateExposureTitle = (description: string | null | undefined, id: number | null | undefined): string => {
  // Generic title if neither description nor ID is available.
  if (!description && !id) {
    return `Exposure Detail – ${TITLE}`
  }

  // Title using description.
  if (description && description.trim() !== '') {
    return `${description} – ${TITLE}`
  }

  // Fallback title using ID.
  return `Exposure ${id} – ${TITLE}`
}

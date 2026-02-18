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

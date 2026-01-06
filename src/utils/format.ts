/**
 * Format a number with comma separators for thousands.
 * @param num - The number to format.
 * @returns Formatted string with comma separators.
 * @example formatNumber(1234567) // "1,234,567".
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Format a Unix timestamp to a readable date string.
 * @param timestamp - Unix timestamp in seconds.
 * @returns Formatted date string (e.g., "Jan 5, 2026").
 * @example formatDate(1704499200) // "Jan 5, 2024".
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

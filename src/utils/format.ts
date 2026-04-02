/**
 * Format a number with comma separators for thousands.
 * @param num - The number to format.
 * @returns Formatted string with comma separators.
 * @example formatNumber(1234567) // "1,234,567".
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-NZ')
}

/**
 * Format a Unix timestamp to a readable date string.
 * @param timestamp - Unix timestamp in seconds.
 * @returns Formatted date string (e.g., "5 January 2026").
 * @example formatDate(1704499200) // "5 January 2024".
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a file count with formatting.
 * Returns empty string if count is zero, negative, or falsy.
 * @param count - The number of files/items.
 * @returns Formatted string like "1,234 items" or empty string if count is invalid.
 * @example formatFileCount(1) // "1 item".
 * @example formatFileCount(1234) // "1,234 items".
 * @example formatFileCount(0) // "".
 */
export function formatFileCount(count: number | undefined | null): string {
  if (!count || count <= 0) return ''
  const formatted = formatNumber(count)
  return `${formatted} ${count === 1 ? 'item' : 'items'}`
}

/**
 * Returns the ordinal suffix for a day in month.
 * @param day - Day of month.
 * @returns Ordinal suffix (st, nd, rd, th).
 */
export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

/**
 * Format a date as access date text used in citations.
 * @param date - Date object to format.
 * @returns Formatted string like "4.05pm 23rd March 2026".
 */
export function formatAccessDate(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  const timeStr = `${displayHours}.${displayMinutes}${ampm}`

  const day = date.getDate()
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const dateStr = `${day}${getOrdinalSuffix(day)} ${months[date.getMonth()]} ${date.getFullYear()}`
  return `${timeStr} ${dateStr}`
}

/**
 * License URL formatting utilities.
 */

interface LicenseMap {
  [key: string]: string
}

const LICENSE_NAMES: LicenseMap = {
  'creativecommons.org/licenses/by/3.0': 'CC BY 3.0',
  'creativecommons.org/licenses/by/4.0': 'CC BY 4.0',
  'creativecommons.org/licenses/by-sa/3.0': 'CC BY-SA 3.0',
  'creativecommons.org/licenses/by-sa/4.0': 'CC BY-SA 4.0',
  'creativecommons.org/licenses/by-nc/3.0': 'CC BY-NC 3.0',
  'creativecommons.org/licenses/by-nc/4.0': 'CC BY-NC 4.0',
  'creativecommons.org/licenses/by-nd/3.0': 'CC BY-ND 3.0',
  'creativecommons.org/licenses/by-nd/4.0': 'CC BY-ND 4.0',
  'creativecommons.org/licenses/by-nc-sa/3.0': 'CC BY-NC-SA 3.0',
  'creativecommons.org/licenses/by-nc-sa/4.0': 'CC BY-NC-SA 4.0',
  'creativecommons.org/licenses/by-nc-nd/3.0': 'CC BY-NC-ND 3.0',
  'creativecommons.org/licenses/by-nc-nd/4.0': 'CC BY-NC-ND 4.0',
  'opensource.org/licenses/MIT': 'MIT License',
  'opensource.org/licenses/Apache-2.0': 'Apache License 2.0',
  'gnu.org/licenses/gpl-3.0': 'GPL 3.0',
  'gnu.org/licenses/gpl-2.0': 'GPL 2.0',
  'gnu.org/licenses/lgpl-3.0': 'LGPL 3.0',
  'gnu.org/licenses/lgpl-2.0': 'LGPL 2.0',
  'gnu.org/licenses/agpl-3.0': 'AGPL 3.0',
  'opensource.org/licenses/BSD-2-Clause': 'BSD 2-Clause License',
  'opensource.org/licenses/BSD-3-Clause': 'BSD 3-Clause License',
}

/**
 * Format a license URL to a human-readable name.
 * @param licenseUrl The license URL.
 * @returns Human-readable license name or the original URL if not recognised.
 */
export const formatLicenseUrl = (licenseUrl: string): string => {
  if (!licenseUrl) return ''

  // Try to find a matching license in the map.
  for (const [key, name] of Object.entries(LICENSE_NAMES)) {
    if (licenseUrl.includes(key)) {
      return name
    }
  }

  // If no match is found, extract domain and path for a reasonable fallback.
  try {
    const url = new URL(licenseUrl)
    const hostname = url.hostname.replace('www.', '')
    const pathname = url.pathname.split('/').filter(Boolean).slice(-2).join(' ')
    if (pathname) {
      return `${hostname} - ${pathname}`.replace(/\//g, ' ').replace(/-/g, ' ')
    }
    return hostname
  } catch {
    // If URL parsing fails, return the original URL.
    return licenseUrl
  }
}

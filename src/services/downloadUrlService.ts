const MODELS_URL = import.meta.env.VITE_MODELS_URL

export interface ArchiveUrls {
  zip: string
  tgz: string
}

/**
 * Generate archive download URLs for a workspace.
 */
export const getArchiveDownloadUrls = (
  alias: string,
  commitId: string,
): ArchiveUrls => {
  if (!alias || !commitId) {
    return { zip: '', tgz: '' }
  }

  const base = `${MODELS_URL}/workspace/${alias}/@@archive/${commitId}`
  return {
    zip: `${base}/zip`,
    tgz: `${base}/tgz`,
  }
}

/**
 * Generate COMBINE archive download URL for an exposure.
 */
export const getCombineArchiveUrl = (exposureAlias: string): string => {
  if (!exposureAlias) {
    return ''
  }
  return `${MODELS_URL}/e/${exposureAlias}/download_generated_omex`
}

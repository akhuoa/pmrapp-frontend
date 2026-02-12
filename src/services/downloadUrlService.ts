import { downloadFileFromBlob } from '@/utils/download'

const MODELS_URL = import.meta.env.VITE_MODELS_URL
const DOWNLOAD_API = import.meta.env.VITE_DOWNLOAD_API

export interface ArchiveUrls {
  zip: string
  tgz: string
}

/**
 * Generate archive download URLs for a workspace.
 */
export const getArchiveDownloadUrls = (alias: string, commitId: string): ArchiveUrls => {
  if (!alias || !commitId) {
    return { zip: '', tgz: '' }
  }

  const base = `${MODELS_URL}/workspace/${alias}/@@archive/${commitId}`
  return {
    zip: `${base}/zip`,
    tgz: `${base}/tgz`,
  }
}

export const downloadCOMBINEArchive = async (exposureAlias: string, fileName: string): Promise<void> => {
  if (!exposureAlias) {
    console.error('Exposure alias is required to download COMBINE archive.')
    return
  }

  try {
    const response = await fetch(`${DOWNLOAD_API}?exposureAlias=${exposureAlias}`)

    if (!response.ok) {
      throw new Error(`Failed to download COMBINE archive: ${response.statusText}`)
    }

    const blob = await response.blob()
    downloadFileFromBlob(blob, fileName)
  } catch (error) {
    console.error('Error downloading COMBINE archive:', error)
    throw error
  }
}

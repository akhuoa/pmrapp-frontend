import { downloadFileFromBlob } from '@/utils/download'

const DOWNLOAD_API = import.meta.env.VITE_DOWNLOAD_API

export const downloadWorkspaceArchive = async (
  alias: string,
  commitId: string,
  format: 'zip' | 'tgz',
): Promise<void> => {
  if (!alias || !commitId) {
    console.error('Alias and commit ID are required to download workspace archive.')
    return
  }

  try {
    const response = await fetch(
      `${DOWNLOAD_API}/download/workspace?alias=${alias}&commitId=${commitId}&format=${format}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to download workspace archive: ${response.statusText}`)
    }

    const blob = await response.blob()
    downloadFileFromBlob(blob, `${alias}.${format === 'tgz' ? 'tar.gz' : format}`)
  } catch (error) {
    console.error('Error downloading workspace archive:', error)
    throw error
  }
}

export const downloadCOMBINEArchive = async (
  exposureAlias: string,
  fileName: string,
): Promise<void> => {
  if (!exposureAlias) {
    console.error('Exposure alias is required to download COMBINE archive.')
    return
  }

  try {
    const response = await fetch(`${DOWNLOAD_API}/download/exposure?alias=${exposureAlias}`)

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

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
    const params = new URLSearchParams({ alias, commitId, format })
    const response = await fetch(`${DOWNLOAD_API}/download/workspace?${params}`)

    if (!response.ok) {
      throw new Error(`Failed to download workspace archive: ${response.statusText}`)
    }

    const blob = await response.blob()
    const fileName = `${alias}.${format === 'tgz' ? 'tar.gz' : format}`
    downloadFileFromBlob(blob, fileName)
  } catch (error) {
    console.error('Error downloading workspace archive:', error)
    throw error
  }
}

export const downloadCOMBINEArchive = async (
  alias: string,
  _fileName: string,
): Promise<void> => {
  if (!alias) {
    console.error('Exposure alias is required to download COMBINE archive.')
    return
  }

  try {
    const params = new URLSearchParams({ alias: alias })
    const response = await fetch(`${DOWNLOAD_API}/download/exposure?${params}`)

    if (!response.ok) {
      throw new Error(`Failed to download COMBINE archive: ${response.statusText}`)
    }

    const blob = await response.blob()
    const fileName = `${_fileName || alias}.omex`
    downloadFileFromBlob(blob, fileName)
  } catch (error) {
    console.error('Error downloading COMBINE archive:', error)
    throw error
  }
}

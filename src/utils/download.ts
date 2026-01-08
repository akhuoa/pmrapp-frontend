import { getWorkspaceService } from '@/services'

/**
 * Download a file from content string.
 */
export const downloadFileFromContent = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Download a workspace file by fetching it first.
 */
export const downloadWorkspaceFile = async (
  alias: string,
  commitId: string,
  filename: string
): Promise<void> => {
  try {
    const content = await getWorkspaceService().getRawFile(alias, commitId, filename)
    downloadFileFromContent(content, filename)
  } catch (err) {
    console.error('Error downloading file:', err)
    throw err
  }
}

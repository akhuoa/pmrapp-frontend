import { TITLE } from '@/constants/global'

/**
 * Generate workspace page title from description or ID.
 *
 * @param description The description of the workspace, if available.
 * @param id The ID of the workspace, used as a fallback if description is not available.
 * @param withTitleSuffix When true, appends the site title suffix. Defaults to false.
 * @returns A string representing the title for the workspace page.
 */
export const generateWorkspaceTitle = (
  description: string | null | undefined,
  id: number | null | undefined,
  commitId?: string,
  path?: string,
  withTitleSuffix = false,
): string => {
  let title: string

  // Generic title if neither description nor ID is available.
  if (!description && !id) {
    title = 'Workspace Detail'
  } else if (description && description.trim() !== '') {
    // Title using description.
    title = description
  } else {
    // Fallback title using ID.
    title = `Workspace ${id}`
  }

  if (commitId && path) {
    const truncatedCommitId = commitId.substring(0, 12)
    const pathsWithSpace = path.split('/').join(' / ')
    title = `${title} @ ${truncatedCommitId} / ${pathsWithSpace}`
  }

  return withTitleSuffix ? `${title} – ${TITLE}` : title
}

import { TITLE } from '@/constants/global'

/**
 * Generate workspace page title from description or ID.
 *
 * @param description The description of the workspace, if available.
 * @param id The ID of the workspace, used as a fallback if description is not available.
 * @returns A string representing the title for the workspace page.
 */
export const generateWorkspaceTitle = (description: string | null | undefined, id: number | null | undefined): string => {
  // Generic title if neither description nor ID is available.
  if (!description && !id) {
    return `Workspace Detail – ${TITLE}`
  }

  // Title using description.
  if (description && description.trim() !== '') {
    return `${description} – ${TITLE}`
  }

  // Fallback title using ID.
  return `Workspace ${id} – ${TITLE}`
}

import type { Workspace, WorkspaceInfo } from '@/types/workspace'

export const workspaceServiceMock = {
  async listAliasedWorkspaces(): Promise<Workspace[]> {
    const response = await fetch('/pmrapp-frontend/mocks/workspaces.json')
    if (!response.ok) {
      throw new Error('Failed to load mock workspaces')
    }
    return await response.json()
  },

  async getWorkspaceInfo(_alias: string): Promise<WorkspaceInfo> {
    const response = await fetch('/pmrapp-frontend/mocks/workspace-info.json')
    if (!response.ok) {
      throw new Error('Failed to load mock workspace info')
    }
    return await response.json()
  },
}

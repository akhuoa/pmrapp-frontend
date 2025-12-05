import type { Workspace, WorkspaceInfo } from '@/types/workspace'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const workspaceService = {
  async listAliasedWorkspaces(): Promise<Workspace[]> {
    const response = await fetch(`${API_BASE_URL}/api/list_aliased_workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },

  async getWorkspaceInfo(alias: string): Promise<WorkspaceInfo> {
    const formData = new URLSearchParams()
    formData.append('id[Aliased]', alias)

    const response = await fetch(`${API_BASE_URL}/api/get_workspace_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },
}

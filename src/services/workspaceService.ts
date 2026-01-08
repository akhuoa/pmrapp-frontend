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
    const response = await fetch(`${API_BASE_URL}/api/get_workspace_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: { Aliased: alias },
      }),
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload.inner
  },

  async getRawFileBlob(alias: string, commitId: string, filename: string): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/api/workspace/${alias}/rawfile/${commitId}/${filename}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.blob()
  },

  async getRawFile(alias: string, commitId: string, filename: string): Promise<string> {
    const blob = await this.getRawFileBlob(alias, commitId, filename)
    return await blob.text()
  },
}

import type { Workspace, WorkspaceInfo } from '@/types/workspace'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const workspaceService = {
  async listAliasedWorkspaces(): Promise<Workspace[]> {
    const response = await fetch('/api/workspaces/list', {
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

  async getWorkspaceInfo(alias: string, commitId: string, path: string): Promise<WorkspaceInfo> {
    // Throw error if alias is not provided.
    if (!alias) {
      throw new Error('Workspace alias is required to get workspace info.')
    }

    const response = await fetch('/api/workspaces/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alias, commitId: commitId || '', path: path || '' }),
    })

    if (!response.ok) {
      const responseText = await response.text()

      // Check for not found error.
      if (response.status === 404 || responseText.includes('NotFound')) {
        throw new Error('Workspace not found')
      }

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
      },
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

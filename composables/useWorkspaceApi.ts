import type { Workspace, WorkspaceInfo } from '@/types/workspace'

export const useWorkspaceApi = () => {
  const listAliasedWorkspaces = async (): Promise<Workspace[]> => {
    const data = await $fetch<any>('/api/workspaces/list', {
      method: 'POST',
    })
    return data.inner
  }

  const getWorkspaceInfo = async (
    alias: string,
    commitId?: string,
    path?: string,
  ): Promise<WorkspaceInfo> => {
    try {
      const data = await $fetch<any>('/api/workspaces/info', {
        method: 'POST',
        body: { alias, commitId: commitId || '', path: path || '' },
      })
      return data.inner
    } catch (error: any) {
      if (error.response?.status === 404 || error.data?.includes('NotFound')) {
        throw new Error('Workspace not found')
      }
      throw new Error(`Request failed: ${error.response?.status || 500}`)
    }
  }

  return {
    listAliasedWorkspaces,
    getWorkspaceInfo,
  }
}

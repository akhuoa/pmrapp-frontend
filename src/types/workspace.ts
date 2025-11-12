export interface WorkspaceEntity {
  id: number
  url: string
  superceded_by_id: number | null
  description: string
  long_description: string | null
  created_ts: number
  exposures: unknown | null
}

export interface Workspace {
  alias: string
  entity: WorkspaceEntity
}

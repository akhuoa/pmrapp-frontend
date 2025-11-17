import type { WorkspaceEntity } from './workspace'

export interface ExposureEntity {
  id: number
  description: string | null
  workspace_id: number
  workspace_tag_id: number | null
  commit_id: string
  created_ts: number
  default_file_id: number | null
  files: unknown | null
}

export interface Exposure {
  alias: string
  entity: ExposureEntity
}

export type ExposureFile = [string, boolean]

export interface ExposureInfo {
  exposure: ExposureEntity
  exposure_alias: string
  files: ExposureFile[]
  workspace: WorkspaceEntity
  workspace_alias: string
}

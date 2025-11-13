export interface ExposureEntity {
  id: number
  description: string
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

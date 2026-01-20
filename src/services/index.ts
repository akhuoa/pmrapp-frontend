import { authService } from './authService'
import { exposureService } from './exposureService'
import { searchService } from './searchService'
import { workspaceService } from './workspaceService'

// Service selection.
export const getWorkspaceService = () => workspaceService
export const getExposureService = () => exposureService
export const getAuthService = () => authService
export const getSearchService = () => searchService

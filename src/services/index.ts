import { authService } from './authService'
import { exposureService } from './exposureService'
import { workspaceService } from './workspaceService'
import { searchService } from './searchService'

// Service selection.
export const getWorkspaceService = () => workspaceService
export const getExposureService = () => exposureService
export const getAuthService = () => authService
export const getSearchService = () => searchService

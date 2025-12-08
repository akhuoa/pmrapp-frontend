import { exposureService } from './exposureService'
import { workspaceService } from './workspaceService'
import { authService } from './authService'

// Service selection
export const getWorkspaceService = () => workspaceService
export const getExposureService = () => exposureService
export const getAuthService = () => authService

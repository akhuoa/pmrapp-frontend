import { authService } from './authService'
import { exposureService } from './exposureService'
import { workspaceService } from './workspaceService'

// Service selection
export const getWorkspaceService = () => workspaceService
export const getExposureService = () => exposureService
export const getAuthService = () => authService

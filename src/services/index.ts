import { workspaceService } from './workspaceService'
import { workspaceServiceMock } from './workspaceService.mock'
import { exposureService } from './exposureService'
import { exposureServiceMock } from './exposureService.mock'

// Configuration flag - set to true to use mock data
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Service selection based on configuration
export const getWorkspaceService = () => (USE_MOCK_DATA ? workspaceServiceMock : workspaceService)
export const getExposureService = () => (USE_MOCK_DATA ? exposureServiceMock : exposureService)

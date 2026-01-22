import { beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadFileFromBlob, downloadFileFromContent, downloadWorkspaceFile } from '@/utils/download'

// Mock services
vi.mock('@/services', () => ({
  getWorkspaceService: vi.fn(() => ({
    getRawFile: vi.fn(),
    getRawFileBlob: vi.fn(),
  })),
}))

// Mock file utility
vi.mock('./file', () => ({
  isBinaryFile: vi.fn(),
}))

describe('download', () => {
  let mockCreateElement: any
  let mockAppendChild: any
  let mockRemoveChild: any
  let mockClick: any
  let mockCreateObjectURL: any
  let mockRevokeObjectURL: any

  beforeEach(() => {
    mockClick = vi.fn()
    mockAppendChild = vi.fn()
    mockRemoveChild = vi.fn()
    mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
    mockRevokeObjectURL = vi.fn()

    mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
    } as any)

    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)

    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    vi.clearAllMocks()
  })

  describe('downloadFileFromContent', () => {
    it('creates blob and triggers download', () => {
      const content = 'test file content'
      const filename = 'test.txt'

      downloadFileFromContent(content, filename)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('downloadFileFromBlob', () => {
    it('creates download link from blob', () => {
      const blob = new Blob(['test'], { type: 'text/plain' })
      const filename = 'test.txt'

      downloadFileFromBlob(blob, filename)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(blob)
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('downloadWorkspaceFile', () => {
    it('downloads binary file as blob', async () => {
      const { getWorkspaceService } = await import('@/services')
      const { isBinaryFile } = await import('./file')

      const mockBlob = new Blob(['binary content'])
      vi.mocked(isBinaryFile).mockReturnValue(true)
      vi.mocked(getWorkspaceService)().getRawFileBlob = vi.fn().mockResolvedValue(mockBlob)

      await downloadWorkspaceFile('test-alias', 'commit123', 'image.png')

      expect(isBinaryFile).toHaveBeenCalledWith('image.png')
      expect(getWorkspaceService().getRawFileBlob).toHaveBeenCalledWith('test-alias', 'commit123', 'image.png')
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
    })

    it('downloads text file as content', async () => {
      const { getWorkspaceService } = await import('@/services')
      const { isBinaryFile } = await import('./file')

      vi.mocked(isBinaryFile).mockReturnValue(false)
      vi.mocked(getWorkspaceService)().getRawFile = vi.fn().mockResolvedValue('text content')

      await downloadWorkspaceFile('test-alias', 'commit123', 'file.txt')

      expect(isBinaryFile).toHaveBeenCalledWith('file.txt')
      expect(getWorkspaceService().getRawFile).toHaveBeenCalledWith('test-alias', 'commit123', 'file.txt')
    })

    it('handles download errors', async () => {
      const { getWorkspaceService } = await import('@/services')
      const { isBinaryFile } = await import('./file')

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(isBinaryFile).mockReturnValue(false)
      vi.mocked(getWorkspaceService)().getRawFile = vi.fn().mockRejectedValue(new Error('Download failed'))

      await expect(downloadWorkspaceFile('test-alias', 'commit123', 'file.txt')).rejects.toThrow('Download failed')

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadFileFromBlob, downloadFileFromContent, downloadWorkspaceFile } from '@/utils/download'

// Create stable mock functions.
const mockGetRawFile = vi.fn()
const mockGetRawFileBlob = vi.fn()

// Mock services.
vi.mock('@/services', () => ({
  getWorkspaceService: vi.fn(() => ({
    getRawFile: mockGetRawFile,
    getRawFileBlob: mockGetRawFileBlob,
  })),
}))

// Mock file utility.
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

    globalThis.URL.createObjectURL = mockCreateObjectURL
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL

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
      const { isBinaryFile } = await import('./file')

      const mockBlob = new Blob(['binary content'])
      vi.mocked(isBinaryFile).mockReturnValue(true)
      mockGetRawFileBlob.mockResolvedValue(mockBlob)

      await downloadWorkspaceFile('test-alias', 'commit123', 'image.png')

      expect(isBinaryFile).toHaveBeenCalledWith('image.png')
      expect(mockGetRawFileBlob).toHaveBeenCalledWith('test-alias', 'commit123', 'image.png')
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
    })

    it('downloads text file as content', async () => {
      const { isBinaryFile } = await import('./file')

      vi.mocked(isBinaryFile).mockReturnValue(false)
      mockGetRawFile.mockResolvedValue('text content')

      await downloadWorkspaceFile('test-alias', 'commit123', 'file.txt')

      expect(isBinaryFile).toHaveBeenCalledWith('file.txt')
      expect(mockGetRawFile).toHaveBeenCalledWith('test-alias', 'commit123', 'file.txt')
    })

    it('handles download errors', async () => {
      const { isBinaryFile } = await import('./file')

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(isBinaryFile).mockReturnValue(false)
      mockGetRawFile.mockRejectedValue(new Error('Download failed'))

      await expect(downloadWorkspaceFile('test-alias', 'commit123', 'file.txt')).rejects.toThrow('Download failed')

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })
})

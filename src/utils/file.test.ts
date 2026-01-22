import { describe, expect, it } from 'vitest'
import { getFileExtension, isBinaryFile, isCodeFile, isImageFile, isMarkdownFile, isPdfFile, isSvgFile } from '@/utils/file'

describe('file', () => {
  describe('getFileExtension', () => {
    it('returns extension for normal files', () => {
      expect(getFileExtension('test.txt')).toBe('txt')
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('image.png')).toBe('png')
    })

    it('returns extension in lowercase', () => {
      expect(getFileExtension('test.TXT')).toBe('txt')
      expect(getFileExtension('IMAGE.PNG')).toBe('png')
    })

    it('handles multiple dots in filename', () => {
      expect(getFileExtension('test.file.txt')).toBe('txt')
      expect(getFileExtension('archive.tar.gz')).toBe('gz')
    })

    it('handles dotfiles', () => {
      expect(getFileExtension('.gitignore')).toBe('gitignore')
      expect(getFileExtension('.editorconfig')).toBe('editorconfig')
    })

    it('returns empty string for files without extension', () => {
      expect(getFileExtension('README')).toBe('')
      expect(getFileExtension('Makefile')).toBe('')
    })

    it('returns empty string when dot is at the end', () => {
      expect(getFileExtension('test.')).toBe('')
    })
  })

  describe('isImageFile', () => {
    it('returns true for image extensions', () => {
      expect(isImageFile('photo.png')).toBe(true)
      expect(isImageFile('image.jpg')).toBe(true)
      expect(isImageFile('picture.jpeg')).toBe(true)
      expect(isImageFile('animated.gif')).toBe(true)
      expect(isImageFile('bitmap.bmp')).toBe(true)
      expect(isImageFile('modern.webp')).toBe(true)
    })

    it('returns false for non-image files', () => {
      expect(isImageFile('document.pdf')).toBe(false)
      expect(isImageFile('text.txt')).toBe(false)
      expect(isImageFile('image.svg')).toBe(false)
    })
  })

  describe('isSvgFile', () => {
    it('returns true for SVG files', () => {
      expect(isSvgFile('icon.svg')).toBe(true)
      expect(isSvgFile('IMAGE.SVG')).toBe(true)
    })

    it('returns false for non-SVG files', () => {
      expect(isSvgFile('image.png')).toBe(false)
      expect(isSvgFile('document.pdf')).toBe(false)
    })
  })

  describe('isPdfFile', () => {
    it('returns true for PDF files', () => {
      expect(isPdfFile('document.pdf')).toBe(true)
      expect(isPdfFile('REPORT.PDF')).toBe(true)
    })

    it('returns false for non-PDF files', () => {
      expect(isPdfFile('document.doc')).toBe(false)
      expect(isPdfFile('image.png')).toBe(false)
    })
  })

  describe('isMarkdownFile', () => {
    it('returns true for markdown files', () => {
      expect(isMarkdownFile('README.md')).toBe(true)
      expect(isMarkdownFile('document.markdown')).toBe(true)
      expect(isMarkdownFile('NOTES.MD')).toBe(true)
    })

    it('returns false for non-markdown files', () => {
      expect(isMarkdownFile('document.txt')).toBe(false)
      expect(isMarkdownFile('code.js')).toBe(false)
    })
  })

  describe('isCodeFile', () => {
    it('returns true for common code file extensions', () => {
      expect(isCodeFile('script.py')).toBe(true)
      expect(isCodeFile('app.js')).toBe(true)
      expect(isCodeFile('component.ts')).toBe(true)
      expect(isCodeFile('style.css')).toBe(true)
      expect(isCodeFile('index.html')).toBe(true)
      expect(isCodeFile('config.json')).toBe(true)
      expect(isCodeFile('data.xml')).toBe(true)
      expect(isCodeFile('settings.yaml')).toBe(true)
    })

    it('returns true for specialized file extensions', () => {
      expect(isCodeFile('model.cellml')).toBe(true)
      expect(isCodeFile('simulation.sedml')).toBe(true)
    })

    it('returns true for dotfiles', () => {
      expect(isCodeFile('.gitignore')).toBe(true)
      expect(isCodeFile('.editorconfig')).toBe(true)
    })

    it('returns false for non-code files', () => {
      expect(isCodeFile('image.png')).toBe(false)
      expect(isCodeFile('document.pdf')).toBe(false)
      expect(isCodeFile('video.mp4')).toBe(false)
    })
  })

  describe('isBinaryFile', () => {
    it('returns true for binary file extensions', () => {
      expect(isBinaryFile('image.png')).toBe(true)
      expect(isBinaryFile('document.pdf')).toBe(true)
      expect(isBinaryFile('archive.zip')).toBe(true)
      expect(isBinaryFile('photo.jpg')).toBe(true)
    })

    it('returns false for text files', () => {
      expect(isBinaryFile('script.js')).toBe(false)
      expect(isBinaryFile('document.txt')).toBe(false)
      expect(isBinaryFile('README.md')).toBe(false)
    })

    it('returns false for code files', () => {
      expect(isBinaryFile('app.py')).toBe(false)
      expect(isBinaryFile('style.css')).toBe(false)
      expect(isBinaryFile('config.json')).toBe(false)
    })
  })
})

import { describe, expect, it } from 'vitest'
import { resolveHtmlPaths } from '@/utils/path'

describe('path', () => {
  const baseUrl = 'https://api.example.com'
  const routePath = '/workspace/123'

  describe('resolveHtmlPaths', () => {
    it('resolves relative src paths with ../', () => {
      const html = '<img src="../image.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`src="${baseUrl}${routePath}/`)
    })

    it('resolves relative src paths with ./', () => {
      const html = '<img src="./image.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`src="${baseUrl}${routePath}/image.png"`)
    })

    it('resolves relative href paths with ../', () => {
      const html = '<a href="../page.html">Link</a>'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`href="${baseUrl}${routePath}/`)
    })

    it('resolves relative href paths with ./', () => {
      const html = '<a href="./page.html">Link</a>'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`href="${baseUrl}${routePath}/page.html"`)
    })

    it('resolves root-relative src paths', () => {
      const html = '<img src="/images/logo.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`src="${baseUrl}/images/logo.png"`)
    })

    it('resolves root-relative href paths', () => {
      const html = '<a href="/about">About</a>'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`href="${baseUrl}/about"`)
    })

    it('preserves absolute URLs', () => {
      const html = '<img src="https://external.com/image.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toBe(html)
    })

    it('preserves protocol-relative URLs', () => {
      const html = '<script src="//cdn.example.com/script.js"></script>'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toBe(html)
    })

    it('preserves data URLs', () => {
      const html = '<img src="data:image/png;base64,..." />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toBe(html)
    })

    it('handles multiple relative paths in same HTML', () => {
      const html = '<img src="../img1.png" /><img src="./img2.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`${baseUrl}${routePath}/`)
    })

    it('handles nested relative paths', () => {
      const html = '<img src="../../image.png" />'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toContain(`src="${baseUrl}${routePath}/`)
    })

    it('returns unchanged HTML for HTML without paths', () => {
      const html = '<p>Plain text without any paths</p>'
      const result = resolveHtmlPaths(html, baseUrl, routePath)
      expect(result).toBe(html)
    })
  })
})

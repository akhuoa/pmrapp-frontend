import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '@/utils/markdown'

describe('markdown', () => {
  describe('renderMarkdown', () => {
    it('returns empty string for empty input', () => {
      expect(renderMarkdown('')).toBe('')
    })

    it('escapes HTML to prevent XSS', () => {
      const result = renderMarkdown('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('converts headers to HTML', () => {
      expect(renderMarkdown('# Heading 1')).toContain('<h1')
      expect(renderMarkdown('## Heading 2')).toContain('<h2')
      expect(renderMarkdown('### Heading 3')).toContain('<h3')
    })

    it('converts bold text', () => {
      const result = renderMarkdown('**bold text**')
      expect(result).toContain('<strong')
      expect(result).toContain('bold text')
    })

    it('converts italic text', () => {
      const result = renderMarkdown('*italic text*')
      expect(result).toContain('<em')
      expect(result).toContain('italic text')
    })

    it('converts links', () => {
      const result = renderMarkdown('[Link Text](https://example.com)')
      expect(result).toContain('<a href="https://example.com"')
      expect(result).toContain('Link Text')
      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })

    it('auto-links URLs', () => {
      const result = renderMarkdown('Visit https://example.com for more')
      expect(result).toContain('<a href="https://example.com"')
    })

    it('auto-links email addresses', () => {
      const result = renderMarkdown('Contact test@example.com for help')
      expect(result).toContain('<a href="mailto:test@example.com"')
    })

    it('converts list items', () => {
      const result = renderMarkdown('- Item 1\n- Item 2')
      expect(result).toContain('<li>')
      expect(result).toContain('<ul')
    })

    it('converts code blocks', () => {
      const result = renderMarkdown('```\ncode here\n```')
      expect(result).toContain('<pre')
      expect(result).toContain('<code')
      expect(result).toContain('code here')
    })

    it('converts inline code', () => {
      const result = renderMarkdown('Use `const x = 1` in JavaScript')
      expect(result).toContain('<code')
      expect(result).toContain('const x = 1')
    })

    it('wraps paragraphs in p tags', () => {
      const result = renderMarkdown('This is a paragraph')
      expect(result).toContain('<p')
      expect(result).toContain('This is a paragraph')
    })

    it('handles multiple paragraphs', () => {
      const result = renderMarkdown('Paragraph 1\n\nParagraph 2')
      const pTagCount = (result.match(/<p/g) || []).length
      expect(pTagCount).toBeGreaterThanOrEqual(2)
    })

    it('preserves list formatting', () => {
      const markdown = '- First item\n- Second item\n- Third item'
      const result = renderMarkdown(markdown)
      expect(result).toContain('First item')
      expect(result).toContain('Second item')
      expect(result).toContain('Third item')
    })
  })
})

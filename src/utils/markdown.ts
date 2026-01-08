/**
 * Simple markdown to HTML converter with basic support.
 */
export const renderMarkdown = (markdown: string): string => {
  let html = markdown
    // Headers.
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-0 mb-4">$1</h1>')
    // Bold.
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic.
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Links.
    .replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">$1</a>',
    )
    // Line breaks.
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    // Code blocks.
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto mb-4"><code class="text-sm font-mono">$1</code></pre>',
    )
    // Inline code.
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono">$1</code>',
    )
    // Lists.
    .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')

  // Wrap in paragraph tags.
  html = '<p class="mb-4">' + html + '</p>'
  // Clean up multiple paragraph tags.
  html = html.replace(/<\/p><p class="mb-4">/g, '</p>\n<p class="mb-4">')
  // Wrap list items in ul.
  html = html.replace(/(<li class="mb-1">.*<\/li>)/gs, '<ul class="list-disc ml-6 mb-4">$1</ul>')

  return html
}

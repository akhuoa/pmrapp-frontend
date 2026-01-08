/**
 * Get file extension from filename.
 */
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')

  // No extension if no dot, or dot is at the start (hidden file), or dot is at the end.
  if (lastDotIndex <= 0 || lastDotIndex === filename.length - 1) {
    return ''
  }

  return filename.substring(lastDotIndex + 1).toLowerCase()
}

/**
 * Check if file is an image (excluding SVG).
 */
export const isImageFile = (filename: string): boolean => {
  const extension = getFileExtension(filename)
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)
}

/**
 * Check if file is SVG.
 */
export const isSvgFile = (filename: string): boolean => {
  return getFileExtension(filename) === 'svg'
}

/**
 * Check if file is a code/text file.
 */
export const isCodeFile = (filename: string): boolean => {
  const extension = getFileExtension(filename)
  const codeExtensions = [
    'py', 'js', 'ts', 'html', 'css',
    'json', 'xml', 'yaml', 'yml', 'md', 'txt', 'sh', 'bash', 'c', 'cpp',
    'h', 'hpp', 'java', 'rs', 'go', 'php', 'rb', 'sql',
    'cellml', 'sedml', 'omex', 'csv', 'xls', 'ai', 'r', 'matlab', 'm',
  ]
  return codeExtensions.includes(extension)
}

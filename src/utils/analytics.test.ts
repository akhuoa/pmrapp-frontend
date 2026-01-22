import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trackButtonClick } from '@/utils/analytics'

// Mock vue-gtag
vi.mock('vue-gtag', () => ({
  event: vi.fn(),
}))

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls event with correct parameters', async () => {
    const { event } = await import('vue-gtag')

    trackButtonClick({
      button_name: 'Test Button',
      content_section: 'Test Section',
      link_category: '/test',
    })

    expect(event).toHaveBeenCalledWith('button_click', {
      button_name: 'Test Button',
      content_section: 'Test Section',
      link_category: '/test',
    })
  })

  it('tracks button click with all payload fields', async () => {
    const { event } = await import('vue-gtag')

    const payload = {
      button_name: 'Download',
      content_section: 'File Detail',
      link_category: '/files/123',
    }

    trackButtonClick(payload)

    expect(event).toHaveBeenCalledTimes(1)
    expect(event).toHaveBeenCalledWith('button_click', payload)
  })
})

import { GITHUB_AUTH_ERROR_MESSAGES, LOGIN_ERROR_MESSAGES } from '@/constants/auth'
import type { GitHubAuthData, LoginCredentials } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const GITHUB_AUTH_API = import.meta.env.VITE_GITHUB_AUTH_API

const normaliseErrorText = (errorText: string): string => {
  const trimmed = errorText.trim()
  return trimmed.replace(/^['"]|['"]$/g, '')
}

const getKnownLoginErrorMessage = (key: string): string | undefined => {
  if (key === 'invalidcredentials' || key === 'invalid_credentials') {
    return LOGIN_ERROR_MESSAGES.invalidCredentials
  }

  return undefined
}

const getLoginErrorMessageByStatus = (status: number): string => {
  if (status === 401) {
    return LOGIN_ERROR_MESSAGES.invalidCredentials
  }

  if (status === 403) {
    return LOGIN_ERROR_MESSAGES.forbidden
  }

  if (status === 429) {
    return LOGIN_ERROR_MESSAGES.tooManyRequests
  }

  if (status >= 500) {
    return LOGIN_ERROR_MESSAGES.serviceUnavailable
  }

  return LOGIN_ERROR_MESSAGES.generic
}

const mapLoginErrorMessage = (errorText: string, status: number): string => {
  if (!errorText) {
    return getLoginErrorMessageByStatus(status)
  }

  const normalisedText = normaliseErrorText(errorText)
  const normalisedKey = normalisedText.toLowerCase()
  const mappedMessage = getKnownLoginErrorMessage(normalisedKey)

  if (mappedMessage) {
    return mappedMessage
  }

  // If backend returns machine-style codes, avoid exposing raw text.
  const looksLikeMachineCode =
    /^[a-z0-9_-]+$/i.test(normalisedText) || /^[A-Z][a-zA-Z0-9]+$/.test(normalisedText)
  if (looksLikeMachineCode) {
    return getLoginErrorMessageByStatus(status)
  }

  // Preserve human-readable backend detail for unknown cases.
  return normalisedText || getLoginErrorMessageByStatus(status)
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = mapLoginErrorMessage(errorData.message || '', response.status)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.token
  },

  async loginWithGitHub(code: string): Promise<GitHubAuthData> {
    const response = await fetch('/api/auth/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error(GITHUB_AUTH_ERROR_MESSAGES.generic)
    }

    return response.json() as Promise<GitHubAuthData>
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token')

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }
  },

  async revokeGitHub(): Promise<void> {
    const token = localStorage.getItem('auth_token')

    const response = await fetch('/api/auth/github-revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(GITHUB_AUTH_ERROR_MESSAGES.revoke)
    }
  },
}

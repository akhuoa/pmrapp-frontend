import { GITHUB_AUTH_ERROR_MESSAGES, LOGIN_ERROR_MESSAGES } from '@/constants/auth'
import type { GitHubAuthData, LoginCredentials } from '@/types/auth'

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

  const looksLikeMachineCode =
    /^[a-z0-9_-]+$/i.test(normalisedText) || /^[A-Z][a-zA-Z0-9]+$/.test(normalisedText)
  if (looksLikeMachineCode) {
    return getLoginErrorMessageByStatus(status)
  }

  return normalisedText || getLoginErrorMessageByStatus(status)
}

export const useAuthApi = () => {
  const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
      const data = await $fetch<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      return data.token
    } catch (error: any) {
      const status = error.response?.status || 500
      const errorMessage = mapLoginErrorMessage(error.data?.message || '', status)
      throw new Error(errorMessage)
    }
  }

  const loginWithGitHub = async (code: string): Promise<GitHubAuthData> => {
    try {
      return await $fetch<GitHubAuthData>('/api/auth/github', {
        method: 'POST',
        body: { code },
      })
    } catch (error) {
      throw new Error(GITHUB_AUTH_ERROR_MESSAGES.generic)
    }
  }

  const logout = async (token: string | null): Promise<void> => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
  }

  const revokeGitHub = async (token: string | null): Promise<void> => {
    try {
      await $fetch('/api/auth/github-revoke', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
    } catch (error) {
      throw new Error(GITHUB_AUTH_ERROR_MESSAGES.revoke)
    }
  }

  return {
    login,
    loginWithGitHub,
    logout,
    revokeGitHub,
  }
}

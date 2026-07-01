import { GITHUB_OAUTH_SCOPE, OAUTH_STATE_KEY } from '@/constants/auth'

export const getGitHubRedirectUri = (appBaseUrl: string): string =>
  new URL('login', new URL(appBaseUrl, window.location.origin)).toString()

export const getGitHubOAuthParams = (clientId: string, redirectUri: string) => ({
  client_id: clientId,
  redirect_uri: redirectUri,
  scope: GITHUB_OAUTH_SCOPE,
})

/**
 * Generates a cryptographically random state value for OAuth CSRF protection.
 */
export const generateOAuthState = (): string => crypto.randomUUID()

/**
 * Stores the OAuth state value in sessionStorage before redirecting to GitHub.
 */
export const storeOAuthState = (state: string): void => {
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
}

/**
 * Validates the incoming OAuth state against the stored value and removes it
 * from sessionStorage (one-time use). Uses a constant-time comparison to
 * prevent timing attacks.
 */
export const validateOAuthState = (expectedState: string | null): boolean => {
  if (!expectedState) return false

  const storedState = sessionStorage.getItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)

  if (!storedState) return false
  if (storedState.length !== expectedState.length) return false

  let result = 0
  for (let i = 0; i < storedState.length; i++) {
    result |= storedState.charCodeAt(i) ^ expectedState.charCodeAt(i)
  }

  return result === 0
}

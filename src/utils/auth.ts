import { GITHUB_OAUTH_SCOPE } from '@/constants/auth'

export const getGitHubRedirectUri = (appBaseUrl: string): string =>
  new URL('login', new URL(appBaseUrl, window.location.origin)).toString()

export const getGitHubOAuthParams = (clientId: string, redirectUri: string) => ({
  client_id: clientId,
  redirect_uri: redirectUri,
  scope: GITHUB_OAUTH_SCOPE,
})

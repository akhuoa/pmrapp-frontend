import type { LoginCredentials } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/bearer/from_login_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }

    const token = await response.text()
    return token
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sign_out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }
  },
}

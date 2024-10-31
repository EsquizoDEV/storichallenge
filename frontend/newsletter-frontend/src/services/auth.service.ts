import axios from 'axios'

const API_URL = 'http://localhost:9999'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    role: string
  }
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials,
    )
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  }

  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/register`,
      credentials,
    )
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  }

  logout(): void {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  }
}

export default new AuthService()

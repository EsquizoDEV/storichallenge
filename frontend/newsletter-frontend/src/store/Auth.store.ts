import { defineStore } from 'pinia'
import AuthService, {
  type AuthResponse,
  type LoginCredentials,
} from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthResponse | null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => {
      console.log(state.user?.user)
      return state.user?.user.role === 'admin'
    },
  },
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const user = await AuthService.login(credentials)
        this.user = user
      } catch (error) {
        console.error(error)
        this.error = 'Invalid username or password'
        throw error
      } finally {
        this.loading = false
      }
    },
    async register(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const user = await AuthService.register(credentials)
        this.user = user
      } catch (error) {
        console.error(error)
        this.error = 'Invalid username or password'
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      AuthService.logout()
      this.user = null
    },
    initAuth() {
      const user = AuthService.getCurrentUser()
      if (user) {
        this.user = user
      }
    },
  },
})

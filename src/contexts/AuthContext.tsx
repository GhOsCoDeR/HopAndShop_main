'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  isAdmin?: boolean
  token?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<boolean>
  clearError: () => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on initial load and on window focus
  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
    
    // Add event listeners to handle when the user returns to the app
    window.addEventListener('focus', checkSession)
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_token') {
        checkSession()
      }
    })
    
    return () => {
      window.removeEventListener('focus', checkSession)
      window.removeEventListener('storage', checkSession)
    }
  }, [checkSession])

  // Session refresh mechanism - refreshes token every 30 minutes
  useEffect(() => {
    if (!user?.token) return
    
    // Set up interval to refresh token
    const interval = setInterval(() => {
      refreshToken(user.token as string)
    }, 30 * 60 * 1000) // 30 minutes
    
    return () => clearInterval(interval)
  }, [user])

  const refreshToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update token in localStorage
        localStorage.setItem('auth_token', data.token)
        // Update user with new token
        setUser(prev => prev ? { ...prev, token: data.token } : null)
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  const validateToken = async (token: string) => {
    try {
      console.log('Validating token:', token)
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('Token validation successful:', userData)
        setUser({ ...userData, token })
        // Extend the token expiration by refreshing it
        refreshToken(token)
      } else {
        // If token is invalid, clear localStorage
        console.log('Token validation failed, clearing token')
        localStorage.removeItem('auth_token')
        setUser(null)
      }
    } catch (error) {
      console.error('Error validating token:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Attempting login for:', email)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      console.log('Login successful:', data.email)
      
      // Save token to localStorage
      localStorage.setItem('auth_token', data.token)
      
      // Store user data for potential session recovery
      localStorage.setItem('last_user_id', data.id)
      localStorage.setItem('last_user_email', data.email)

      // Set user data
      setUser(data)
      
      // Show success message
      toast.success('Login successful!')
      
      // Redirect based on user type
      if (data.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      console.error('Login error:', error.message)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Attempting registration for:', userData.email)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      console.log('Registration successful with response:', data)
      
      // If the API returns a token, save it and set the user
      if (data.user && data.user.token) {
        localStorage.setItem('auth_token', data.user.token)
        
        // Store user data for potential session recovery
        localStorage.setItem('last_user_id', data.user.id)
        localStorage.setItem('last_user_email', data.user.email)
        
        setUser(data.user)
        
        // Show success message
        toast.success('Registration successful!')
        
        // Redirect to homepage
        router.push('/')
        setLoading(false)
      } else {
        // Otherwise try to log in with the credentials
        await login(userData.email, userData.password)
      }
    } catch (error: any) {
      console.error('Registration error:', error.message)
      setError(error.message)
      toast.error(error.message)
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear token but keep recovery data
      localStorage.removeItem('auth_token')
      setUser(null)
      setLoading(false)
      router.push('/')
    }
  }

  const restoreSession = async (): Promise<boolean> => {
    // Don't try to restore if we already have a user
    if (user) return true
    
    // First try to restore from localStorage
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser({ ...userData, token })
          return true
        }
      } catch (error) {
        console.error('Error restoring session from token:', error)
      }
    }
    
    // Try to find a matching user ID in session storage
    try {
      const userId = localStorage.getItem('last_user_id')
      const userEmail = localStorage.getItem('last_user_email')
      
      if (!userId && !userEmail) return false
      
      const response = await fetch('/api/auth/restore-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          email: userEmail 
        }),
      })
      
      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem('auth_token', userData.token)
        setUser(userData)
        return true
      }
    } catch (error) {
      console.error('Error restoring session:', error)
    }
    
    return false
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    restoreSession,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
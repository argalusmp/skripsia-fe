'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { API_BASE_URL, handleApiResponse } from './utils'

type User = {
  id: number
  username: string
  email: string
  role: 'admin' | 'student'
  created_at?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role: 'admin' | 'student') => Promise<void>
  logout: () => void
  error: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        console.error('Authentication error:', err)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      })
      
      const data = await handleApiResponse(response)
      localStorage.setItem('token', data.access_token)
      
      // Set user data from token response
      setUser({
        id: data.user_id,
        username: data.username,
        email: '', // Email tidak tersedia di response token
        role: data.role
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string, role: 'admin' | 'student') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      })
      
      const data = await handleApiResponse(response)
      // Login otomatis setelah register berhasil
      localStorage.setItem('token', data.access_token)
      
      setUser({
        id: data.user_id,
        username: data.username,
        email: email,
        role: data.role
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        error,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUserByEmail } from '../services/UserService'
import { config } from '../config'
import type { UserResponse } from '../models/responses/UserResponse'

interface AuthContextType {
  user: UserResponse | null
  idUsuario: number | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [idUsuario, setIdUsuario] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedEmail = localStorage.getItem('mm_email')
    const savedId = localStorage.getItem('mm_id')
    if (savedEmail && savedId) {
      getUserByEmail(savedEmail)
        .then(data => {
          setUser(data)
          setIdUsuario(Number(savedId))
        })
        .catch(() => {
          localStorage.removeItem('mm_email')
          localStorage.removeItem('mm_id')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${config.api.url}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) return false
      const data: UserResponse = await response.json()
      setUser(data)
      setIdUsuario(data.id)
      localStorage.setItem('mm_email', email)
      localStorage.setItem('mm_id', String(data.id))
      return true
    } catch {
      return false
    }
  }

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${config.api.url}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, active: true }),
      })
      if (!response.ok) return false
      return await login(email, password)
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIdUsuario(null)
    localStorage.removeItem('mm_email')
    localStorage.removeItem('mm_id')
  }

  return (
    <AuthContext.Provider value={{ user, idUsuario, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return context
}
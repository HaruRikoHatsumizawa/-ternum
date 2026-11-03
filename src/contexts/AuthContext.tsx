import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

interface AuthContextType {
  user: RecordModel | null
  token: string | null
  isLoading: boolean
  login: (email: string, pass: string) => Promise<RecordModel>
  signup: (email: string, pass: string, name: string) => Promise<RecordModel>
  logout: () => void
  updateProfile: (data: { name?: string; avatar?: File | null }) => Promise<void>
  updatePassword: (oldPass: string, newPass: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [token, setToken] = useState<string | null>(pb.authStore.token)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Escuta alterações na sessão do PocketBase
    const unsub = pb.authStore.onChange((newToken, newModel) => {
      setToken(newToken)
      setUser(newModel)
    })

    // Auto login demo se não houver usuário autenticado no início
    const initAuth = async () => {
      try {
        if (!pb.authStore.isValid) {
          // Tenta autenticar silenciosamente com a conta demo
          try {
            await pb.collection('users').authWithPassword('amanda_fac1@yahoo.com.br', 'Skip@Pass')
            setUser(pb.authStore.record)
            setToken(pb.authStore.token)
          } catch (_) {
            // Se falhar, segue deslogado para tela de login
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    return () => {
      unsub()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    const authData = await pb.collection('users').authWithPassword(email, pass)
    setUser(authData.record)
    setToken(authData.token)
    return authData.record
  }

  const signup = async (email: string, pass: string, name: string) => {
    const newUser = await pb.collection('users').create({
      email,
      password: pass,
      passwordConfirm: pass,
      name,
    })
    await pb.collection('users').authWithPassword(email, pass)
    setUser(pb.authStore.record)
    setToken(pb.authStore.token)
    return newUser
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
  }

  const updateProfile = async (data: { name?: string; avatar?: File | null }) => {
    if (!user) return
    const formData = new FormData()
    if (data.name !== undefined) {
      formData.append('name', data.name)
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }
    const updated = await pb.collection('users').update(user.id, formData)
    setUser(updated)
  }

  const updatePassword = async (oldPass: string, newPass: string) => {
    if (!user) return
    await pb.collection('users').update(user.id, {
      oldPassword: oldPass,
      password: newPass,
      passwordConfirm: newPass,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

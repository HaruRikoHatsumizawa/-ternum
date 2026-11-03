import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export type AppMode = 'rpg' | 'rp'

interface ModeContextType {
  mode: AppMode
  setMode: (mode: AppMode) => Promise<void>
  isRp: boolean
  isRpg: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth()
  const [mode, setLocalMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem('eternum_app_mode')
    if (saved === 'rp' || saved === 'rpg') return saved
    return 'rpg'
  })

  // Sincroniza quando o perfil do usuário carregar ou mudar
  useEffect(() => {
    if (user?.app_mode && (user.app_mode === 'rp' || user.app_mode === 'rpg')) {
      setLocalMode(user.app_mode as AppMode)
      localStorage.setItem('eternum_app_mode', user.app_mode)
    }
  }, [user?.app_mode])

  // Aplica classe no elemento raiz para estilização global e variáveis CSS
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'rp') {
      root.classList.add('mode-rp')
      root.classList.remove('mode-rpg')
    } else {
      root.classList.add('mode-rpg')
      root.classList.remove('mode-rp')
    }
    localStorage.setItem('eternum_app_mode', mode)
  }, [mode])

  const setMode = async (newMode: AppMode) => {
    setLocalMode(newMode)
    localStorage.setItem('eternum_app_mode', newMode)
    if (user) {
      try {
        await updateProfile({ app_mode: newMode })
      } catch (err) {
        console.error('Falha ao persistir modo do app no backend:', err)
      }
    }
  }

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        isRp: mode === 'rp',
        isRpg: mode === 'rpg',
      }}
    >
      {children}
    </ModeContext.Provider>
  )
}

export function useAppMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useAppMode deve ser usado dentro de um ModeProvider')
  }
  return context
}

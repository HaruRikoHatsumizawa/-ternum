import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export type AppMode = 'geral' | 'rpg' | 'rp'

// Utilitário para verificar se um item com target_mode deve aparecer no modo atual
export function isItemVisibleInMode(
  itemMode: string | undefined | null,
  currentMode: AppMode,
): boolean {
  // Se estiver no modo Geral, tudo aparece (itens de RPG, RP e Geral)
  if (currentMode === 'geral') return true

  // Se o item estiver explicitamente marcado como 'geral' ou sem marcação, é compartilhado
  if (!itemMode || itemMode === 'geral') return true

  // Caso contrário, precisa coincidir estritamente com o modo ativo:
  // Item 'rpg' só aparece no modo 'rpg' (e no 'geral')
  // Item 'rp' só aparece no modo 'rp' (e no 'geral')
  return itemMode === currentMode
}

interface ModeContextType {
  mode: AppMode
  setMode: (mode: AppMode) => Promise<void>
  isGeral: boolean
  isRp: boolean
  isRpg: boolean
  isItemVisible: (itemMode?: string | null) => boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth()
  const [mode, setLocalMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem('eternum_app_mode')
    if (saved === 'geral' || saved === 'rp' || saved === 'rpg') return saved
    return 'geral'
  })

  // Sincroniza quando o perfil do usuário carregar ou mudar
  useEffect(() => {
    if (
      user?.app_mode &&
      (user.app_mode === 'geral' || user.app_mode === 'rp' || user.app_mode === 'rpg')
    ) {
      setLocalMode(user.app_mode as AppMode)
      localStorage.setItem('eternum_app_mode', user.app_mode)
    }
  }, [user?.app_mode])

  // Aplica classe no elemento raiz para estilização global e variáveis CSS
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('mode-geral', 'mode-rpg', 'mode-rp')
    root.classList.add(`mode-${mode}`)
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

  const isItemVisible = (itemMode?: string | null) => {
    return isItemVisibleInMode(itemMode, mode)
  }

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        isGeral: mode === 'geral',
        isRp: mode === 'rp',
        isRpg: mode === 'rpg',
        isItemVisible,
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

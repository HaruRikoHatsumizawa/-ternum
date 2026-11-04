import React, { createContext, useContext, useEffect, useState } from 'react'
import { ptBR, TranslationDict } from './locales/pt-BR'
import { en } from './locales/en'
import { useAuth } from '@/contexts/AuthContext'

export type Locale = 'pt-BR' | 'en'

export interface LocaleOption {
  id: Locale
  label: string
  flag: string
  sublabel: string
}

export const SUPPORTED_LOCALES: LocaleOption[] = [
  {
    id: 'pt-BR',
    label: 'Português',
    flag: '🇧🇷',
    sublabel: 'Padrão do Reino (pt-BR)',
  },
  {
    id: 'en',
    label: 'English',
    flag: '⚔️',
    sublabel: 'Common Tongue (en)',
  },
]

const dictionaries: Record<Locale, TranslationDict> = {
  'pt-BR': ptBR,
  en,
}

// Helper to resolve nested keys like 'nav.overview' or direct dict access
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`
type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never

export type TranslationKey = DotNestedKeys<TranslationDict>

interface LanguageContextType {
  locale: Locale
  language: Locale
  setLocale: (locale: Locale) => Promise<void>
  t: (key: string, params?: Record<string, string | number>) => string
  dict: TranslationDict
  isEnglish: boolean
  isPortuguese: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'eternum_locale'

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined' || !navigator.language) {
    return 'pt-BR'
  }
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('en')) {
    return 'en'
  }
  return 'pt-BR'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth()

  const [locale, setLocalLocale] = useState<Locale>(() => {
    // 1. Prioridade inicial: localStorage se já escolhido
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'pt-BR' || saved === 'en') {
        return saved as Locale
      }
    }
    // 2. Fallback: detectar navegador
    return detectBrowserLocale()
  })

  // Sincroniza quando o usuário logar ou atualizar seu perfil do PocketBase
  useEffect(() => {
    if (user?.locale && (user.locale === 'pt-BR' || user.locale === 'en')) {
      const userLocale = user.locale as Locale
      setLocalLocale(userLocale)
      localStorage.setItem(STORAGE_KEY, userLocale)
    }
  }, [user?.locale])

  // Atualiza atributo lang no HTML para acessibilidade e leitores de tela
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en'
    }
  }, [locale])

  const setLocale = async (newLocale: Locale) => {
    setLocalLocale(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)

    // Persiste na conta do usuário se autenticado
    if (user) {
      try {
        await updateProfile({ locale: newLocale })
      } catch (err) {
        console.error('Falha ao persistir idioma na conta do PocketBase:', err)
      }
    }
  }

  const dict = dictionaries[locale] || dictionaries['pt-BR']

  // Função t com suporte a interpolação {param}
  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.')
    let current: any = dict

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // Fallback para pt-BR se a chave não existir na língua ativa
        let fallback: any = dictionaries['pt-BR']
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey]
          } else {
            fallback = undefined
            break
          }
        }
        current = fallback !== undefined ? fallback : path
        break
      }
    }

    if (typeof current !== 'string') {
      return path
    }

    if (!params) {
      return current
    }

    return Object.entries(params).reduce((acc, [paramKey, paramVal]) => {
      return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal))
    }, current)
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        language: locale,
        setLocale,
        t,
        dict,
        isEnglish: locale === 'en',
        isPortuguese: locale === 'pt-BR',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider')
  }
  return context
}

// Hook de conveniência curto
export function useTranslation() {
  return useLanguage()
}

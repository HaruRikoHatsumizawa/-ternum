import { useLanguage, SUPPORTED_LOCALES } from '@/i18n/LanguageContext'
import { Languages } from 'lucide-react'

export interface LanguageSwitcherProps {
  variant?: 'compact' | 'full'
  className?: string
}

export function LanguageSwitcher({ variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage()

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {SUPPORTED_LOCALES.map((item) => {
          const isActive = locale === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLocale(item.id)}
              className={`px-2 py-1 rounded text-[11px] font-fantasy transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 font-bold shadow-xs'
                  : 'bg-[#0c1017] border-[#222a3a] text-[#8e8678] hover:text-amber-200 hover:border-amber-500/30'
              }`}
              title={item.sublabel}
            >
              <span className="text-xs">{item.flag}</span>
              <span className="uppercase">{item.id === 'pt-BR' ? 'PT' : 'EN'}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUPPORTED_LOCALES.map((item) => {
          const isSelected = locale === item.id
          return (
            <div
              key={item.id}
              onClick={() => setLocale(item.id)}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-950'
                  : 'border-[#262c3a] bg-[#0d1017] hover:border-amber-500/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1.5 rounded-lg bg-[#141a24] border border-[#262f40]">
                  {item.flag}
                </span>
                <div>
                  <h4 className="text-sm font-fantasy font-bold text-amber-100 flex items-center gap-1.5">
                    {item.label}
                  </h4>
                  <p className="text-xs text-[#8e8678]">{item.sublabel}</p>
                </div>
              </div>
              {isSelected && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 font-mono font-bold">
                  {t('common.active')}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

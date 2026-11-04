import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageContext'
import { useAppMode } from '@/contexts/ModeContext'
import {
  RuneTrashIcon,
  RuneSkullIcon,
  RuneScrollIcon,
  RuneCombatIcon,
  RuneOracleIcon,
  RuneSwordIcon,
  RuneTomeIcon,
  RuneCompendiumIcon,
  RuneBondsIcon,
} from '@/components/rpg/EternumIcons'

export type ConfirmIconType =
  | 'trash'
  | 'skull'
  | 'scroll'
  | 'combat'
  | 'oracle'
  | 'blade'
  | 'tome'
  | 'compendium'
  | 'bonds'

export interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  dangerous?: boolean
  icon?: ConfirmIconType
  itemName?: string
}

interface ConfirmDialogContextType {
  confirm: (options?: ConfirmOptions | string) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const { t, language } = useLanguage()
  const { mode } = useAppMode()

  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts?: ConfirmOptions | string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve

      if (typeof opts === 'string') {
        setOptions({
          description: opts,
        })
      } else {
        setOptions(opts || {})
      }

      setIsOpen(true)
    })
  }, [])

  const handleClose = useCallback((value: boolean) => {
    setIsOpen(false)
    if (resolverRef.current) {
      resolverRef.current(value)
      resolverRef.current = null
    }
  }, [])

  const isRp = mode === 'rp'
  const dangerous = options.dangerous ?? true

  // Ícone rúnico temático autoral
  const renderIcon = () => {
    const iconType = options.icon || (dangerous ? 'trash' : 'scroll')
    const iconCls = isRp ? 'w-6 h-6 text-purple-400' : 'w-6 h-6 text-amber-400'

    switch (iconType) {
      case 'skull':
        return <RuneSkullIcon className={iconCls} />
      case 'combat':
        return <RuneCombatIcon className={iconCls} />
      case 'oracle':
        return <RuneOracleIcon className={iconCls} />
      case 'scroll':
        return <RuneScrollIcon className={iconCls} />
      case 'blade':
        return <RuneSwordIcon className={iconCls} />
      case 'tome':
        return <RuneTomeIcon className={iconCls} />
      case 'compendium':
        return <RuneCompendiumIcon className={iconCls} />
      case 'bonds':
        return <RuneBondsIcon className={iconCls} />
      case 'trash':
      default:
        return <RuneTrashIcon className={iconCls} />
    }
  }

  const defaultTitle = language === 'en' ? 'Confirm Action' : 'Confirmar Ação'
  const defaultDangerousTitle = language === 'en' ? 'Arcane Severance' : 'Exclusão do Códice'
  const title = options.title || (dangerous ? defaultDangerousTitle : defaultTitle)

  const defaultConfirmText =
    options.confirmText ||
    (dangerous
      ? language === 'en'
        ? 'Sever & Delete'
        : 'Excluir do Registro'
      : language === 'en'
        ? 'Confirm'
        : 'Confirmar')

  const defaultCancelText =
    options.cancelText || (language === 'en' ? 'Keep Intact' : 'Preservar / Cancelar')

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(false)}>
        <DialogContent
          className={`sm:max-w-md p-6 border shadow-2xl transition-all ${
            isRp
              ? 'bg-[#120d1c] border-purple-500/40 text-purple-100 shadow-purple-950/50'
              : 'bg-[#10151f] border-amber-500/40 text-amber-100 shadow-amber-950/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl border shrink-0 ${
                isRp
                  ? 'bg-purple-950/60 border-purple-500/40 shadow-inner shadow-purple-900/40'
                  : 'bg-amber-950/60 border-amber-500/40 shadow-inner shadow-amber-900/40'
              }`}
            >
              {renderIcon()}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <DialogHeader className="text-left p-0 space-y-1">
                <DialogTitle
                  className={`text-base sm:text-lg font-fantasy font-bold tracking-wide ${
                    isRp ? 'text-purple-100' : 'text-amber-100'
                  }`}
                >
                  {title}
                </DialogTitle>
                {options.description && (
                  <DialogDescription className="text-xs sm:text-sm text-[#b5ad9e] leading-relaxed font-sans pt-1">
                    {options.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              {options.itemName && (
                <div
                  className={`px-3 py-2 rounded-lg border text-xs font-fantasy font-semibold truncate ${
                    isRp
                      ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                  }`}
                >
                  {options.itemName}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-white/10 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-[#2b3548] bg-[#141b27] hover:bg-[#1a2333] text-[#b5ad9e] hover:text-white font-fantasy text-xs h-9 px-4"
            >
              {defaultCancelText}
            </Button>
            <Button
              type="button"
              onClick={() => handleClose(true)}
              className={`font-fantasy text-xs font-bold h-9 px-4 gap-1.5 border shadow-sm ${
                dangerous
                  ? 'bg-rose-950 hover:bg-rose-900 border-rose-500/50 text-rose-200 hover:text-rose-100'
                  : isRp
                    ? 'bg-purple-800 hover:bg-purple-700 border-purple-400 text-purple-100'
                    : 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-slate-950'
              }`}
            >
              {dangerous && <RuneTrashIcon className="w-3.5 h-3.5" />}
              <span>{defaultConfirmText}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmDialogContext)
  if (!ctx) {
    throw new Error('useConfirm deve ser usado dentro de um ConfirmDialogProvider')
  }
  return ctx.confirm
}

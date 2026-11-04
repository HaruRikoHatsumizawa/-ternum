import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { RuneOracleIcon } from '@/components/rpg/EternumIcons'
import { RunicCircle, ArcaneOrb } from '@/components/rpg/RpgArtwork'
import { useLanguage } from '@/i18n/LanguageContext'
import { useAppMode } from '@/contexts/ModeContext'

export interface OracleHeroCardProps {
  className?: string
  compact?: boolean
}

export function OracleHeroCard({ className = '', compact = false }: OracleHeroCardProps) {
  const { t } = useLanguage()
  const { mode } = useAppMode()

  const description =
    mode === 'rpg'
      ? t('oracle.bannerDescRpg')
      : mode === 'rp'
        ? t('oracle.bannerDescRp')
        : t('oracle.bannerDescGeral')

  return (
    <Link
      to="/oracle"
      className={`oracle-hero-card block rounded-2xl p-5 sm:p-6 overflow-hidden relative group text-left ${className}`}
    >
      {/* Background Arcane Atmosphere */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[rgba(var(--mode-accent-rgb),0.12)] blur-3xl pointer-events-none group-hover:bg-[rgba(var(--mode-accent-rgb),0.18)] transition-colors" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/50 blur-2xl pointer-events-none" />

      {/* Decorative Runic watermark */}
      <div className="absolute right-4 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none text-[hsl(var(--mode-accent))]">
        <RunicCircle className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Animated Arcane Orb / Insignia */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-[rgba(var(--mode-accent-rgb),0.45)] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:border-[rgba(var(--mode-accent-rgb),0.8)] transition-all">
            <ArcaneOrb className="w-9 h-9 sm:w-11 sm:h-11 text-[hsl(var(--mode-accent))] opacity-40 absolute" />
            <RuneOracleIcon className="w-6 h-6 sm:w-7 sm:h-7 mode-accent-text relative z-10 oracle-pulse-icon" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[hsl(var(--mode-accent))] animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[hsl(var(--mode-accent))]" />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(var(--mode-accent-rgb),0.15)] border border-[rgba(var(--mode-accent-rgb),0.35)] text-[11px] font-fantasy uppercase tracking-wider text-[hsl(var(--mode-accent))] shadow-xs">
              <Sparkles className="w-3 h-3 text-[hsl(var(--mode-accent))]" />
              <span>{t('oracle.bannerBadge')}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fantasy text-white group-hover:text-[hsl(var(--mode-accent-light))] transition-colors flex items-center gap-2">
              <span>{t('oracle.bannerTitle')}</span>
            </h3>

            {!compact && (
              <p className="text-xs sm:text-sm text-[#c8bfb0] line-clamp-2 leading-relaxed font-serif max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(var(--mode-accent-rgb),0.18)] hover:bg-[rgba(var(--mode-accent-rgb),0.28)] border border-[rgba(var(--mode-accent-rgb),0.45)] text-[hsl(var(--mode-accent))] text-xs font-fantasy font-bold tracking-wider uppercase shrink-0 transition-all group-hover:border-[rgba(var(--mode-accent-rgb),0.8)] group-hover:shadow-md group-hover:scale-[1.02]">
          <span>{t('oracle.bannerAction')}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

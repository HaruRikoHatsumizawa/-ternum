import React from 'react'
import { cn } from '@/lib/utils'

export interface PfpFrameOption {
  id: string
  name: string
  description: string
  theme: 'rpg' | 'rp' | 'universal'
  category: 'Rúnica' | 'Heráldica' | 'Arcana' | 'Feral Nobre'
}

export const PFP_FRAMES: PfpFrameOption[] = [
  {
    id: 'runic-gold',
    name: 'Ouro Forjado & Runas',
    description: 'Anel duplo de ouro ancestral com gravuras rúnicas da forja.',
    theme: 'rpg',
    category: 'Rúnica',
  },
  {
    id: 'heraldic-crest',
    name: 'Brasão de Armas Obsidiana',
    description: 'Borda facetada de aço negro com cantos heráldicos reforçados.',
    theme: 'rpg',
    category: 'Heráldica',
  },
  {
    id: 'arcane-violet',
    name: 'Aura Espectral Púrpura',
    description: 'Circunferência de névoa de ametista nobre e glifos estelares.',
    theme: 'rp',
    category: 'Arcana',
  },
  {
    id: 'astral-crown',
    name: 'Coroa Noturna de RP',
    description: 'Moldura fina em prata lunar com quatro pontas de constelação.',
    theme: 'rp',
    category: 'Arcana',
  },
  {
    id: 'feral-sigil',
    name: 'Selo Feral dos Guardiões',
    description: 'Círculo adornado com o emblema geométrico sutil dos nobres clãs.',
    theme: 'universal',
    category: 'Feral Nobre',
  },
  {
    id: 'minimal-tome',
    name: 'Aro Clássico de Códice',
    description: 'Borda minimalista e sóbria de pergaminho e couro curtido.',
    theme: 'universal',
    category: 'Rúnica',
  },
]

interface AvatarFrameProps {
  frameId?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
  showBadge?: boolean
}

const SIZE_MAP = {
  sm: {
    container: 'w-8 h-8',
    frameInset: '-inset-[3px]',
    svgSize: 38,
  },
  md: {
    container: 'w-10 h-10',
    frameInset: '-inset-[4px]',
    svgSize: 48,
  },
  lg: {
    container: 'w-16 h-16',
    frameInset: '-inset-[6px]',
    svgSize: 76,
  },
  xl: {
    container: 'w-24 h-24',
    frameInset: '-inset-[8px]',
    svgSize: 112,
  },
}

export function AvatarFrame({
  frameId = 'runic-gold',
  size = 'md',
  children,
  className,
  showBadge = false,
}: AvatarFrameProps) {
  const activeFrame = frameId || 'runic-gold'
  const config = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        config.container,
        className,
      )}
    >
      {/* Moldura SVG Decorativa Sobreposta */}
      <div
        className={cn(
          'absolute pointer-events-none z-10 transition-transform duration-300',
          config.frameInset,
        )}
      >
        {activeFrame === 'runic-gold' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            {/* Círculo externo rúnico pontilhado */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="1.8"
              strokeDasharray="4 2 1 2"
              className="opacity-90"
            />
            {/* Círculo interno contínuo */}
            <circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.2"
              className="opacity-80"
            />
            {/* 4 Pontas Rúnicas Cardeais */}
            <polygon points="50,2 53,7 50,6 47,7" fill="#fde68a" />
            <polygon points="50,98 53,93 50,94 47,93" fill="#fde68a" />
            <polygon points="2,50 7,47 6,50 7,53" fill="#fde68a" />
            <polygon points="98,50 93,47 94,50 93,53" fill="#fde68a" />
          </svg>
        )}

        {activeFrame === 'heraldic-crest' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Moldura octogonal heráldica */}
            <polygon
              points="28,4 72,4 96,28 96,72 72,96 28,96 4,72 4,28"
              fill="none"
              stroke="url(#ironGrad)"
              strokeWidth="2.2"
              className="opacity-90"
            />
            {/* Filete dourado discreto no contorno */}
            <polygon
              points="30,7 70,7 93,30 93,70 70,93 30,93 7,70 7,30"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.8"
              strokeDasharray="6 3"
              className="opacity-60"
            />
            {/* Cantoneiras reforçadas de ferro */}
            <circle cx="28" cy="4" r="1.5" fill="#f59e0b" />
            <circle cx="72" cy="4" r="1.5" fill="#f59e0b" />
            <circle cx="96" cy="28" r="1.5" fill="#f59e0b" />
            <circle cx="96" cy="72" r="1.5" fill="#f59e0b" />
            <circle cx="72" cy="96" r="1.5" fill="#f59e0b" />
            <circle cx="28" cy="96" r="1.5" fill="#f59e0b" />
            <circle cx="4" cy="72" r="1.5" fill="#f59e0b" />
            <circle cx="4" cy="28" r="1.5" fill="#f59e0b" />
          </svg>
        )}

        {activeFrame === 'arcane-violet' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
            </defs>
            {/* Glifo exterior de névoa mágica */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="url(#violetGrad)"
              strokeWidth="1.8"
              strokeDasharray="6 2 2 2"
              className="opacity-95"
            />
            {/* Aro sutil pulsante */}
            <circle
              cx="50"
              cy="50"
              r="43.5"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1"
              className="opacity-75"
            />
            {/* Pequenos cristais de ametista nos eixos diagonais */}
            <polygon points="17,17 21,15 19,19 15,21" fill="#e9d5ff" />
            <polygon points="83,17 79,15 81,19 85,21" fill="#e9d5ff" />
            <polygon points="17,83 21,85 19,81 15,79" fill="#e9d5ff" />
            <polygon points="83,83 79,85 81,81 85,79" fill="#e9d5ff" />
          </svg>
        )}

        {activeFrame === 'astral-crown' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="silverAstral" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
            </defs>
            {/* Círculo astronômico */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#silverAstral)"
              strokeWidth="1.5"
              className="opacity-90"
            />
            {/* Estrela de 4 pontas superior (coroa) */}
            <polygon points="50,1 52,6 57,6 53,9 54,14 50,11 46,14 47,9 43,6 48,6" fill="#f8fafc" />
            {/* Marcadores estelares finos */}
            <circle cx="50" cy="95" r="1.5" fill="#c084fc" />
            <circle cx="5" cy="50" r="1.5" fill="#c084fc" />
            <circle cx="95" cy="50" r="1.5" fill="#c084fc" />
          </svg>
        )}

        {activeFrame === 'feral-sigil' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="feralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="46.5"
              fill="none"
              stroke="url(#feralGrad)"
              strokeWidth="2"
              className="opacity-90"
            />
            {/* Almofadinha rúnica discreta no topo */}
            <g transform="translate(44, 2) scale(0.6)">
              <ellipse cx="10" cy="8" rx="3.5" ry="4" fill="#fcd34d" />
              <ellipse cx="4" cy="4" rx="1.8" ry="2.2" fill="#fcd34d" />
              <ellipse cx="10" cy="1.8" rx="1.8" ry="2.2" fill="#fcd34d" />
              <ellipse cx="16" cy="4" rx="1.8" ry="2.2" fill="#fcd34d" />
            </g>
          </svg>
        )}

        {activeFrame === 'minimal-tome' && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              className="opacity-60"
            />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#334155" strokeWidth="1" />
          </svg>
        )}
      </div>

      {/* Conteúdo interno do Avatar (Imagem ou Fallback) */}
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#090c10]">
        {children}
      </div>

      {/* Pequeno selo decorativo opcional */}
      {showBadge && (
        <div className="absolute -bottom-1 -right-1 z-20 w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-[9px] text-amber-300 font-bold shadow-xs">
          ✦
        </div>
      )}
    </div>
  )
}

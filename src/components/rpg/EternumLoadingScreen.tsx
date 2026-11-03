import React, { useEffect, useState } from 'react'
import { RunicCircle, ArcaneOrb, RunicPawIcon } from './RpgArtwork'

export interface EternumLoadingScreenProps {
  /**
   * Mensagem descritiva discreta exibida abaixo do título
   * @default 'Consultando os tomos arcanos...'
   */
  message?: string
  /**
   * Subtítulo ou dica temática curta
   */
  submessage?: string
  /**
   * Forçar modo visual ('rpg' | 'rp') se conhecido antes do contexto estar montado
   */
  forcedMode?: 'rpg' | 'rp'
  /**
   * Se true, ocupa a tela inteira com fixed e transição de fade.
   * Se false, ocupa o container relativo (h-full / min-h-[300px]) para carregamento interno de páginas.
   * @default true
   */
  fullScreen?: boolean
  /**
   * Quando controlado externamente para animação de saída suave (fade out)
   */
  isExiting?: boolean
  /**
   * Callback disparado quando o fade out termina
   */
  onExited?: () => void
}

/**
 * Tela de carregamento temática com a identidade do Éternum:
 * - Fundo obsidiana profundo (#090c10 / #0c0f14) com gradientes discretos
 * - Círculo rúnico girando suavemente ao redor da orbe arcana com pata geométrica
 * - Nome "Éternum" em Cinzel com brilho forjado e sutil subtítulo
 * - Barra rúnica de progresso pulsante e discreta
 * - Suporte nativo à alternância RPG (ouro rúnico / âmbar) e RP (roxo ametista aristocrático)
 */
export function EternumLoadingScreen({
  message = 'Consultando os tomos arcanos...',
  submessage,
  forcedMode,
  fullScreen = true,
  isExiting = false,
  onExited,
}: EternumLoadingScreenProps) {
  const [activeMode, setActiveMode] = useState<'rpg' | 'rp'>('rpg')

  useEffect(() => {
    if (forcedMode) {
      setActiveMode(forcedMode)
      return
    }
    // Tenta detectar pelo localStorage ou pela classe na raiz html
    const saved = typeof window !== 'undefined' ? localStorage.getItem('eternum_app_mode') : null
    if (saved === 'rp' || saved === 'rpg') {
      setActiveMode(saved)
      return
    }
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('mode-rp')) {
      setActiveMode('rp')
    }
  }, [forcedMode])

  useEffect(() => {
    if (isExiting && onExited) {
      const timer = setTimeout(() => {
        onExited()
      }, 450)
      return () => clearTimeout(timer)
    }
  }, [isExiting, onExited])

  const isRp = activeMode === 'rp'

  // Paletas discretas e refinadas
  const glowColor = isRp ? 'rgba(157, 78, 221, 0.18)' : 'rgba(231, 171, 44, 0.16)'
  const accentBorder = isRp ? 'border-purple-500/30' : 'border-amber-500/30'
  const accentText = isRp ? 'text-purple-300' : 'text-amber-300'
  const subAccentText = isRp ? 'text-purple-200/70' : 'text-amber-200/70'
  const barGradient = isRp
    ? 'from-purple-600 via-purple-400 to-purple-300'
    : 'from-amber-600 via-amber-400 to-amber-200'

  const content = (
    <div
      className={`relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-sm select-none transition-all duration-500 ${
        isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {/* Orbe Central e Círculo Rúnico em rotação contínua e suave */}
      <div className="relative flex items-center justify-center w-28 h-28 mb-5">
        {/* Glow de fundo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-colors duration-700 animate-pulse"
          style={{ backgroundColor: glowColor }}
        />

        {/* Círculo Rúnico externo girando devagar */}
        <div className="absolute inset-0 flex items-center justify-center animate-[spin_24s_linear_infinite] opacity-60">
          <RunicCircle className={`w-28 h-28 ${accentText}`} />
        </div>

        {/* Círculo Rúnico contra-rotacionando discretamente */}
        <div className="absolute inset-2 flex items-center justify-center animate-[spin_16s_linear_infinite_reverse] opacity-40">
          <RunicCircle className={`w-24 h-24 ${accentText}`} />
        </div>

        {/* Orbe arcana central */}
        <div className="relative z-10 flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
          <ArcaneOrb className={`w-14 h-14 ${accentText} drop-shadow-md`} />
          {/* Pata geométrica sutil e heráldica dentro da orbe */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <RunicPawIcon className={`w-5 h-5 ${accentText} opacity-90 drop-shadow-sm`} />
          </div>
        </div>
      </div>

      {/* Nome e subtítulo Éternum com tipografia Cinzel */}
      <div className="space-y-1 mb-4">
        <h1
          className={`text-2xl sm:text-3xl font-fantasy font-extrabold tracking-widest uppercase transition-colors duration-300 ${
            isRp
              ? 'bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400'
              : 'bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400'
          } bg-clip-text text-transparent drop-shadow-sm`}
        >
          Éternum
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className={`h-px w-6 ${isRp ? 'bg-purple-500/40' : 'bg-amber-500/40'}`} />
          <p
            className={`text-[10px] font-fantasy font-semibold tracking-wider uppercase ${subAccentText}`}
          >
            {isRp ? 'Grimório de RP & Crônicas' : 'O Grimório da Campanha'}
          </p>
          <span className={`h-px w-6 ${isRp ? 'bg-purple-500/40' : 'bg-amber-500/40'}`} />
        </div>
      </div>

      {/* Linha / barra de progresso rúnica fina e discreta */}
      <div
        className={`w-44 h-1 rounded-full bg-[#141824] border ${accentBorder} overflow-hidden mb-3.5 relative shadow-inner`}
      >
        <div
          className={`h-full w-2/5 rounded-full bg-gradient-to-r ${barGradient} animate-[pulse_1.8s_ease-in-out_infinite] shadow-xs`}
          style={{
            animation: 'eternumShimmer 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      </div>

      {/* Mensagem e submensagem discretas */}
      <p className="text-xs text-[#b8b0a0] font-sans font-medium tracking-wide leading-relaxed">
        {message}
      </p>
      {submessage && (
        <p className={`text-[11px] font-fantasy ${subAccentText} mt-0.5 opacity-80`}>
          {submessage}
        </p>
      )}
    </div>
  )

  if (!fullScreen) {
    return (
      <div
        className={`relative w-full h-full min-h-[260px] flex items-center justify-center bg-[#0c0f14]/80 rounded-xl overflow-hidden ${
          isExiting ? 'opacity-0 transition-opacity duration-300' : 'opacity-100'
        }`}
      >
        {/* Glow discreto de fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {content}
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#090c10] text-[#f1ede3] transition-opacity duration-400 ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 40%, ${glowColor}, transparent 75%), radial-gradient(ellipse 80% 60% at 50% 100%, #07090d, #090c10)`,
      }}
      role="status"
      aria-label="Carregando Éternum"
    >
      {content}
    </div>
  )
}

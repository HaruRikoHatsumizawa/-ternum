import React from 'react'

export interface EternumIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number | string
}

/**
 * 1. Início / Salão Principal / Salão de Narrativa:
 * Portal em arco ogival místico com orbe focal ascendente e pedestal rúnico.
 * Silhueta: Arco ogival / Portal vertical esbelto.
 */
export function RuneCrestIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Arco ogival exterior do portal */}
      <path
        d="M4 21 V12 C4 6.5 12 2.5 12 2.5 C12 2.5 20 6.5 20 12 V21"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Moldura rúnica interna em arco */}
      <path
        d="M7 21 V13 C7 8.5 12 5.5 12 5.5 C12 5.5 17 8.5 17 13 V21"
        strokeWidth="1"
        strokeDasharray="2 1.5"
        opacity="0.65"
      />
      {/* Soleira / base do portal */}
      <line x1="2.5" y1="21" x2="21.5" y2="21" strokeWidth="1.6" strokeLinecap="round" />
      {/* Orbe sagrado flutuando no coração do portal */}
      <circle cx="12" cy="12" r="2.2" strokeWidth="1.3" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      {/* Raio estelar ascendente */}
      <line x1="12" y1="8" x2="12" y2="9.8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="14.2" x2="12" y2="16" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 2. Fichas e Crônicas:
 * Pergaminho medieval aberto na diagonal com pontas enroladas e pena (quill) cruzada.
 * Silhueta: Folha/rolo retangular fluido com pena longa oblíqua.
 */
export function RuneScrollIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Rolo superior virado */}
      <path
        d="M4.5 5.5 C4.5 4 6 3 8 3 L17.5 3 C19 3 20 4 20 5 C20 6.2 19 7 17.5 7 L5.5 7 C4.5 7 4 6.2 4.5 5.5 Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Corpo principal do pergaminho */}
      <path
        d="M5 7 L5 18 C5 19.8 6.5 21 8.5 21 L16.5 21 C18.5 21 19.5 19.8 19.5 18 L19.5 7"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rolo inferior dobrado */}
      <path d="M5 18.5 C5 19.8 6.2 20.8 7.8 20.8 L18 20.8" strokeWidth="1.2" opacity="0.7" />
      {/* Linhas de escrita rúnica */}
      <line x1="8" y1="10" x2="14" y2="10" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="8" y1="13" x2="16" y2="13" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="8" y1="16" x2="12" y2="16" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Pena de escriba pousada na lateral direita */}
      <path
        d="M14 19 L18.5 9 C19.5 7 21 4 21 3 C20 4.5 17.5 6 16.5 8 L13 15"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * 3. Mural de Missões / Quests:
 * Espada rúnica de lâmina triangular erguida sobreposta a estandarte heráldico bifurcado.
 * Silhueta: Espada vertical marcial com guarda alada e pontas de estandarte.
 */
export function RuneSwordIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Estandarte / flâmula de fundo bifurcada */}
      <path
        d="M5 4.5 H19 V14 L12 11 L5 14 Z"
        strokeWidth="1"
        strokeDasharray="2 1.5"
        opacity="0.45"
      />
      {/* Ponta e lâmina da espada */}
      <path
        d="M12 2 L14 5 L13.5 15 L12 16.2 L10.5 15 L10 5 Z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      <line x1="12" y1="3" x2="12" y2="15" strokeWidth="1" opacity="0.7" />
      {/* Guarda heráldica alada */}
      <path
        d="M6 15.5 L10.5 15.5 L12 16.5 L13.5 15.5 L18 15.5 L17 17.5 L13 17 L12 17.5 L11 17 L7 17.5 Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.3"
        strokeLinejoin="round"
      />
      {/* Empunhadura e pomo com gema */}
      <line x1="12" y1="17.5" x2="12" y2="21" strokeWidth="1.6" strokeLinecap="round" />
      <polygon points="12,21 13.5,22.5 12,23.5 10.5,22.5" strokeWidth="1" fill="currentColor" />
    </svg>
  )
}

/**
 * 4. Códices Arcanos / Bestiários / Tabelas:
 * Grimório clássico aberto horizontalmente, com páginas arqueadas e encadernação central.
 * Silhueta: Livro aberto em V com fitas e lombada.
 */
export function RuneTomeIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Páginas abertas em curva */}
      <path
        d="M2.5 6 C6.5 4.5 10.5 4.8 12 6.5 C13.5 4.8 17.5 4.5 21.5 6 V19.5 C17.5 18 13.5 18.2 12 20 C10.5 18.2 6.5 18 2.5 19.5 Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lombada central */}
      <line x1="12" y1="6.5" x2="12" y2="20" strokeWidth="1.5" strokeLinecap="round" />
      {/* Marcador de página / fita rúnica */}
      <path d="M12 6.5 V2.5 L14 4 L12 5.5" strokeWidth="1" strokeLinejoin="round" />
      {/* Linhas de encantamento nas duas páginas */}
      <line
        x1="5.5"
        y1="10"
        x2="9.5"
        y2="9.5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="5.5"
        y1="13"
        x2="9.5"
        y2="12.5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="5.5"
        y1="16"
        x2="8.5"
        y2="15.5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="14.5"
        y1="9.5"
        x2="18.5"
        y2="10"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="14.5"
        y1="12.5"
        x2="18.5"
        y2="13"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="15.5"
        y1="15.5"
        x2="18.5"
        y2="16"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

/**
 * 4b. Glossário Arcano:
 * Tomo léxico FECHADO (distinto do Códice aberto) com selo rúnico na capa
 * e lupa de escriba — o verbete pesquisado.
 * Silhueta: Volume fechado vertical com lente circular e cabo.
 */
export function RuneLexiconIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Capa fechada do tomo léxico */}
      <path
        d="M4.5 3.5 H16.5 C18.4 3.5 19.5 4.9 19.5 6.8 V17.2 C19.5 19.1 18.4 20.5 16.5 20.5 H4.5 Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lombada com cortes de encadernação */}
      <path d="M7 3.5 V20.5" strokeWidth="1" opacity="0.7" />
      <path d="M4.5 7 H7 M4.5 17 H7" strokeWidth="1" opacity="0.6" />
      {/* Selo rúnico estampado na capa */}
      <circle cx="10.5" cy="8.5" r="2.3" strokeWidth="1.2" fill="currentColor" fillOpacity="0.18" />
      <path
        d="M10.5 7.2 L11.6 9.6 L10.5 8.6 L9.4 9.6 Z"
        strokeWidth="0.8"
        fill="currentColor"
        strokeLinejoin="round"
      />
      {/* Lupa de escriba sobre o verbete */}
      <circle cx="14.5" cy="14.5" r="3.1" strokeWidth="1.4" />
      <line x1="16.8" y1="16.8" x2="20" y2="20" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 5. Calendário de Sessões / Encontros:
 * Astrolábio astronômico esférico com anéis cruzados, ponteiro e lua crescente.
 * Silhueta: Círculo astronômico com anel equatorial suspenso por argola.
 */
export function RuneAstrolabeIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Argola superior de suspensão */}
      <circle cx="12" cy="3" r="1.5" strokeWidth="1.3" />
      <line x1="12" y1="4.5" x2="12" y2="5.5" strokeWidth="1.4" />
      {/* Anel exterior do astrolábio */}
      <circle cx="12" cy="13.5" r="8" strokeWidth="1.5" />
      {/* Elipse equatorial inclinada de navegação celeste */}
      <ellipse
        cx="12"
        cy="13.5"
        rx="8"
        ry="3.2"
        strokeWidth="1.1"
        strokeDasharray="2 1.5"
        opacity="0.75"
      />
      {/* Lua crescente interior */}
      <path
        d="M13.5 9 C11 10 9.8 12.5 10.2 15 C10.6 17 12 18 14 18 C11.5 17 11 14 12.5 11.5 C13 10.5 14 9.5 15.2 9 C14.5 8.9 14 8.9 13.5 9 Z"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      {/* Eixo central e gema focal */}
      <line x1="12" y1="5.5" x2="12" y2="21.5" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="13.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

/**
 * 6. Forja do Tesouro (Loot) / Relíquias:
 * Bigorna ancestral com martelo pesado inclinado e centelha de forja rúnica.
 * Silhueta: Bigorna horizontal robusta com bico lateral e martelo pousado.
 */
export function RuneHammerIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Bigorna: tampo, bico cônico esquerdo e corpo */}
      <path
        d="M3 13 L6 13 L8 14 L18 14 C19.5 14 20.5 14.8 20 16 L17 17 L18 20 L6 20 L7 17 L5 16 C3 15 2 14 3 13 Z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.16"
        strokeLinejoin="round"
      />
      {/* Base sólida da bigorna */}
      <line x1="5" y1="20" x2="19" y2="20" strokeWidth="1.6" strokeLinecap="round" />
      {/* Martelo forjador inclinado */}
      <g transform="rotate(-30 14 6)">
        <rect
          x="12"
          y="3"
          width="7"
          height="4.5"
          rx="1"
          strokeWidth="1.3"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <line x1="15.5" y1="7.5" x2="15.5" y2="15" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Centelhas / Faíscas de forja no ponto de impacto */}
      <path
        d="M14 10 L14.8 8.5 L15.6 10 L17 10.5 L15.6 11 L14.8 12.5 L14 11 L12.5 10.5 Z"
        strokeWidth="0.9"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * 7. Fichas de NPCs / Personagens / Relações:
 * Busto heráldico nobre estilizado, coroa/tiara sutil e manto com broche.
 * Silhueta: Perfil nobre de cabeça e ombros aristocráticos.
 */
export function RuneNpcIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Tiara / Coroa rúnica sutil com orelhas discretas de fera nobre */}
      <path
        d="M8.5 7.5 L9.5 3.5 L11 6.5 L12 5 L13 6.5 L14.5 3.5 L15.5 7.5"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cabeça / Máscara nobre */}
      <path
        d="M9 7.5 C8 9.5 8 12 9.5 13.5 L12 15 L14.5 13.5 C16 12 16 9.5 15 7.5 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      {/* Gema rúnica no centro da fronte */}
      <circle cx="12" cy="10" r="1.1" fill="currentColor" />
      {/* Ombros e capa aristocrática */}
      <path
        d="M3.5 21 C3.5 17.5 7 15.5 10.5 15.5 L12 17 L13.5 15.5 C17 15.5 20.5 17.5 20.5 21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Broche do manto */}
      <polygon points="12,17.5 13.2,19 12,20.2 10.8,19" strokeWidth="0.9" fill="currentColor" />
    </svg>
  )
}

/**
 * 8. Oráculo de Éternum (IA Arcana):
 * Olho profético místico inscrito dentro de um losango/cristal com pupila de fenda e raios.
 * Silhueta: Losango vertical radiante com olho estelar.
 */
export function RuneOracleIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Cristal / Losango arcano exterior */}
      <polygon points="12,2 21,12 12,22 3,12" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Olho místico aberto no horizonte */}
      <path
        d="M5 12 C7.5 8.5 10 7.8 12 7.8 C14 7.8 16.5 8.5 19 12 C16.5 15.5 14 16.2 12 16.2 C10 16.2 7.5 15.5 5 12 Z"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      {/* Íris e pupila viva em cristal */}
      <circle cx="12" cy="12" r="2.4" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="0.9" ry="1.8" fill="currentColor" />
      {/* Raios pontuais de adivinhação nos vértices */}
      <line x1="12" y1="3.5" x2="12" y2="6" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="20.5" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.5" y1="12" x2="6.5" y2="12" strokeWidth="1" strokeLinecap="round" />
      <line x1="17.5" y1="12" x2="19.5" y2="12" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 9. Santuário / Configurações:
 * Engrenagem rúnica ancestral mecânica com 8 dentes angulares e miolo vazado octogonal.
 * Silhueta: Engrenagem denteada inconfundível.
 */
export function RuneGearIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Roda dentada exterior com dentes chanfrados */}
      <path
        d="M10 2.5 H14 L14.5 5 C15.5 5.4 16.4 6 17.2 6.8 L19.5 5.8 L21.5 8.2 L19.8 10.2 C20.1 11.2 20.2 12.2 20 13.2 L22 14.8 L20.5 17.8 L18 17.2 C17.2 18 16.2 18.7 15.2 19.1 L14.5 21.5 H10 L9.4 19.1 C8.3 18.7 7.4 18 6.5 17.2 L4.2 18 L2.5 15.5 L4.3 13.5 C4.1 12.5 4.1 11.5 4.4 10.5 L2.5 8.5 L4.5 6 L6.8 6.8 C7.6 6 8.5 5.4 9.5 5 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.12"
        strokeLinejoin="round"
      />
      {/* Círculo interno */}
      <circle cx="12" cy="12" r="4.2" strokeWidth="1.4" />
      {/* Eixo central em gema */}
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}

/**
 * 10. Busca / Consultar Oráculo:
 * Lente de adivinhação geométrica com feixe óptico e cabo entalhado.
 */
export function RuneSearchIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <circle cx="10" cy="10" r="6.8" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4.5" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.6" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
      <line x1="15" y1="15" x2="21" y2="21" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="21" cy="21" r="0.9" fill="currentColor" />
    </svg>
  )
}

/**
 * Insígnias Rúnicas SVG autorais para substituir emojis (Frente 1 e Frente 2):
 * Usadas em fichas, bestiários, tipos de loot, cards e seletores de ícones.
 */

// Gema / Cristal arcano (substitui 💎)
export function RuneGemIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 3.5 L18 3.5 L22 9 L12 21.5 L2 9 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.2" />
      <line x1="6" y1="3.5" x2="10" y2="9" strokeWidth="1.1" />
      <line x1="18" y1="3.5" x2="14" y2="9" strokeWidth="1.1" />
      <line x1="10" y1="9" x2="12" y2="21.5" strokeWidth="1.1" />
      <line x1="14" y1="9" x2="12" y2="21.5" strokeWidth="1.1" />
    </svg>
  )
}

// Escudo heráldico (substitui 🛡️)
export function RuneShieldIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2.5 C16 3 20 4.5 20 6.5 C20 14 16 19.5 12 22 C8 19.5 4 14 4 6.5 C4 4.5 8 3 12 2.5 Z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        strokeWidth="1.1"
        strokeDasharray="2 1.5"
        opacity="0.7"
      />
      <line x1="7" y1="10" x2="17" y2="10" strokeWidth="1.1" opacity="0.7" />
      <circle cx="12" cy="10" r="1.3" fill="currentColor" />
    </svg>
  )
}

// Chama / Fogo rúnico (substitui 🔥)
export function RuneFlameIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2 C12 2 15 5.5 15 8 C15 9.5 14 10.5 13 11 C16 11 19 13.5 19 17 C19 20 16 22 12 22 C8 22 5 20 5 17 C5 13.5 8 11.5 10 9 C10.5 6 12 2 12 2 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 13 C13.5 13 15 14.5 15 16.5 C15 18.5 13.5 19.5 12 19.5 C10.5 19.5 9 18.5 9 16.5 C9 14.5 11 13.5 12 13 Z"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}

// Frasco / Poção / Elixir (substitui 🧪)
export function RunePotionIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d="M10 2.5 H14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="2.5" x2="11" y2="6.5" strokeWidth="1.3" />
      <line x1="13" y1="2.5" x2="13" y2="6.5" strokeWidth="1.3" />
      <path
        d="M11 6.5 L6 16 C5 18 6.5 21.5 10 21.5 H14 C17.5 21.5 19 18 18 16 L13 6.5 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.15"
        strokeLinejoin="round"
      />
      {/* Nível do líquido */}
      <path
        d="M7.8 15 C9 14.2 10.5 14.8 12 14.2 C13.5 13.6 15 14.5 16.2 15 L17 17 C16.5 19.5 15 20.5 12 20.5 C9 20.5 7.5 19.5 7 17 Z"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="10" cy="17.5" r="0.8" fill="currentColor" />
      <circle cx="13.5" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

// Chave antiga / Curiosidade (substitui 🗝️)
export function RuneKeyIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Cabeça da chave em formato de trevo/losango */}
      <circle cx="7.5" cy="7.5" r="4.5" strokeWidth="1.4" />
      <circle cx="7.5" cy="7.5" r="2" strokeWidth="1.1" fill="currentColor" fillOpacity="0.2" />
      {/* Haste longa */}
      <line x1="11" y1="11" x2="21" y2="21" strokeWidth="1.6" strokeLinecap="round" />
      {/* Dentes da chave */}
      <path d="M18 18 L20 16" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19.5 19.5 L22 17" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// Anel / Relíquia / Aliança sagrada (substitui 💍)
export function RuneRingIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Aro do anel */}
      <circle cx="12" cy="14" r="6.8" strokeWidth="1.5" />
      <circle cx="12" cy="14" r="4.5" strokeWidth="1" strokeDasharray="2 1.5" opacity="0.6" />
      {/* Gema engastada no topo */}
      <polygon
        points="12,2.5 15,5.5 13.5,7.5 10.5,7.5 9,5.5"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Arco e Flecha (substitui 🏹)
export function RuneBowIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Arco curvo */}
      <path d="M4.5 4 C11 5 18 10 20 20" strokeWidth="1.5" strokeLinecap="round" />
      {/* Corda do arco */}
      <line x1="4.5" y1="4" x2="20" y2="20" strokeWidth="1" strokeDasharray="2 1.5" opacity="0.7" />
      {/* Flecha cruzada */}
      <line x1="5" y1="19" x2="19" y2="5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 5 H19 V9.5" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

// Fera Nobre Canina / Lobo (substitui 🐺)
export function RuneWolfIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Silhueta geométrica elegante de lobo / fera canina nobre */}
      <path
        d="M5 6 L8 3 L10.5 7 L13.5 7 L16 3 L19 6 L18 12 L15 15 L12 18.5 L9 15 L6 12 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      {/* Olhos rúnicos */}
      <circle cx="9.5" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="10" r="0.9" fill="currentColor" />
      {/* Focinho nobre e marcas rúnicas */}
      <polygon points="12,14 13,15.5 11,15.5" strokeWidth="0.8" fill="currentColor" />
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="0.9" opacity="0.6" />
    </svg>
  )
}

// Fera Nobre Astuta / Raposa (substitui 🦊)
export function RuneFoxIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Orelhas pontudas e rosto triangular refinado */}
      <path
        d="M4 5 L8 3.5 L10 8 L14 8 L16 3.5 L20 5 L17 13 L12 20.5 L7 13 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      {/* Bochechas brancas/pelagem geométrica */}
      <path d="M7 13 L10 12 L12 17 L14 12 L17 13" strokeWidth="1" opacity="0.6" />
      <circle cx="9" cy="9.5" r="0.9" fill="currentColor" />
      <circle cx="15" cy="9.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

// Fera Felina / Leopardo (substitui 🐆)
export function RuneFelineIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Orelhas arredondadas felinas */}
      <path
        d="M6 7 C5 5 7 3.5 9 5 L10.5 7.5 H13.5 L15 5 C17 3.5 19 5 18 7 L19 12 C18.5 16 15.5 19 12 19 C8.5 19 5.5 16 5 12 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.9" fill="currentColor" />
      <polygon points="12,14 13,15.5 11,15.5" strokeWidth="0.8" fill="currentColor" />
    </svg>
  )
}

// Dragão Ancestral / Répteis Nobres (substitui 🐉)
export function RuneDragonIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Cabeça com chifres curvados */}
      <path
        d="M5 3 C7 4.5 9 6.5 10 9 L12 7 L14 9 C15 6.5 17 4.5 19 3 C18 6 17 8 18 10 L20 13 L17 15 L12 21 L7 15 L4 13 L6 10 C7 8 6 6 5 3 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11.5" r="0.9" fill="currentColor" />
      <circle cx="14.5" cy="11.5" r="0.9" fill="currentColor" />
      <line x1="12" y1="12" x2="12" y2="16" strokeWidth="1" opacity="0.7" />
    </svg>
  )
}

// Águia / Ave Nobre (substitui 🦅)
export function RuneEagleIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Bico recurvo e cabeça com penacho */}
      <path
        d="M6 9 C6 5 9 3 13 3 C17 3 20 6 20 10 C20 13 18 15.5 15 16 L12 21 C11.5 19 10 16 8 15 C7 14 6 12 6 9 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
        strokeLinejoin="round"
      />
      {/* Bico pontudo adunco */}
      <path d="M15 11 L22 13 L18 15" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="13" cy="8.5" r="1" fill="currentColor" />
    </svg>
  )
}

// Centelha / Estrela Mística (substitui ✨)
export function RuneSparkleIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2 L13.8 8.2 L20 10 L13.8 11.8 L12 18 L10.2 11.8 L4 10 L10.2 8.2 Z"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="4" r="1.2" fill="currentColor" opacity="0.8" />
      <circle cx="5" cy="18" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
export const RuneSparklesIcon = RuneSparkleIcon

// Caveira Rúnica / Vilão / Letalidade (substitui 💀)
export function RuneSkullIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 11 C6 6.5 8.7 3.5 12 3.5 C15.3 3.5 18 6.5 18 11 C18 13.5 17 15.5 15.5 16.5 L15.5 19.5 C15.5 20 15 20.5 14.5 20.5 H9.5 C9 20.5 8.5 20 8.5 19.5 L8.5 16.5 C7 15.5 6 13.5 6 11 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11.5" r="1.5" fill="currentColor" />
      <circle cx="14.5" cy="11.5" r="1.5" fill="currentColor" />
      <path d="M12 14.2 L11.2 15.8 H12.8 Z" fill="currentColor" />
      <line x1="10" y1="18.5" x2="10" y2="20.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="18.5" x2="12" y2="20.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="18.5" x2="14" y2="20.5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Linha do Tempo / Crônicas / Épocas Rúnicas
export function RuneTimelineIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Eixo vertical com setas de eras */}
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2.5" strokeWidth="1.3" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.3" fill="currentColor" fillOpacity="0.4" />
      <circle cx="12" cy="18" r="2.5" strokeWidth="1.3" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 6 H17.5" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 12 H12" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 18 H17.5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
export const RuneChronicleIcon = RuneTimelineIcon

// Vínculos / Laços Heroicos / Aliança (substitui 🤝 / laços)
export function RuneBondsIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <circle cx="8" cy="12" r="5" strokeWidth="1.4" fill="currentColor" fillOpacity="0.15" />
      <circle cx="16" cy="12" r="5" strokeWidth="1.4" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M12 8.5 C13 9.5 13 14.5 12 15.5 C11 14.5 11 9.5 12 8.5 Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" />
      <circle cx="16" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

/**
 * 11. Combate Tático / Ordem de Iniciativa / Confronto:
 * Escudo heráldico facetado com duas lâminas rúnicas cruzadas e orbe de precisão.
 * Silhueta: Lâminas cruzadas em X com escudo e gema rúnica central.
 */
/**
 * 10b. Compêndio de Raças & Poderes:
 * Tomo aberto irradiando feixes elementares e runa estelar de linhagem.
 * Silhueta: Tomo aberto em V com estrela central e faíscas arcanas.
 */
export function RuneCompendiumIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Páginas abertas do compêndio arcano */}
      <path
        d="M12 6.5 C9.5 4.8 5.5 5 2.5 5.8 V18.2 C5.8 17.5 9.5 17.3 12 19 C14.5 17.3 18.2 17.5 21.5 18.2 V5.8 C18.5 5 14.5 4.8 12 6.5 Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Lombada central */}
      <line x1="12" y1="6.5" x2="12" y2="19" strokeWidth="1.4" />
      {/* Estrela / Runa de linhagem e poder emergindo do centro */}
      <path
        d="M12 2.2 L12.8 4.2 L14.8 5 L12.8 5.8 L12 7.8 L11.2 5.8 L9.2 5 L11.2 4.2 Z"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.4"
        strokeLinejoin="round"
      />
      {/* Linhas de runas nas páginas */}
      <path
        d="M5.5 9.5 H9 M5.5 12.5 H9.5 M5.5 15 H8.5"
        strokeWidth="1"
        opacity="0.65"
        strokeLinecap="round"
      />
      <path
        d="M14.5 9.5 H18.5 M14.5 12.5 H18.5 M15.5 15 H18.5"
        strokeWidth="1"
        opacity="0.65"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 10c. Mochila / Algibeira do Aventureiro (Inventário de RPG):
 * Mochila de couro reforçada com fivelas, bolsos laterais e cordão rúnico.
 * Silhueta: Bolsa de viagem com aba superior e fivelas verticais.
 */
export function RuneBackpackIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Alça superior da mochila */}
      <path d="M9 4.5 C9 3.1 10.3 2 12 2 C13.7 2 15 3.1 15 4.5 V5.5 H9 Z" strokeWidth="1.3" />
      {/* Corpo principal da mochila */}
      <rect x="5.5" y="5.5" width="13" height="15.5" rx="2.5" strokeWidth="1.4" />
      {/* Aba superior fechando a boca */}
      <path d="M5.5 10.5 C7.5 12 10 12.8 12 12.8 C14 12.8 16.5 12 18.5 10.5" strokeWidth="1.3" />
      {/* Bolso frontal */}
      <rect
        x="8"
        y="14"
        width="8"
        height="5"
        rx="1.2"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Tiras de fivela verticais */}
      <line x1="8.5" y1="5.5" x2="8.5" y2="12" strokeWidth="1.1" opacity="0.75" />
      <line x1="15.5" y1="5.5" x2="15.5" y2="12" strokeWidth="1.1" opacity="0.75" />
      {/* Fivelas centrais */}
      <rect x="7.8" y="8" width="1.4" height="2" rx="0.3" fill="currentColor" />
      <rect x="14.8" y="8" width="1.4" height="2" rx="0.3" fill="currentColor" />
    </svg>
  )
}

/**
 * 10d. Máscara / Dado de Cultura Nerd (Dicionário Nerd):
 * Par de máscaras teatrais ou orbe multifacetado rúnico.
 * Silhueta: Máscara rúnica estilizada de interpretação (persona/alter-ego).
 */
export function RuneNerdIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Contorno da máscara dramática de RP / Fandom */}
      <path
        d="M4.5 6 C4.5 4.5 6.2 3.5 12 3.5 C17.8 3.5 19.5 4.5 19.5 6 V13 C19.5 17.5 16 20.5 12 21 C8 20.5 4.5 17.5 4.5 13 Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Fendas dos olhos */}
      <path
        d="M7.8 9.5 C8.8 8.8 10.2 9.5 10.2 10.5 C10.2 11.2 9.2 11.8 7.8 11.2 Z"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <path
        d="M16.2 9.5 C15.2 8.8 13.8 9.5 13.8 10.5 C13.8 11.2 14.8 11.8 16.2 11.2 Z"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.35"
      />
      {/* Runa na testa da máscara (fandom/lore) */}
      <circle cx="12" cy="6.8" r="1.1" fill="currentColor" />
      {/* Sorriso enigmático de dramatização */}
      <path d="M8.5 15.2 C10.2 16.8 13.8 16.8 15.5 15.2" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function RuneD20Icon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Contorno do Icosaedro d20 */}
      <polygon
        points="12,2 21.5,7.5 21.5,16.5 12,22 2.5,16.5 2.5,7.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Triângulo frontal central (onde brilha a face do dado) */}
      <polygon
        points="12,6.5 18,15.5 6,15.5"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
      {/* Arestas conectando os vértices do triângulo central aos vértices externos */}
      <line x1="12" y1="2" x2="12" y2="6.5" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2.5" y1="7.5" x2="6" y2="15.5" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="21.5" y1="7.5" x2="18" y2="15.5" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12" y1="6.5" x2="2.5" y2="7.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="6.5" x2="21.5" y2="7.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="15.5" x2="2.5" y2="16.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="15.5" x2="21.5" y2="16.5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="15.5" x2="12" y2="22" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="18" y1="15.5" x2="12" y2="22" strokeWidth="1.3" strokeLinecap="round" />
      {/* Ponto focal rúnico no centro */}
      <circle cx="12" cy="12.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function RuneCombatIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Lâmina 1 (Diagonal /) */}
      <line x1="4.5" y1="19.5" x2="19.5" y2="4.5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Ponta da espada 1 */}
      <path d="M16.5 4.5 L19.5 4.5 L19.5 7.5" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Guarda da espada 1 */}
      <line x1="5.5" y1="16.5" x2="8.5" y2="19.5" strokeWidth="1.4" strokeLinecap="round" />
      {/* Pomo 1 */}
      <circle cx="4" cy="20" r="0.9" fill="currentColor" />

      {/* Lâmina 2 (Diagonal \) */}
      <line x1="19.5" y1="19.5" x2="4.5" y2="4.5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Ponta da espada 2 */}
      <path d="M7.5 4.5 L4.5 4.5 L4.5 7.5" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Guarda da espada 2 */}
      <line x1="18.5" y1="16.5" x2="15.5" y2="19.5" strokeWidth="1.4" strokeLinecap="round" />
      {/* Pomo 2 */}
      <circle cx="20" cy="20" r="0.9" fill="currentColor" />

      {/* Escudo facetado no ponto de cruzamento */}
      <path
        d="M12 7.5 L15.5 9.5 V13.5 C15.5 15.8 12 17.5 12 17.5 C12 17.5 8.5 15.8 8.5 13.5 V9.5 Z"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.22"
        strokeLinejoin="round"
      />
      {/* Runa central focal do escudo */}
      <circle cx="12" cy="12.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

// Busto / Silhueta Nobre (substitui 👤)
export function RuneUserIcon({ className = 'w-4 h-4', size, ...props }: EternumIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="8" r="4.2" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M5 20.5 C5 16.5 8 14.5 12 14.5 C16 14.5 19 16.5 19 20.5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Seletor universal de insígnia rúnica por chave textual (elimina emojis em todo o sistema)
 */
export type RunicInsigniaKey =
  | 'scroll'
  | 'sword'
  | 'tome'
  | 'astrolabe'
  | 'hammer'
  | 'npc'
  | 'oracle'
  | 'gear'
  | 'gem'
  | 'shield'
  | 'flame'
  | 'potion'
  | 'key'
  | 'ring'
  | 'bow'
  | 'wolf'
  | 'fox'
  | 'feline'
  | 'dragon'
  | 'eagle'
  | 'sparkle'
  | 'crest'
  | 'user'
  | 'combat'
  | 'compendium'
  | 'backpack'
  | 'nerd'
  | 'd20'
  | 'timeline'
  | 'chronicle'
  | 'bonds'

export const RUNIC_INSIGNIA_CATALOG: { id: RunicInsigniaKey; label: string }[] = [
  { id: 'd20', label: 'Dado Rúnico d20' },
  { id: 'compendium', label: 'Compêndio de Poderes' },
  { id: 'backpack', label: 'Mochila de Aventureiro' },
  { id: 'nerd', label: 'Máscara Dramática' },
  { id: 'combat', label: 'Combate Tático' },
  { id: 'timeline', label: 'Linha do Tempo / Crônicas' },
  { id: 'bonds', label: 'Laços & Alianças' },
  { id: 'sword', label: 'Espada de Honra' },
  { id: 'wolf', label: 'Lobo Nobre' },
  { id: 'fox', label: 'Raposa Astuta' },
  { id: 'feline', label: 'Leopardo Ágil' },
  { id: 'dragon', label: 'Dragão Guardião' },
  { id: 'eagle', label: 'Águia Espectral' },
  { id: 'shield', label: 'Escudo Protetor' },
  { id: 'scroll', label: 'Pergaminho Sagrado' },
  { id: 'oracle', label: 'Olho do Oráculo' },
  { id: 'bow', label: 'Arco de Caça' },
  { id: 'gem', label: 'Gema Estelar' },
  { id: 'flame', label: 'Chama Eterna' },
]

export function RunicInsignia({
  name,
  className = 'w-4 h-4',
  size,
  ...props
}: EternumIconProps & { name?: string | null }) {
  const norm = (name || '').trim().toLowerCase()

  // Converte legados de emojis para nomes autorais sem falhas
  if (norm === 'sword' || norm === '⚔️' || norm === '⚔')
    return <RuneSwordIcon className={className} size={size} {...props} />
  if (norm === 'wolf' || norm === '🐺')
    return <RuneWolfIcon className={className} size={size} {...props} />
  if (norm === 'fox' || norm === '🦊')
    return <RuneFoxIcon className={className} size={size} {...props} />
  if (norm === 'feline' || norm === 'leopard' || norm === '🐆')
    return <RuneFelineIcon className={className} size={size} {...props} />
  if (norm === 'dragon' || norm === '🐉')
    return <RuneDragonIcon className={className} size={size} {...props} />
  if (norm === 'eagle' || norm === '🦅')
    return <RuneEagleIcon className={className} size={size} {...props} />
  if (norm === 'shield' || norm === '🛡️' || norm === '🛡')
    return <RuneShieldIcon className={className} size={size} {...props} />
  if (norm === 'scroll' || norm === '📜' || norm === '📝')
    return <RuneScrollIcon className={className} size={size} {...props} />
  if (norm === 'oracle' || norm === '🔮')
    return <RuneOracleIcon className={className} size={size} {...props} />
  if (norm === 'bow' || norm === '🏹')
    return <RuneBowIcon className={className} size={size} {...props} />
  if (norm === 'gem' || norm === '💎')
    return <RuneGemIcon className={className} size={size} {...props} />
  if (norm === 'flame' || norm === 'fire' || norm === '🔥')
    return <RuneFlameIcon className={className} size={size} {...props} />
  if (norm === 'potion' || norm === '🧪')
    return <RunePotionIcon className={className} size={size} {...props} />
  if (norm === 'key' || norm === '🗝️' || norm === '🗝')
    return <RuneKeyIcon className={className} size={size} {...props} />
  if (norm === 'ring' || norm === '💍')
    return <RuneRingIcon className={className} size={size} {...props} />
  if (norm === 'sparkle' || norm === '✨')
    return <RuneSparkleIcon className={className} size={size} {...props} />
  if (norm === 'user' || norm === '👤' || norm === '🧙‍♂️' || norm === '🧙')
    return <RuneUserIcon className={className} size={size} {...props} />
  if (norm === 'tome' || norm === 'livro' || norm === '📊')
    return <RuneTomeIcon className={className} size={size} {...props} />
  if (norm === 'astrolabe' || norm === 'calendario')
    return <RuneAstrolabeIcon className={className} size={size} {...props} />
  if (norm === 'hammer' || norm === 'forja')
    return <RuneHammerIcon className={className} size={size} {...props} />
  if (norm === 'gear' || norm === 'santuario')
    return <RuneGearIcon className={className} size={size} {...props} />
  if (norm === 'crest' || norm === 'portal')
    return <RuneCrestIcon className={className} size={size} {...props} />
  if (norm === 'd20' || norm === 'dice' || norm === 'dado' || norm === 'rolagem')
    return <RuneD20Icon className={className} size={size} {...props} />
  if (norm === 'combat' || norm === 'combate' || norm === 'iniciativa' || norm === 'battle')
    return <RuneCombatIcon className={className} size={size} {...props} />
  if (norm === 'compendium' || norm === 'compendio' || norm === 'racas' || norm === 'poderes')
    return <RuneCompendiumIcon className={className} size={size} {...props} />
  if (norm === 'backpack' || norm === 'inventario' || norm === 'mochila' || norm === 'bag')
    return <RuneBackpackIcon className={className} size={size} {...props} />
  if (norm === 'nerd' || norm === 'fandom' || norm === 'mascara' || norm === 'dicionario')
    return <RuneNerdIcon className={className} size={size} {...props} />
  if (
    norm === 'timeline' ||
    norm === 'chronicle' ||
    norm === 'cronica' ||
    norm === 'linha_do_tempo'
  )
    return <RuneTimelineIcon className={className} size={size} {...props} />
  if (norm === 'bonds' || norm === 'vinculos' || norm === 'lacos' || norm === 'alianca')
    return <RuneBondsIcon className={className} size={size} {...props} />

  // Fallback padrão seguro (Pergaminho rúnico suave)
  return <RuneScrollIcon className={className} size={size} {...props} />
}

export type EternumIconKey =
  | 'home'
  | 'pages'
  | 'boards'
  | 'databases'
  | 'sessions'
  | 'loot'
  | 'npcs'
  | 'oracle'
  | 'settings'
  | 'search'
  | 'combat'
  | 'compendium'
  | 'nerd'
  | 'timeline'
  | 'chronicle'
  | 'bonds'

export function EternumIcon({
  name,
  className = 'w-4 h-4',
  size,
  ...props
}: EternumIconProps & { name: EternumIconKey }) {
  switch (name) {
    case 'home':
      return <RuneCrestIcon className={className} size={size} {...props} />
    case 'pages':
      return <RuneScrollIcon className={className} size={size} {...props} />
    case 'boards':
      return <RuneSwordIcon className={className} size={size} {...props} />
    case 'databases':
      return <RuneTomeIcon className={className} size={size} {...props} />
    case 'sessions':
      return <RuneAstrolabeIcon className={className} size={size} {...props} />
    case 'loot':
      return <RuneHammerIcon className={className} size={size} {...props} />
    case 'npcs':
      return <RuneNpcIcon className={className} size={size} {...props} />
    case 'oracle':
      return <RuneOracleIcon className={className} size={size} {...props} />
    case 'settings':
      return <RuneGearIcon className={className} size={size} {...props} />
    case 'combat':
      return <RuneCombatIcon className={className} size={size} {...props} />
    case 'compendium':
      return <RuneCompendiumIcon className={className} size={size} {...props} />
    case 'nerd':
      return <RuneNerdIcon className={className} size={size} {...props} />
    case 'timeline':
    case 'chronicle':
      return <RuneTimelineIcon className={className} size={size} {...props} />
    case 'bonds':
      return <RuneBondsIcon className={className} size={size} {...props} />
    case 'search':
      return <RuneSearchIcon className={className} size={size} {...props} />
    default:
      return <RuneCrestIcon className={className} size={size} {...props} />
  }
}

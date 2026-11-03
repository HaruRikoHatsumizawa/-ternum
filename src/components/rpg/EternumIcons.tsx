import React from 'react'

export interface EternumIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number | string
}

/**
 * Início / Salão Principal:
 * Brasão rúnico / Orbe sagrado com estrela de 4 pontas central e anel de nós arcanos.
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
      {/* Contorno do escudo arqueado */}
      <path
        d="M12 2.5 C16 2.5 20.5 4 20.5 6.5 C20.5 13.5 16 19 12 21.5 C8 19 3.5 13.5 3.5 6.5 C3.5 4 8 2.5 12 2.5 Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Moldura rúnica interna sutil */}
      <path
        d="M12 4.8 C15 4.8 18.5 6 18.5 8 C18.5 13.2 15 17.5 12 19.5 C9 17.5 5.5 13.2 5.5 8 C5.5 6 9 4.8 12 4.8 Z"
        strokeWidth="0.9"
        strokeDasharray="2 1.5"
        opacity="0.6"
      />
      {/* Estrela / Orbe central de 4 pontas */}
      <path
        d="M12 7 L13 11 L17 12 L13 13 L12 17 L11 13 L7 12 L11 11 Z"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

/**
 * Fichas & Crônicas:
 * Pergaminho medieval rúnico com fita selada e pena/quill geométrica refinada.
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
      {/* Rolo superior do pergaminho */}
      <path
        d="M6 4 C4.5 4 3.5 5 3.5 6 C3.5 7 4.5 8 6 8 L17 8 C18.5 8 19.5 7 19.5 6 C19.5 5 18.5 4 17 4 L6 4 Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Corpo do pergaminho */}
      <path
        d="M4.2 7.5 L4.2 18 C4.2 19.2 5.2 20 6.5 20 L16 20 C18 20 19.5 18.8 19.5 17 L19.5 7"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Linhas de escrita arcana rúnica */}
      <line
        x1="7.5"
        y1="11.5"
        x2="13.5"
        y2="11.5"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="7.5"
        y1="14.5"
        x2="15.5"
        y2="14.5"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="7.5"
        y1="17"
        x2="11.5"
        y2="17"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Pena / Quill elegante pousada na diagonal */}
      <path
        d="M14.5 18 L19.5 9.5 C20.5 7.8 21.2 5 21 3 C19 3.2 16.5 4 14.8 5.5 L12.5 11"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="17.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

/**
 * Mural de Missões / Quests:
 * Espada rúnica com empunhadura heráldica e escudo de contratos entrelaçados.
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
      {/* Lâmina central com chanfro */}
      <path
        d="M12 2 L13.8 5 L13.5 15 L12 16 L10.5 15 L10.2 5 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.12"
        strokeLinejoin="round"
      />
      <line x1="12" y1="3.5" x2="12" y2="15" strokeWidth="1" opacity="0.6" />
      {/* Guarda da espada estilizada com asas geométricas */}
      <path
        d="M6.5 15.5 L10.5 15.5 L12 16.5 L13.5 15.5 L17.5 15.5 C18 15.5 18.5 16 18 16.8 L16.8 17.5 L13.5 17 L12 17.5 L10.5 17 L7.2 17.5 L6 16.8 C5.5 16 6 15.5 6.5 15.5 Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      {/* Empunhadura e pomo */}
      <line x1="12" y1="17.5" x2="12" y2="20.5" strokeWidth="1.6" strokeLinecap="round" />
      {/* Pomo com gema rúnica */}
      <polygon points="12,20.5 13.5,22 12,23.2 10.5,22" strokeWidth="1.1" fill="currentColor" />
      {/* Runas radiantes laterais de missão */}
      <path d="M4 11 L6 11" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M18 11 L20 11" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

/**
 * Códices Arcanos / Bestiários / Tabelas:
 * Grimório antigo encadernado com fecho rúnico e fita marcadora.
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
      {/* Capa do Tomo Aberto / Grimório */}
      <path
        d="M4 19.5 C7 18.2 10.5 18.5 12 20 C13.5 18.5 17 18.2 20 19.5 L20 5 C17 3.8 13.5 4 12 5.5 C10.5 4 7 3.8 4 5 L4 19.5 Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Lombada central */}
      <line x1="12" y1="5.5" x2="12" y2="20" strokeWidth="1.4" strokeLinecap="round" />
      {/* Símbolo rúnico na página esquerda */}
      <polygon
        points="8,9 9.5,11.5 8,14 6.5,11.5"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.25"
      />
      {/* Linhas de encantamento na página direita */}
      <line
        x1="14.5"
        y1="9"
        x2="17.5"
        y2="9"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="14.5"
        y1="11.5"
        x2="17.5"
        y2="11.5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="14.5"
        y1="14"
        x2="16.5"
        y2="14"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Fita marcadora caindo */}
      <path d="M12 5.5 L12 2 C12.8 2.5 13.5 2 14 2.5 L13 5.5" strokeWidth="0.9" opacity="0.6" />
    </svg>
  )
}

/**
 * Calendário de Sessões:
 * Astrolábio / Ciclos Lunares com anel astronômico e quarto crescente.
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
      {/* Anel exterior do astrolábio */}
      <circle cx="12" cy="13" r="8.5" strokeWidth="1.4" />
      {/* Argola superior de suspensão */}
      <circle cx="12" cy="3" r="1.5" strokeWidth="1.2" />
      <line x1="12" y1="4.5" x2="12" y2="5.5" strokeWidth="1.3" />
      {/* Lua crescente / Ciclo lunar interior */}
      <path
        d="M13 7.5 C10 8.5 8.5 11.5 9 14.5 C9.5 17 11.5 18.5 14 18.5 C12 17 11.5 14 12.5 11.5 C13.2 9.8 14.5 8.8 16 8.5 C15 7.8 14 7.5 13 7.5 Z"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      {/* Eixo estelar / Agulha de navegação */}
      <line
        x1="6.5"
        y1="13"
        x2="17.5"
        y2="13"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
        opacity="0.7"
      />
      <line
        x1="12"
        y1="7.5"
        x2="12"
        y2="18.5"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
        opacity="0.7"
      />
      {/* Gema focal central */}
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
    </svg>
  )
}

/**
 * Forja do Tesouro (Loot):
 * Martelo rúnico forjador sobreposto a labareda ancestral / bigorna.
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
      {/* Cabeça do Martelo de Guerra Rúnico */}
      <path
        d="M7.5 5 L16.5 5 L16.5 9 L15 10 L9 10 L7.5 9 Z"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      {/* Bico pontiagudo / quebra-armadura traseiro */}
      <path d="M7.5 5.5 L4.5 7 L7.5 8.5" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Face de impacto frontal biselada */}
      <line x1="16.5" y1="5.5" x2="18.5" y2="7" strokeWidth="1.3" />
      <line x1="18.5" y1="7" x2="16.5" y2="8.5" strokeWidth="1.3" />
      {/* Cabo reforçado com anéis rúnicos */}
      <line x1="12" y1="10" x2="12" y2="21" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="10.5" y1="14" x2="13.5" y2="14" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10.5" y1="17" x2="13.5" y2="17" strokeWidth="1.2" strokeLinecap="round" />
      {/* Centelha / Faísca de forja mágica */}
      <path
        d="M17.5 13 L18.5 11 L19.5 13 L21.5 14 L19.5 15 L18.5 17 L17.5 15 L15.5 14 Z"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  )
}

/**
 * Fichas de NPCs / Personagens:
 * Busto heráldico nobre / elmo com insígnia de fera discreta e elegante.
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
      {/* Cabeça / Elmo estilizado com sutis orelhas nobres */}
      <path
        d="M8 8 L9.5 4 L11 7 L13 7 L14.5 4 L16 8 C17.5 10 17 13 15 14 L12 15.5 L9 14 C7 13 6.5 10 8 8 Z"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.15"
        strokeLinejoin="round"
      />
      {/* Visor / Runa frontal */}
      <circle cx="12" cy="10" r="1.3" fill="currentColor" />
      {/* Ombros / Gibão de viagem heráldico */}
      <path
        d="M4.5 21 C4.5 18 7.5 16.5 10 16.2 L12 17.5 L14 16.2 C16.5 16.5 19.5 18 19.5 21"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Broche rúnico no peitoral */}
      <polygon points="12,17.5 13,19 12,20.2 11,19" strokeWidth="0.9" fill="currentColor" />
    </svg>
  )
}

/**
 * Oráculo de Éternum (IA):
 * Olho místico ancestral inscrito em cristal / losango radiante.
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
      {/* Losango / Cristal arcano exterior */}
      <polygon points="12,2.5 20.5,12 12,21.5 3.5,12" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Olho místico de visão profética */}
      <path
        d="M5.5 12 C7.5 8.5 10 7.5 12 7.5 C14 7.5 16.5 8.5 18.5 12 C16.5 15.5 14 16.5 12 16.5 C10 16.5 7.5 15.5 5.5 12 Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Pupila de cristal / gema viva */}
      <circle cx="12" cy="12" r="2.2" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      {/* Raios sutis de visão */}
      <line x1="12" y1="4.5" x2="12" y2="6" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="19.5" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Santuário / Configurações:
 * Engrenagem rúnica ancestral com centro octaédrico e dentes geométricos chanfrados.
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
      {/* Círculo base da engrenagem */}
      <circle cx="12" cy="12" r="7.5" strokeWidth="1.3" />
      {/* 8 Dentes rúnicos chanfrados */}
      <path d="M11 2.5 L13 2.5 L13.5 4.5 L10.5 4.5 Z" strokeWidth="1" fill="currentColor" />
      <path d="M11 21.5 L13 21.5 L13.5 19.5 L10.5 19.5 Z" strokeWidth="1" fill="currentColor" />
      <path d="M2.5 11 L2.5 13 L4.5 13.5 L4.5 10.5 Z" strokeWidth="1" fill="currentColor" />
      <path d="M21.5 11 L21.5 13 L19.5 13.5 L19.5 10.5 Z" strokeWidth="1" fill="currentColor" />
      <path d="M5.5 5.5 L7 4 L8.2 5.5 L6.8 7 Z" strokeWidth="0.8" fill="currentColor" />
      <path d="M18.5 18.5 L17 20 L15.8 18.5 L17.2 17 Z" strokeWidth="0.8" fill="currentColor" />
      <path d="M18.5 5.5 L20 7 L18.5 8.2 L17 6.8 Z" strokeWidth="0.8" fill="currentColor" />
      <path d="M5.5 18.5 L4 17 L5.5 15.8 L7 17.2 Z" strokeWidth="0.8" fill="currentColor" />
      {/* Núcleo rúnico octogonal / losango */}
      <polygon
        points="12,8.5 15.5,12 12,15.5 8.5,12"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </svg>
  )
}

/**
 * Consultar Oráculo / Busca Rápida:
 * Lente de adivinhação geométrica com feixe de visão rúnico.
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
      {/* Lente rúnica circular com anel duplo */}
      <circle cx="10.5" cy="10.5" r="7" strokeWidth="1.4" />
      <circle cx="10.5" cy="10.5" r="5" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.6" />
      {/* Ponto focal de adivinhação */}
      <circle cx="10.5" cy="10.5" r="1.2" fill="currentColor" />
      {/* Cabo entalhado e pomo */}
      <line x1="15.5" y1="15.5" x2="21" y2="21" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="21" cy="21" r="1" fill="currentColor" />
    </svg>
  )
}

/**
 * Seletor rápido de ícone por chave temática:
 * Permite mapear 'home', 'pages', 'boards', 'databases', 'sessions', 'loot', 'npcs', 'oracle', 'settings'.
 */
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
    case 'search':
      return <RuneSearchIcon className={className} size={size} {...props} />
    default:
      return <RuneCrestIcon className={className} size={size} {...props} />
  }
}

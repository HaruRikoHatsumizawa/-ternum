import React from 'react'

export function RunicCircle({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="50" cy="50" r="46" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      <circle cx="50" cy="50" r="40" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="28" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <polygon points="50,14 81,68 19,68" strokeWidth="1.5" opacity="0.8" />
      <polygon points="50,86 19,32 81,32" strokeWidth="1.5" opacity="0.8" />
      <circle cx="50" cy="50" r="8" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      {/* 8 Pontos Rúnicos Cardeais */}
      <circle cx="50" cy="6" r="2.5" fill="currentColor" />
      <circle cx="50" cy="94" r="2.5" fill="currentColor" />
      <circle cx="6" cy="50" r="2.5" fill="currentColor" />
      <circle cx="94" cy="50" r="2.5" fill="currentColor" />
      <circle cx="19" cy="19" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="81" cy="81" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="81" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="81" cy="19" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function DragonSilhouette({
  className = 'w-8 h-8',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Silhueta nobre de guardião bestial/draconiano antropomórfico alado */}
      <path
        d="M50 10 C46 16, 42 22, 38 28 C34 22, 28 16, 20 18 C12 20, 8 28, 12 36 C16 44, 26 48, 36 50 C26 56, 16 66, 10 80 C18 78, 28 72, 36 64 C36 72, 38 80, 44 88 C46 84, 48 76, 48 68 C50 72, 54 82, 58 88 C62 82, 64 72, 64 64 C72 72, 82 78, 90 80 C84 66, 74 56, 64 50 C74 48, 84 44, 88 36 C92 28, 88 20, 80 18 C72 16, 66 22, 62 28 C58 22, 54 16, 50 10 Z M50 32 C54 38, 56 46, 54 54 C50 58, 46 54, 46 46 C46 38, 48 34, 50 32 Z"
        opacity="0.9"
      />
    </svg>
  )
}

// Brasão com detalhe heráldico canino/felino e espada rúnica
export function CrestShield({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M50 8 C68 8, 86 16, 86 28 C86 62, 50 88, 50 92 C50 88, 14 62, 14 28 C14 16, 32 8, 50 8 Z"
        strokeWidth="3"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M50 16 C64 16, 78 22, 78 32 C78 58, 50 78, 50 82 C50 78, 22 58, 22 32 C22 22, 36 16, 50 16 Z"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.7"
      />
      {/* Espada e símbolo de nobre fera central */}
      <line x1="50" y1="22" x2="50" y2="70" strokeWidth="2.5" />
      <line x1="38" y1="36" x2="62" y2="36" strokeWidth="2.5" />
      {/* Sutil elmo com orelhas pontiagudas heráldicas no topo do escudo */}
      <path
        d="M42 26 L46 18 L50 24 L54 18 L58 26"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="50" cy="74" r="3" fill="currentColor" />
    </svg>
  )
}

// Ícone sutil de pegada rúnica / pata heráldica geométrica (discreta e elegante)
export function RunicPawIcon({ className = 'w-4 h-4', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Almofada central em formato de escudo/coração rúnico invertido */}
      <path
        d="M12 11.5 C10 11.5 7.5 13 8 16 C8.4 18.5 11 19.5 12 20 C13 19.5 15.6 18.5 16 16 C16.5 13 14 11.5 12 11.5 Z"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.18"
      />
      {/* 4 Dedos elegantes em forma de gemas/losangos */}
      <ellipse
        cx="6.5"
        cy="10"
        rx="1.6"
        ry="2.2"
        transform="rotate(-20 6.5 10)"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <ellipse
        cx="10"
        cy="6.8"
        rx="1.6"
        ry="2.4"
        transform="rotate(-6 10 6.8)"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <ellipse
        cx="14"
        cy="6.8"
        rx="1.6"
        ry="2.4"
        transform="rotate(6 14 6.8)"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <ellipse
        cx="17.5"
        cy="10"
        rx="1.6"
        ry="2.2"
        transform="rotate(20 17.5 10)"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.25"
      />
    </svg>
  )
}

export function TomeOrnament({ className = 'w-24 h-4', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <line x1="0" y1="12" x2="70" y2="12" strokeWidth="1" opacity="0.5" />
      <circle cx="75" cy="12" r="2" fill="currentColor" />
      <polygon
        points="100,4 108,12 100,20 92,12"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="100" cy="12" r="2" fill="currentColor" />
      <circle cx="125" cy="12" r="2" fill="currentColor" />
      <line x1="130" y1="12" x2="200" y2="12" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function ArcaneOrb({ className = 'w-10 h-10', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d378" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#d4a017" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="36" fill="url(#orbGlow)" />
      <circle cx="50" cy="50" r="38" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="14"
        strokeWidth="1.5"
        transform="rotate(-25 50 50)"
        opacity="0.7"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="14"
        strokeWidth="1.5"
        transform="rotate(35 50 50)"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  )
}

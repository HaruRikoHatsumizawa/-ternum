export type LootRarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário'
export type LootType = 'Arma' | 'Armadura' | 'Consumível' | 'Relíquia' | 'Curiosidade'

export interface LootItem {
  id: string
  name: string
  type: LootType
  rarity: LootRarity
  valueGold: number
  description: string
  effects: string[]
  icon: string
  source: string
}

const RARITY_COLORS: Record<
  LootRarity,
  { text: string; bg: string; border: string; glow: string }
> = {
  Comum: {
    text: 'text-slate-300',
    bg: 'bg-slate-800/50',
    border: 'border-slate-600/40',
    glow: 'rgba(148, 163, 184, 0.15)',
  },
  Incomum: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
  Raro: {
    text: 'text-blue-300',
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/40',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
  Épico: {
    text: 'text-purple-300',
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/40',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
  Lendário: {
    text: 'text-amber-300',
    bg: 'bg-amber-950/50',
    border: 'border-amber-400/60',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
}

export function getRarityStyle(rarity: LootRarity) {
  return RARITY_COLORS[rarity] || RARITY_COLORS.Comum
}

// Tabelas de geração
const PREFIXES: Record<LootRarity, string[]> = {
  Comum: [
    'De Aço Reforçado',
    'Da Patrulha',
    'Rústica',
    'De Ferro Forjado',
    'Do Viajante',
    'Veterana',
    'Da Guarda',
  ],
  Incomum: [
    'Prateada',
    'Rúnica',
    'Do Caçador Noturno',
    'Da Geada Fraca',
    'Venenosa',
    'Da Centelha',
    'Da Agilidade',
  ],
  Raro: [
    'Esmeralda',
    'Da Tempestade',
    'Sangrenta',
    'Das Sombras Vivas',
    'Astral',
    'Da Chama Solar',
    'Espectral',
  ],
  Épico: [
    'Do Crepúsculo Eterno',
    'Mundirruptora',
    'Do Vazio Primordial',
    'Arcana Ancestral',
    'Da Fúria Dracônica',
    'Tenebrosa',
  ],
  Lendário: [
    'De Val-Morath',
    'Do Deus Forjador',
    'Do Eclipse Sagrado',
    'Primordial da Criação',
    'Estelar de Éternum',
    'Do Olho Cósmico',
  ],
}

const WEAPON_BASES = [
  'Lâmina Longa',
  'Adaga Curva',
  'Machado de Guerra',
  'Arco Élfico',
  'Maça Rúnica',
  'Alabarda Pesada',
  'Florete Esbelto',
  'Bacamarte Arcano',
  'Lança Celestial',
  'Foice da Colheita',
]

const ARMOR_BASES = [
  'Couraça de Placas',
  'Cota de Malha Élfica',
  'Escudo Brasoneiro',
  'Elmo com Chifres',
  'Manto de Seda Noturna',
  'Braçadeiras de Mithril',
  'Grevas da Fortaleza',
  'Capa de Penas do Corvo',
]

const CONSUMABLE_BASES = [
  'Poção',
  'Elixir',
  'Frasco',
  'Bálsamo',
  'Óleo Arcano',
  'Tônico',
  'Essência Destilada',
]

const RELIC_BASES = [
  'Amuleto',
  'Anel',
  'Cálice',
  'Tomo Selado',
  'Orbe Cristalino',
  'Medalhão',
  'Ampulheta',
  'Cetro',
]

const CURIOSITY_BASES = [
  'Dado Viciado de Osso',
  'Chave de Latão Antiga',
  'Monóculo Espectral',
  'Rosa Petrificada',
  'Pena de Grifo Dourado',
  'Espelho sem Reflexo',
  'Compasso que Aponta para Segredos',
]

const SUFFIXES = [
  'do Juramento Quebrado',
  'dos Mil Ventos',
  'do Guardião Ancião',
  'da Fênix Ressurgida',
  'do Trovão Cadente',
  'da Noite Eterna',
  'da Aurora Boreal',
  'das Profundezas Abissais',
  'do Vingador Carmesim',
  'dos Dragões Sepultados',
  'do Voo Silencioso',
  'da Alma Aprisionada',
]

const DESCRIPTIONS = [
  'Emite uma névoa fria e um leve zumbido ao ser empunhado no escuro.',
  'Forjado com ligas de ferro estelar que nunca perdem o fio nem enferrujam.',
  'Carrega o selo esquecido de uma dinastia que pereceu no Grande Cataclismo.',
  'Ao toque, sussurros inaudíveis contam memórias de antigos campos de batalha.',
  'Ressonâncias arcanas aquecem as mãos de quem carrega este artefato.',
  'Pequenas runas douradas piscam em sintonia com os batimentos do portador.',
  'O metal parece refletir um céu estrelado que não pertence a este plano.',
  'Uma fragrância fraca de cinzas de carvalho e âmbar emana continuamente da peça.',
]

const TYPE_ICONS: Record<LootType, string> = {
  Arma: '⚔️',
  Armadura: '🛡️',
  Consumível: '🧪',
  Relíquia: '💍',
  Curiosidade: '🗝️',
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateLoot(forcedRarity?: LootRarity, forcedType?: LootType): LootItem {
  // Probabilidades de raridade se não forçada
  let rarity = forcedRarity
  if (!rarity) {
    const roll = Math.random() * 100
    if (roll < 45) rarity = 'Comum'
    else if (roll < 75) rarity = 'Incomum'
    else if (roll < 90) rarity = 'Raro'
    else if (roll < 97) rarity = 'Épico'
    else rarity = 'Lendário'
  }

  // Tipo de item
  const types: LootType[] = ['Arma', 'Armadura', 'Consumível', 'Relíquia', 'Curiosidade']
  const type = forcedType || pickRandom(types)

  // Base do item de acordo com o tipo
  let base = ''
  if (type === 'Arma') base = pickRandom(WEAPON_BASES)
  else if (type === 'Armadura') base = pickRandom(ARMOR_BASES)
  else if (type === 'Consumível') base = pickRandom(CONSUMABLE_BASES)
  else if (type === 'Relíquia') base = pickRandom(RELIC_BASES)
  else base = pickRandom(CURIOSITY_BASES)

  const prefix = pickRandom(PREFIXES[rarity])
  const suffix = pickRandom(SUFFIXES)
  const name = `${base} ${prefix} ${suffix}`

  // Valores de moedas de acordo com raridade
  let valueGold = 0
  if (rarity === 'Comum') valueGold = randomBetween(5, 50)
  else if (rarity === 'Incomum') valueGold = randomBetween(60, 250)
  else if (rarity === 'Raro') valueGold = randomBetween(300, 1200)
  else if (rarity === 'Épico') valueGold = randomBetween(1500, 6000)
  else valueGold = randomBetween(8000, 30000)

  // Efeitos mágicos de acordo com raridade
  const effects: string[] = []
  if (rarity === 'Comum') {
    effects.push('Item de confecção confiável (+1 em testes de uso cotidiano)')
  } else if (rarity === 'Incomum') {
    effects.push('+1 no ataque/defesa ou concede resistência a frio/fogo leve')
    effects.push('Brilha levemente a até 3 metros na escuridão pura')
  } else if (rarity === 'Raro') {
    effects.push('+2 de bônus mágico em atributos pertinentes')
    effects.push('Gera 1d6 de dano elemental adicional por golpe')
    effects.push('Requer sintonia durante descanso curto')
  } else if (rarity === 'Épico') {
    effects.push('+3 de bônus primordial e vantagem em testes de resistência')
    effects.push('Permite conjurar feitiço de 4º círculo uma vez por dia')
    effects.push('Imunidade a condições de medo ou encantamento')
  } else {
    effects.push('+4 de bônus lendário absoluto em combate')
    effects.push('Pode distorcer a realidade: rolar novamente qualquer falha uma vez por sessão')
    effects.push('Consciência própria que guia o portador com presságios arcanos')
  }

  return {
    id: `loot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    type,
    rarity,
    valueGold,
    description: pickRandom(DESCRIPTIONS),
    effects,
    icon: TYPE_ICONS[type] || '✨',
    source: 'Forja do Tesouro de Éternum',
  }
}

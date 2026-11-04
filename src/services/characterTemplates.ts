import { NpcRecord } from '@/services/npcs'

export type CharacterTemplateKey = 'combatente' | 'arcanista' | 'vilao'

export interface CharacterTemplate {
  key: CharacterTemplateKey
  title: string
  titleEn: string
  role: string
  roleEn: string
  badge: string
  badgeEn: string
  description: string
  descriptionEn: string
  avatar: string
  previewStats: {
    hp: number
    ac: number
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
    cr: string
  }
  initialData: Partial<NpcRecord>
}

export const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  {
    key: 'combatente',
    title: 'Combatente Nobre',
    titleEn: 'Noble Combatant',
    role: 'Vanguarda & Defensor Marcial',
    roleEn: 'Frontline & Martial Defender',
    badge: 'Combatente',
    badgeEn: 'Combatant',
    description:
      'Guerreiro disciplinado de porte lupino ou felino nobre. Especialista em combate corpo a corpo, armadura pesada e proteção de aliados.',
    descriptionEn:
      'Disciplined warrior with noble lupine or feline posture. Specialist in close combat, heavy armor and shielding allies.',
    avatar: 'wolf',
    previewStats: {
      hp: 38,
      ac: 17,
      str: 16,
      dex: 12,
      con: 15,
      int: 10,
      wis: 12,
      cha: 11,
      cr: 'ND 2',
    },
    initialData: {
      name: 'Kaelen Presa-de-Ferro',
      species: 'Lobo Cinzento Guardião',
      race: 'Canino Nobre / Vanguarda',
      occupation: 'Paladino da Vigília / Guarda de Honra',
      location: 'Fortaleza do Pico Gelado',
      alignment: 'Leal e Bom',
      status: 'Vivo',
      avatar: 'wolf',
      appearance:
        'Pelagem acinzentada densa com marcas rúnicas prateadas na fronte. Empunha um espadão de aço rúnico forjado a frio e escudo com a insígnia da matilha. Olhar firme e sereno, capa pesada com fivela de prata antiga.',
      bio: 'Cresceu nas fronteiras frias juramentado a defender aldeias isoladas contra as bestas da Umbra. Treinado na Ordem da Vigília, combina precisão marcial ancestral com o instinto de matilha.',
      relationships:
        'Leal ao Círculo dos Anciões do Norte; mentor de jovens recrutas e companheiro de armas do Arcanista do grupo.',
      hp: 38,
      ac: 17,
      cr: 'ND 2',
      str: 16,
      dex: 12,
      con: 15,
      int: 10,
      wis: 12,
      cha: 11,
      personality: {
        traits: 'Calmo sob pressão marcial, fala pausadamente e nunca desembainha sem honra.',
        ideals: 'A proteção da matilha e a honra inegociável da palavra jurada.',
        bonds: 'O estandarte desgastado de seu batalhão e o amuleto rúnico paterno.',
        flaws: 'Recusa-se a recuar mesmo quando superado numericamente.',
      },
      secrets:
        'Guarda a culpa por ter falhado em resgatar seu último comandante em uma emboscada na névoa.',
      notes:
        'Pode liderar a vanguarda do combate e conceder bônus defensivo a combatentes próximos.',
    },
  },
  {
    key: 'arcanista',
    title: 'Arcanista do Crepúsculo',
    titleEn: 'Twilight Arcanist',
    role: 'Conjurador & Sábio Erudito',
    roleEn: 'Spellcaster & Scholarly Sage',
    badge: 'Arcanista',
    badgeEn: 'Arcanist',
    description:
      'Erudito astuto de traços vulpinos ou corvídeos. Domina magias de alteração da realidade, adivinhação e pergaminhos rúnicos antigos.',
    descriptionEn:
      'Cunning scholar with vulpine or corvid grace. Master of reality-shaping spells, divination and ancient runic scrolls.',
    avatar: 'fox',
    previewStats: {
      hp: 22,
      ac: 12,
      str: 8,
      dex: 14,
      con: 12,
      int: 17,
      wis: 13,
      cha: 12,
      cr: 'ND 2',
    },
    initialData: {
      name: 'Vaelis Cinza-da-Lua',
      species: 'Raposa Argêntea Mística',
      race: 'Vulpino Feérico / Estudioso',
      occupation: 'Mago Ritualista / Cartógrafo Astral',
      location: 'Torre do Observatório Astral',
      alignment: 'Neutro e Inteligente',
      status: 'Vivo',
      avatar: 'fox',
      appearance:
        'Pelagem argêntea com pontas escuras, orelhas alertas e olhos violeta profundos que refletem glifos ao conjurar. Veste túnica de veludo índigo com símbolos astrológicos bordados a fio de ouro.',
      bio: 'Formado nos arquivos subterrâneos de Éternum. Dedicou décadas decifrando tomos esquecidos sobre as falhas no véu entre mundos.',
      relationships:
        'Correspondente secreto de bibliotecários reais; desconfia de clérigos dogmáticos mas acolhe quem busca conhecimento verdadeiro.',
      hp: 22,
      ac: 12,
      cr: 'ND 2',
      str: 8,
      dex: 14,
      con: 12,
      int: 17,
      wis: 13,
      cha: 12,
      personality: {
        traits: 'Meticuloso, anota detalhes em códices de bolso e fala com metáforas rúnicas.',
        ideals: 'O conhecimento arcano deve ser compreendido, nunca temido ou queimado.',
        bonds: 'Um grimório de couro negro cujas páginas sussurram sob a luz da lua.',
        flaws: 'Fascina-se tanto por enigmas ancestrais que ignora perigos iminentes.',
      },
      secrets:
        'Descobriu que uma das estrelas do firmamento é na verdade um portal se abrindo lentamente.',
      notes: 'Possui rituais de detecção de magia, mísseis místicos e contra-mágica defensiva.',
    },
  },
  {
    key: 'vilao',
    title: 'Nêmesis das Sombras',
    titleEn: 'Shadow Nemesis',
    role: 'Antagonista & Vilão Implacável',
    roleEn: 'Antagonist & Ruthless Villain',
    badge: 'Vilão',
    badgeEn: 'Villain',
    description:
      'Líder impiedoso de natureza draconiana ou felina sombria. Astuto, manipulador e mortal tanto em combate quanto em intriga política.',
    descriptionEn:
      'Ruthless mastermind of draconic or shadow-feline lineage. Cunning, manipulative and lethal in both combat and political intrigue.',
    avatar: 'dragon',
    previewStats: {
      hp: 52,
      ac: 16,
      str: 15,
      dex: 16,
      con: 14,
      int: 15,
      wis: 13,
      cha: 16,
      cr: 'ND 4',
    },
    initialData: {
      name: 'Malakor o Sem-Rosto',
      species: 'Pantera das Sombras / Dracônico',
      race: 'Predador Sombrio / Senhor da Umbra',
      occupation: 'Mestre da Guilda Proibida / Conspirador',
      location: 'Cidadela das Sombras Profundas',
      alignment: 'Leal e Maligno',
      status: 'Vivo',
      avatar: 'dragon',
      appearance:
        'Pelagem negra como a noite sem estrelas, olhos fendidos dourados de réptil e garras imbuídas de miasma escuro. Usa armadura articulada de escamas de dragão negro com detalhes de ébano e rubi.',
      bio: 'Outrora um nobre comandante da corte que foi traído pelos aliados do trono. Sobreviveu fazendo pactos nas profundezas do abismo rúnico e agora arquiteta a ruína de seus antigos algozes.',
      relationships:
        'Comanda uma rede de informantes e assassinos leais pelo medo e pela recompensa; rival jurado dos heróis da campanha.',
      hp: 52,
      ac: 16,
      cr: 'ND 4',
      str: 15,
      dex: 16,
      con: 14,
      int: 15,
      wis: 13,
      cha: 16,
      personality: {
        traits: 'Voz suave e ameaçadora, polido até o momento do bote mortal.',
        ideals:
          'A fraqueza é a única verdadeira vergonha; a ordem deve ser forjada pelo poder absoluto.',
        bonds: 'Um anel de sinete quebrado pertencente à linhagem que o baniu.',
        flaws: 'Subestima aqueles que lutam puramente por compaixão ou amor.',
      },
      secrets:
        'Possui informantes infiltrados no conselho da capital e conhece fraquezas secretas dos heróis.',
      notes:
        'Vilão principal ou nêmesis recorrente. Possui ações lendárias de esquiva e ataques envenenados.',
    },
  },
]

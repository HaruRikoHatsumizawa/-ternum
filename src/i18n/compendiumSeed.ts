// Semente bilíngue de Raças & Poderes (Dungeons & Dragons, Bleach, Dragon Ball, Animes, Jogos)
// Mantém o app rico desde o primeiro instante sem pesar no banco de dados.
import type { CompendiumUniverse, CompendiumEntryType } from '@/services/compendium'

export interface CompendiumSeedEntry {
  id: string
  universe: CompendiumUniverse
  entry_type: CompendiumEntryType
  name: { 'pt-BR': string; en: string }
  short_description: { 'pt-BR': string; en: string }
  traits: { 'pt-BR': string[]; en: string[] }
}

export const COMPENDIUM_SEED_ENTRIES: CompendiumSeedEntry[] = [
  // --- DUNGEONS & DRAGONS ---
  {
    id: 'dnd_elf',
    universe: 'dnd',
    entry_type: 'race',
    name: { 'pt-BR': 'Elfo', en: 'Elf' },
    short_description: {
      'pt-BR':
        'Povo gracioso e longevo de florestas arcanas, dotado de sentidos aguçados e afinidade natural com a magia.',
      en: 'A graceful and long-lived woodland folk with keen senses and a deep natural affinity for magic.',
    },
    traits: {
      'pt-BR': [
        'Visão no Escuro (18m)',
        'Ancestralidade Feérica (imune a sono mágico)',
        'Transe meditativo (4h em vez de 8h)',
      ],
      en: [
        'Darkvision (60 ft)',
        'Fey Ancestry (immune to magical sleep)',
        'Trance meditation (4 hrs instead of 8)',
      ],
    },
  },
  {
    id: 'dnd_dwarf',
    universe: 'dnd',
    entry_type: 'race',
    name: { 'pt-BR': 'Anão', en: 'Dwarf' },
    short_description: {
      'pt-BR':
        'Guerreiros e ferreiros robustos das montanhas profundas, forjados em honra, pedra e tradição inabalável.',
      en: 'Sturdy mountain warriors and smiths steeped in honor, stonecraft, and unyielding tradition.',
    },
    traits: {
      'pt-BR': [
        'Resiliência Anã (resistência a veneno)',
        'Visão no Escuro',
        'Especialização com Pedra e Ferramentas',
      ],
      en: [
        'Dwarven Resilience (poison resistance)',
        'Darkvision',
        'Stonecunning and tool proficiency',
      ],
    },
  },
  {
    id: 'dnd_tiefling',
    universe: 'dnd',
    entry_type: 'race',
    name: { 'pt-BR': 'Tiefling', en: 'Tiefling' },
    short_description: {
      'pt-BR':
        'Descendentes marcados por linhagens infernais, portando chifres, cauda preênsil e fogo arcano nas veias.',
      en: 'Descendants marked by infernal bloodlines, bearing horns, tails, and innate hellfire in their veins.',
    },
    traits: {
      'pt-BR': [
        'Resistência Infernal (dano de fogo reduzido à metade)',
        'Visão no Escuro',
        'Legado Infernal (magias inatas: Taumaturgia, Repreensão Infernal)',
      ],
      en: [
        'Hellish Resistance (half fire damage)',
        'Darkvision',
        'Infernal Legacy (innate Thaumaturgy, Hellish Rebuke)',
      ],
    },
  },
  {
    id: 'dnd_dragonborn',
    universe: 'dnd',
    entry_type: 'race',
    name: { 'pt-BR': 'Dracônido', en: 'Dragonborn' },
    short_description: {
      'pt-BR':
        'Nobres guerreiros com escamas dracônicas ancestrais, capazes de exalar a fúria elementar de seus patronos dragões.',
      en: 'Proud warriors clad in ancestral dragon scales, capable of breathing the elemental fury of dragonkind.',
    },
    traits: {
      'pt-BR': [
        'Arma de Sopro Elemental (cone ou linha)',
        'Resistência ao Dano Elemental da linhagem',
        'Porte Dracônico Imponente',
      ],
      en: [
        'Elemental Breath Weapon (cone or line)',
        'Damage Resistance matching ancestral heritage',
        'Imposing Draconic Presence',
      ],
    },
  },
  {
    id: 'dnd_fireball',
    universe: 'dnd',
    entry_type: 'power',
    name: { 'pt-BR': 'Bola de Fogo (Fireball)', en: 'Fireball' },
    short_description: {
      'pt-BR':
        'Magia de Evocação de 3º círculo. Um raio brilhante irrompe do dedo e explode em uma esfera abrasadora de chamas.',
      en: '3rd-level Evocation spell. A bright streak flashes from the pointing finger and blossoms into an incinerating roar.',
    },
    traits: {
      'pt-BR': [
        'Dano de 8d6 de fogo em raio de 6 metros',
        'Salvaguarda de Destreza para metade do dano',
        'Incendeia objetos inflamáveis soltos',
      ],
      en: [
        '8d6 fire damage in a 20-foot radius',
        'Dexterity save for half damage',
        'Ignites unattended flammable objects',
      ],
    },
  },
  {
    id: 'dnd_eldritch_blast',
    universe: 'dnd',
    entry_type: 'power',
    name: { 'pt-BR': 'Rajada Mística (Eldritch Blast)', en: 'Eldritch Blast' },
    short_description: {
      'pt-BR':
        'Truque supremo dos Bruxos. Um feixe de energia crepitante atinge os alvos com dano de força pura.',
      en: 'The definitive Warlock cantrip. A beam of crackling planar energy strikes targets with pure force damage.',
    },
    traits: {
      'pt-BR': [
        '1d10 de dano de força por feixe',
        'Múltiplos feixes em níveis altos (2 no nv 5, 3 no nv 11)',
        'Compatível com Invocações Místicas (Repulsão, Agonia)',
      ],
      en: [
        '1d10 force damage per beam',
        'Multiple beams at higher levels',
        'Synergizes with Eldritch Invocations (Agonizing, Repelling)',
      ],
    },
  },

  // --- BLEACH ---
  {
    id: 'bleach_shinigami',
    universe: 'bleach',
    entry_type: 'race',
    name: { 'pt-BR': 'Shinigami (Deus da Morte)', en: 'Shinigami (Soul Reaper)' },
    short_description: {
      'pt-BR':
        'Gardiões espirituais da Soul Society encarregados de purificar Hollows e guiar almas através do Konso.',
      en: 'Spiritual guardians of the Soul Society tasked with purifying Hollows and guiding souls through Konso.',
    },
    traits: {
      'pt-BR': [
        'Pressão Espiritual (Reiatsu elevada)',
        'Empunhadura de Zanpakuto espiritual',
        'Domínio de Zanjutsu, Hakuda, Hohō (Shunpo) e Kido',
      ],
      en: [
        'Spiritual Pressure (elevated Reiatsu)',
        'Zanpakuto soul blade bond',
        'Mastery of Zanjutsu, Hakuda, Hohō (Flash Step), and Kido',
      ],
    },
  },
  {
    id: 'bleach_hollow',
    universe: 'bleach',
    entry_type: 'race',
    name: { 'pt-BR': 'Hollow / Arrancar', en: 'Hollow / Arrancar' },
    short_description: {
      'pt-BR':
        'Espíritos humanos corrompidos que perderam o coração, portando máscaras de osso e alimentando-se de almas vivas.',
      en: 'Corrupted human spirits who lost their hearts, clad in bone masks and driven to consume living souls.',
    },
    traits: {
      'pt-BR': [
        'Máscara de osso e buraco no peito (coração vazio)',
        'Disparo de Cero e Bala espiritual',
        'Evolução até Menos Grande, Adjuchas e Vasto Lorde / Arrancar',
      ],
      en: [
        'Bone mask and chest hole (hollow heart)',
        'Cero and Bala spiritual blasts',
        'Evolution path: Gillian, Adjuchas, Vasto Lorde / Arrancar',
      ],
    },
  },
  {
    id: 'bleach_quincy',
    universe: 'bleach',
    entry_type: 'race',
    name: { 'pt-BR': 'Quincy', en: 'Quincy' },
    short_description: {
      'pt-BR':
        'Arqueiros e caçadores humanos de alta sensibilidade espiritual que absorvem e manipulam partículas de Reishi do ambiente.',
      en: 'Spiritually aware human archers and hunters who absorb and sculpt atmospheric Reishi into deadly light weapons.',
    },
    traits: {
      'pt-BR': [
        'Armas de luz sagrada (Arco Heilig Bogen)',
        'Absorção e controle de Reishi ambiental',
        'Blut Vene (defesa impenetrável) e Blut Arterie (ataque avassalador)',
      ],
      en: [
        'Sacred light weapons (Heilig Bogen bow)',
        'Atmospheric Reishi absorption',
        'Blut Vene (iron defense) and Blut Arterie (offensive rush)',
      ],
    },
  },
  {
    id: 'bleach_shikai',
    universe: 'bleach',
    entry_type: 'power',
    name: { 'pt-BR': 'Shikai (Liberação Inicial)', en: 'Shikai (Initial Release)' },
    short_description: {
      'pt-BR':
        'A primeira liberação da Zanpakuto conquistada ao aprender o verdadeiro nome do espírito da lâmina.',
      en: 'The first Zanpakuto release attained by learning the true name of the sword’s spiritual essence.',
    },
    traits: {
      'pt-BR': [
        'Ativação por frase de comando poética',
        'Forma única de combate (lâmina dupla, foice, pétalas cortantes)',
        'Aumento substancial do fluxo de Reiatsu',
      ],
      en: [
        'Triggered by a poetic release command',
        'Unique combat form (paired blades, scythe, razor petals)',
        'Substantial boost to Reiatsu output',
      ],
    },
  },
  {
    id: 'bleach_bankai',
    universe: 'bleach',
    entry_type: 'power',
    name: { 'pt-BR': 'Bankai (Liberação Final)', en: 'Bankai (Final Release)' },
    short_description: {
      'pt-BR':
        'O ápice do poder Shinigami. Materialização e subjugação completa do espírito da Zanpakuto no plano físico.',
      en: 'The pinnacle of Shinigami power. Complete materialization and subjugation of the Zanpakuto spirit in physical reality.',
    },
    traits: {
      'pt-BR': [
        'Multiplica a capacidade de combate em 5 a 10 vezes',
        'Geralmente requer décadas de treino e domínio espiritual',
        'Pode alterar o clima, o espaço ou convocar entidades colossais',
      ],
      en: [
        'Multiplies combat prowess five to ten-fold',
        'Typically requires decades of spiritual discipline',
        'Alters environment, weather, or summons titan constructs',
      ],
    },
  },

  // --- DRAGON BALL ---
  {
    id: 'db_saiyan',
    universe: 'dragonball',
    entry_type: 'race',
    name: { 'pt-BR': 'Saiyajin', en: 'Saiyan' },
    short_description: {
      'pt-BR':
        'Raça guerreira orgulhosa do Planeta Vegeta, com cauda de macaco, apetite voraz e sede insaciável por superação e combate.',
      en: 'A proud warrior race from Planet Vegeta bearing a monkey tail, insatiable appetite, and boundless lust for battle.',
    },
    traits: {
      'pt-BR': [
        'Zenkai (o poder aumenta exponencialmente após quase morrer em combate)',
        'Transformação em Oozaru (Macaco Gigante sob lua cheia)',
        'Acesso às transformações lendárias de Super Saiyajin',
      ],
      en: [
        'Zenkai (power skyrockets after recovering from near-fatal injuries)',
        'Great Ape (Oozaru) transformation under a full moon',
        'Access to legendary Super Saiyan ascended forms',
      ],
    },
  },
  {
    id: 'db_namek',
    universe: 'dragonball',
    entry_type: 'race',
    name: { 'pt-BR': 'Namekuseijin', en: 'Namekian' },
    short_description: {
      'pt-BR':
        'Seres humanoides verdes e pacíficos do Planeta Namekusei, divididos entre guerreiros ferozes e curandeiros/criadores místicos.',
      en: 'Green-skinned beings from Planet Namek divided into fierce warrior protectors and mystical dragon-clan creators.',
    },
    traits: {
      'pt-BR': [
        'Regeneração corporal completa (enquanto a cabeça estiver intacta)',
        'Audição aguçada e alongamento de membros',
        'Habilidade de forjar Esferas do Dragão e fusão namekuseijin',
      ],
      en: [
        'Total limb and tissue regeneration (as long as the head remains)',
        'Acute hearing and elastic limbs',
        'Ability to craft Dragon Balls and undergo Namekian fusion',
      ],
    },
  },
  {
    id: 'db_kamehameha',
    universe: 'dragonball',
    entry_type: 'power',
    name: { 'pt-BR': 'Kamehameha', en: 'Kamehameha' },
    short_description: {
      'pt-BR':
        'A lendária onda de energia condensada criada pelo Mestre Kame. O usuário concentra todo o Ki nas palmas unidas e o projeta em fúria.',
      en: 'The legendary condensed Ki wave created by Master Roshi. Concentrates latent energy between cupped hands before blasting.',
    },
    traits: {
      'pt-BR': [
        'Feixe de energia concentrada azul-celeste',
        'Pode ser curvado, teletransportado ou disparado pelos pés',
        'Escala infinitamente com a reserva de Ki do usuário',
      ],
      en: [
        'Azure piercing energy beam',
        'Can be curved, fired from feet, or combined with Instant Transmission',
        'Scales directly with total Ki reserves',
      ],
    },
  },
  {
    id: 'db_super_saiyan',
    universe: 'dragonball',
    entry_type: 'power',
    name: { 'pt-BR': 'Super Saiyajin', en: 'Super Saiyan' },
    short_description: {
      'pt-BR':
        'A transformação lendária despertada pela fúria justa. Cabelos dourados erguidos, olhos esmeralda e aura flamejante.',
      en: 'The legendary transformation awakened through righteous fury. Gilded spiky hair, emerald irises, and a blazing aura.',
    },
    traits: {
      'pt-BR': [
        'Multiplica o poder de luta em 50 vezes no primeiro estágio',
        'Aura dourada cintilante que estilhaça o terreno próximo',
        'Evoluções subsequentes: SSJ2, SSJ3, SSJ God, SSJ Blue',
      ],
      en: [
        'Multiplies combat power fifty-fold in base form',
        'Blazing golden aura that cracks nearby stone',
        'Subsequent ascended tiers: SSJ2, SSJ3, SSJ God, SSJ Blue',
      ],
    },
  },
  {
    id: 'db_kaio_ken',
    universe: 'dragonball',
    entry_type: 'power',
    name: { 'pt-BR': 'Kaiô-ken (Técnica do Senhor Kaiô)', en: 'Kaio-ken' },
    short_description: {
      'pt-BR':
        'Técnica do Senhor Kaiô que multiplica instantaneamente o Ki, velocidade e força física ao custo de extrema tensão corporal.',
      en: 'King Kai’s secret art that multiplies Ki, speed, and raw striking power at the cost of punishing strain on the physical body.',
    },
    traits: {
      'pt-BR': [
        'Aura carmesim cintilante',
        'Multiplicadores graduais (x2, x3, x10, x20)',
        'Risco de colapso muscular se o corpo não resistir à carga',
      ],
      en: [
        'Blazing crimson energy shroud',
        'Scalable multipliers (x2, x3, x10, x20)',
        'Severe risk of muscular collapse if the vessel cannot endure the strain',
      ],
    },
  },

  // --- ANIMES GERAIS ---
  {
    id: 'anime_ghoul',
    universe: 'anime',
    entry_type: 'race',
    name: { 'pt-BR': 'Ghoul (Tokyo Ghoul)', en: 'Ghoul (Tokyo Ghoul)' },
    short_description: {
      'pt-BR':
        'Criaturas humanoides predatórias que só conseguem se nutrir de carne humana e café, dotadas de órgãos de combate Kagune.',
      en: 'Predatory humanoids surviving solely on human flesh and black coffee, armed with biological Kagune predatory organs.',
    },
    traits: {
      'pt-BR': [
        'Kakugan (olhos negros com esclera vermelha)',
        'Órgão de caça Kagune (Rinkaku, Ukaku, Koukaku, Bikaku)',
        'Pele impenetrável a lâminas comuns',
      ],
      en: [
        'Kakugan (blackened eyes with blood-red irises)',
        'Predatory Kagune limb (Rinkaku, Ukaku, Koukaku, Bikaku)',
        'Skin dense enough to break common steel',
      ],
    },
  },
  {
    id: 'anime_homunculus',
    universe: 'anime',
    entry_type: 'race',
    name: { 'pt-BR': 'Homúnculo (Fullmetal Alchemist)', en: 'Homunculus (Fullmetal Alchemist)' },
    short_description: {
      'pt-BR':
        'Humanoides artificiais criados por alquimia proibida, nutridos pela Pedra Filosofal e personificando um dos sete pecados capitais.',
      en: 'Artificial humanoids birthed from forbidden alchemy, fueled by a Philosopher’s Stone and embodying a deadly sin.',
    },
    traits: {
      'pt-BR': [
        'Regeneração quase infinita à base de almas da Pedra',
        'Habilidade singular extrema (Olho Supremo, Lança Suprema, Sombra)',
        'Marca de Ouroboros visível na pele',
      ],
      en: [
        'Near-infinite regeneration powered by Philosopher souls',
        'Singular ultimate trait (Ultimate Eye, Shield, Shadow)',
        'Visible mark of the Ouroboros on their flesh',
      ],
    },
  },
  {
    id: 'anime_nen',
    universe: 'anime',
    entry_type: 'power',
    name: { 'pt-BR': 'Nen & Hatsu (Hunter x Hunter)', en: 'Nen & Hatsu (Hunter x Hunter)' },
    short_description: {
      'pt-BR':
        'A manipulação da aura vital individual, dividida em seis afinidades: Reforço, Emissão, Transmutação, Manipulação, Materialização e Especialização.',
      en: 'The manipulation of one’s life aura, governed by six affinities: Enhancement, Emission, Transmutation, Manipulation, Conjuration, and Specialization.',
    },
    traits: {
      'pt-BR': [
        'Fundamentos vitais: Ten, Zetsu, Ren e Hatsu',
        'Habilidades moldadas pela psicologia e juramentos de sacrifício',
        'Gyo para enxergar aura oculta e Ko para concentração máxima',
      ],
      en: [
        'Core pillars: Ten, Zetsu, Ren, and Hatsu',
        'Abilities carved by personality and binding vows',
        'Gyo reveals concealed aura; Ko gathers maximum focus',
      ],
    },
  },
  {
    id: 'anime_domain_expansion',
    universe: 'anime',
    entry_type: 'power',
    name: {
      'pt-BR': 'Expansão de Domínio (Jujutsu Kaisen)',
      en: 'Domain Expansion (Jujutsu Kaisen)',
    },
    short_description: {
      'pt-BR':
        'O ápice da feitiçaria jujutsu: materializar o território inato do usuário no mundo real através de uma barreira mágica fechada.',
      en: 'The pinnacle of jujutsu sorcery: constructing one’s innate domain in physical reality through an enclosed barrier.',
    },
    traits: {
      'pt-BR': [
        'Acerto garantido para as técnicas amaldiçoadas do usuário dentro da barreira',
        'Buff massivo nas estatísticas do conjurador',
        'Pode ser disputado e quebrado por outro domínio superior',
      ],
      en: [
        'Sure-hit factor applies to all innate techniques inside',
        'Massive statistical empowerment for the caster',
        'Can be clashed against and breached by an overlapping domain',
      ],
    },
  },

  // --- JOGOS (GAMES & JRPGs) ---
  {
    id: 'game_dragonborn_dovah',
    universe: 'games',
    entry_type: 'race',
    name: {
      'pt-BR': 'Dovahkiin / Sangue de Dragão (Skyrim)',
      en: 'Dragonborn / Dovahkiin (Skyrim)',
    },
    short_description: {
      'pt-BR':
        'Mortal nascido com o corpo de um homem e a alma imortal de um dragão, abençoado pelos deuses com o dom da Voz (Thu’um).',
      en: 'A mortal born with the frame of mankind and the immortal soul of a dragon, gifted with the Voice (Thu’um).',
    },
    traits: {
      'pt-BR': [
        'Capaz de absorver almas de dragões caídos',
        'Uso instantâneo de Gritos Antigos (Fus Ro Dah, Desacelerar Tempo)',
        'Compreensão inata da linguagem dracônica ancestral',
      ],
      en: [
        'Absorbs the soul and knowledge of fallen dragons',
        'Direct mastery of Dragon Shouts (Fus Ro Dah, Slow Time)',
        'Innate fluency in the ancient Dovah language',
      ],
    },
  },
  {
    id: 'game_materia',
    universe: 'games',
    entry_type: 'power',
    name: {
      'pt-BR': 'Matéria Mako & Limit Break (Final Fantasy)',
      en: 'Materia & Limit Break (Final Fantasy)',
    },
    short_description: {
      'pt-BR':
        'Esferas de energia Mako condensada que canalizam o Lifestream em feitiços arcanos, e surtos de adrenalina que liberam golpes definitivos.',
      en: 'Crystallized Mako orbs channeling the Lifestream into arcana, coupled with adrenaline surges that unleash Limit Breaks.',
    },
    traits: {
      'pt-BR': [
        'Magias elementais (Fogo, Gelo, Trovão) e invocações lendárias',
        'Barra de Limit Break carregada ao sofrer dano em batalha',
        'Habilidades supremas devastadoras como Omnislash',
      ],
      en: [
        'Elemental spells (Fire, Blizzard, Thunder) and legendary summons',
        'Limit Break gauge fills as damage is sustained',
        'Devastating ultimate techniques like Omnislash',
      ],
    },
  },
  {
    id: 'game_tarnished',
    universe: 'games',
    entry_type: 'race',
    name: { 'pt-BR': 'Maculado / Tarnished (Elden Ring)', en: 'Tarnished (Elden Ring)' },
    short_description: {
      'pt-BR':
        'Guerreiros exilados das Terras Intermédias que perderam a Graça dourada, agora chamados de volta pela luz para forjar um novo destino.',
      en: 'Exiled warriors of the Lands Between who once lost the golden Grace, now summoned back to mend the broken Ring.',
    },
    traits: {
      'pt-BR': [
        'Ressurreição através dos Sítios de Graça',
        'Uso de Cinzas de Guerra e Feitiços Primordiais',
        'Aptidão para empunhar Grandes Runas e restaurar a Ordem',
      ],
      en: [
        'Resurrection guided by Sites of Grace',
        'Mastery of Ashes of War and Primeval Glintstone Sorceries',
        'Attuned to wield Great Runes and reshape the Order',
      ],
    },
  },
  {
    id: 'game_parry',
    universe: 'games',
    entry_type: 'power',
    name: {
      'pt-BR': 'Apara Precisa / Parry & Contra-Ataque',
      en: 'Perfect Parry & Visceral Strike',
    },
    short_description: {
      'pt-BR':
        'A arte do desvio milimétrico no instante exato do impacto, quebrando a postura do adversário e abrindo brecha para um golpe visceral.',
      en: 'The razor-sharp deflection at the precise frame of impact, shattering foe posture and opening a visceral critical window.',
    },
    traits: {
      'pt-BR': [
        'Requer sincronia perfeita de reflexos',
        'Anula completamente o dano de ataques físicos pesados',
        'Atordoa o inimigo e viabiliza execução crítica imediata',
      ],
      en: [
        'Demands exact reflex timing',
        'Completely negates incoming physical impact damage',
        'Staggers opponent and unlocks an immediate critical riposte',
      ],
    },
  },
]

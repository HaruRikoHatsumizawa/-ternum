// Semente bilíngue do Glossário Arcano: termos clássicos de RPG, chaveados por
// categoria. Os verbetes criados pelo usuário NÃO passam por aqui (conteúdo do
// usuário nunca é traduzido) — estes vivem apenas nos locales, não no banco.
import type { GlossaryCategoryId } from '@/services/glossary'

export interface GlossarySeedTerm {
  term: { 'pt-BR': string; en: string }
  definition: { 'pt-BR': string; en: string }
}

export const GLOSSARY_SEED_TERMS: Record<GlossaryCategoryId, GlossarySeedTerm[]> = {
  combate: [
    {
      term: { 'pt-BR': 'Iniciativa', en: 'Initiative' },
      definition: {
        'pt-BR':
          'A rolagem que define a ordem de ação no início de um combate. Cada combatente rola (geralmente 1d20 + modificador de Destreza) e age do maior resultado para o menor.',
        en: 'The roll that sets the order of action at the start of combat. Each combatant rolls (usually 1d20 + Dexterity modifier) and acts from the highest result to the lowest.',
      },
    },
    {
      term: { 'pt-BR': 'Classe de Armadura (CA)', en: 'Armor Class (AC)' },
      definition: {
        'pt-BR':
          'A defesa que um ataque precisa igualar ou superar para acertar. Soma de armadura, escudo, Destreza e encantamentos — o quanto o personagem é difícil de ferir.',
        en: 'The defense an attack must meet or beat to hit. The sum of armor, shield, Dexterity and enchantments — how hard the character is to wound.',
      },
    },
    {
      term: { 'pt-BR': 'Pontos de Vida (PV)', en: 'Hit Points (HP)' },
      definition: {
        'pt-BR':
          'A medida de vigor e resistência do personagem. Zerar os pontos de vida derruba o herói; dano suficiente além disso pode ameaçar a vida definitiva.',
        en: "The measure of a character's vigor and resilience. Reaching zero drops the hero; damage beyond that can threaten true death.",
      },
    },
    {
      term: { 'pt-BR': 'Dano', en: 'Damage' },
      definition: {
        'pt-BR':
          'Os pontos de vida subtraídos quando um ataque, feitiço ou perigo acerta. Cada arma e efeito tem seus próprios dados de dano, como 1d8+3.',
        en: 'The hit points subtracted when an attack, spell or hazard lands. Each weapon and effect carries its own damage dice, such as 1d8+3.',
      },
    },
    {
      term: { 'pt-BR': 'Cura', en: 'Healing' },
      definition: {
        'pt-BR':
          'A restauração de pontos de vida perdidos, por magia, poções ou descanso. Nem toda ferida cede ao mesmo remédio: alguns efeitos só curam em descanso longo.',
        en: 'The restoration of lost hit points through magic, potions or rest. Not every wound yields to the same remedy: some effects heal only during a long rest.',
      },
    },
    {
      term: { 'pt-BR': 'Ação & Ação Bônus', en: 'Action & Bonus Action' },
      definition: {
        'pt-BR':
          'O orçamento de um turno: uma ação principal (atacar, conjurar) e, quando permitido, uma ação bônus rápida (beber poção, conjurar um truque menor).',
        en: 'The budget of a turn: one main action (attack, cast) and, when allowed, one quick bonus action (drink a potion, cast a lesser cantrip).',
      },
    },
    {
      term: { 'pt-BR': 'Ataque de Oportunidade', en: 'Opportunity Attack' },
      definition: {
        'pt-BR':
          'O golpe reativo desferido quando um inimigo sai do seu alcance sem se afastar com cuidado. Recompensa posições e pune retiradas apressadas.',
        en: 'The reactive strike taken when an enemy leaves your reach without disengaging carefully. It rewards positioning and punishes hasty retreats.',
      },
    },
    {
      term: { 'pt-BR': 'TPK (Queda Total do Grupo)', en: 'TPK (Total Party Kill)' },
      definition: {
        'pt-BR':
          'A queda de todo o grupo em um único embate. O pesadelo silencioso de toda mesa — e, para algumas, o início de uma história ainda mais sombria.',
        en: "The fall of the entire party in a single fight. Every table's quiet nightmare — and, for some, the start of an even darker story.",
      },
    },
  ],
  dados: [
    {
      term: { 'pt-BR': 'Vantagem & Desvantagem', en: 'Advantage & Disadvantage' },
      definition: {
        'pt-BR':
          'Rolagem com dois dados, mantendo o maior (vantagem) ou o menor (desvantagem). Condições favoráveis ou adversas raramente se acumulam: não há empilhamento.',
        en: 'Rolling two dice and keeping the higher (advantage) or the lower (disadvantage). Favorable or adverse conditions rarely stack: there is no piling up.',
      },
    },
    {
      term: { 'pt-BR': 'Crítico & Falha Crítica', en: 'Critical Hit & Fumble' },
      definition: {
        'pt-BR':
          'O 20 natural é um acerto triunfal que dobra os dados de dano; o 1 natural é o tropeço que todo aventureiro teme. Algumas mesas somam glórias e catástrofes próprias.',
        en: 'A natural 20 is a triumphant hit that doubles the damage dice; a natural 1 is the stumble every adventurer fears. Some tables add glories and catastrophes of their own.',
      },
    },
    {
      term: { 'pt-BR': 'Classe de Dificuldade (CD)', en: 'Difficulty Class (DC)' },
      definition: {
        'pt-BR':
          'O número que um teste precisa alcançar para ter sucesso. Escalar uma muralha pode ser CD 10; desarmar uma armadilha arcana, CD 18. O Mestre declara, os dados respondem.',
        en: 'The number a check must reach to succeed. Climbing a wall might be DC 10; disarming an arcane trap, DC 18. The Master declares, the dice answer.',
      },
    },
    {
      term: { 'pt-BR': 'Teste de Resistência', en: 'Saving Throw' },
      definition: {
        'pt-BR':
          'A defesa ativa contra um efeito que posição nenhuma esquivaria: um veneno, um brado medonho, um raio de desintegração. Usa o modificador do atributo ameaçado.',
        en: 'The active defense against an effect no positioning would dodge: a poison, a dreadful howl, a disintegration ray. It uses the modifier of the threatened attribute.',
      },
    },
    {
      term: { 'pt-BR': 'Perícia', en: 'Skill Check' },
      definition: {
        'pt-BR':
          'O teste que mede treinamento e talento em uma área — Furtividade, Persuasão, Arcanismo. Rola-se o dado mais o bônus da perícia contra a dificuldade da cena.',
        en: "The check that measures training and talent in a field — Stealth, Persuasion, Arcana. Roll the die plus the skill's bonus against the scene's difficulty.",
      },
    },
  ],
  personagem: [
    {
      term: { 'pt-BR': 'Atributos', en: 'Ability Scores' },
      definition: {
        'pt-BR':
          'As seis medidas do herói: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma. Delas nascem os modificadores que colore cada rolagem e defesa.',
        en: "The hero's six measures: Strength, Dexterity, Constitution, Intelligence, Wisdom and Charisma. From them flow the modifiers that color every roll and defense.",
      },
    },
    {
      term: { 'pt-BR': 'Proficiência', en: 'Proficiency' },
      definition: {
        'pt-BR':
          'O domínio formal de armas, ferramentas, perícias e salvaguardas. A bonificação de proficiência cresce com o nível e é somada apenas ao que o personagem realmente pratica.',
        en: 'The formal mastery of weapons, tools, skills and saves. The proficiency bonus grows with level and is added only to what the character truly practices.',
      },
    },
    {
      term: { 'pt-BR': 'Inspiração', en: 'Inspiration' },
      definition: {
        'pt-BR':
          'A recompensa do Mestre por uma interpretação memorável: gastá-la concede vantagem em uma rolagem, à escolha do jogador.',
        en: "The Master's reward for memorable roleplay: spending it grants advantage on one roll, of the player's choice.",
      },
    },
    {
      term: { 'pt-BR': 'Multiclasse', en: 'Multiclassing' },
      definition: {
        'pt-BR':
          'O juramento de seguir mais de uma vocação: o guerreiro que estuda magia, a ladina que abraça a fé. Regras especiais combinam níveis, perícias e espaços de magia.',
        en: 'The oath to follow more than one vocation: the warrior who studies magic, the rogue who embraces faith. Special rules blend levels, skills and spell slots.',
      },
    },
    {
      term: { 'pt-BR': 'Personagem Jogador (PJ)', en: 'Player Character (PC)' },
      definition: {
        'pt-BR':
          'O protagonista sob o comando direto de um jogador na mesa — sua história, seus objetivos, seus erros gloriosos. Distinto dos seres conduzidos pelo Mestre.',
        en: 'The protagonist directly commanded by a player at the table — their story, their goals, their glorious mistakes. Distinct from the beings conducted by the Master.',
      },
    },
    {
      term: { 'pt-BR': 'Nível de Experiência (XP)', en: 'Experience Level (XP)' },
      definition: {
        'pt-BR':
          'A medida do crescimento: pontos acumulados por vitórias e feitos elevam o nível do personagem, desbloqueando poderes, magias e resiliência.',
        en: "The measure of growth: points earned from victories and deeds raise the character's level, unlocking powers, spells and resilience.",
      },
    },
  ],
  regras: [
    {
      term: { 'pt-BR': 'Espaço de Magia', en: 'Spell Slot' },
      definition: {
        'pt-BR':
          'A reserva limitada de energia arcana: conjurar um feitiço gasta um espaço de nível igual ou superior ao do feitiço. Os descansos restauram a reserva.',
        en: 'The limited reserve of arcane energy: casting a spell spends a slot of equal or higher level. Rests refill the reserve.',
      },
    },
    {
      term: { 'pt-BR': 'Truque (Cantrip)', en: 'Cantrip' },
      definition: {
        'pt-BR':
          'O feitiço menor fixado na memória do conjurador: não gasta espaço de magia e pode ser repetido infinitamente, ainda que com poder modesto.',
        en: "The minor spell fixed in the caster's memory: it spends no slot and may be cast endlessly, though with modest power.",
      },
    },
    {
      term: { 'pt-BR': 'Descanso Curto & Longo', en: 'Short & Long Rest' },
      definition: {
        'pt-BR':
          'A pausa que recupera o grupo: uma hora de alívio devolve recursos menores; uma noite inteira de sono restaura pontos de vida e espaços de magia.',
        en: "The pause that restores the party: an hour of relief returns lesser resources; a full night's sleep restores hit points and spell slots.",
      },
    },
  ],
  mesa: [
    {
      term: { 'pt-BR': 'NPC (Personagem Não Jogador)', en: 'NPC (Non-Player Character)' },
      definition: {
        'pt-BR':
          'Todo ser do mundo que não pertence ao grupo: o tavernento, o vilão, o aliado improvável. Cabe ao Mestre interpretá-los com voz e vontade próprias.',
        en: 'Every being of the world outside the party: the innkeeper, the villain, the unlikely ally. It falls to the Master to voice them with a will of their own.',
      },
    },
    {
      term: { 'pt-BR': 'Mestre (Game Master)', en: 'Game Master (GM)' },
      definition: {
        'pt-BR':
          'O narrador e árbitro da campanha: descreve o mundo, interpreta o resto do elenco e decide as consequências. Na mesa, a palavra final é dele.',
        en: 'The narrator and referee of the campaign: describes the world, voices the rest of the cast and rules on consequences. At the table, the final word is theirs.',
      },
    },
    {
      term: { 'pt-BR': 'Metagaming', en: 'Metagaming' },
      definition: {
        'pt-BR':
          'Usar no jogo o que o personagem não saberia — estatísticas de monstros do manual, segredos de outra campanha. A conduta pede que tal saber fique com o jogador, não com o herói.',
        en: 'Using in play what the character would not know — monster stats read from the manual, secrets from another campaign. Etiquette keeps that knowledge with the player, not the hero.',
      },
    },
    {
      term: { 'pt-BR': 'Powergaming', en: 'Powergaming' },
      definition: {
        'pt-BR':
          'A jogada centrada nos números: otimizar atributos e combinações em detrimento da história. Não é falta grave — mas mesas equilibradas cobram um pouco de alma.',
        en: 'Play centered on numbers: optimizing stats and builds at the expense of story. Not a grave fault — but balanced tables ask for a bit of soul.',
      },
    },
    {
      term: { 'pt-BR': 'Roleplay vs Rollplay', en: 'Roleplay vs Rollplay' },
      definition: {
        'pt-BR':
          'O jogo de viver o personagem (fala, humor, escolhas) contra o jogo de rolar dados. As melhores mesas alternam os dois sem escravizar nenhum.',
        en: 'The game of living the character (voice, wit, choices) against the game of rolling dice. The best tables alternate both without enslaving either.',
      },
    },
    {
      term: { 'pt-BR': 'Homebrew', en: 'Homebrew' },
      definition: {
        'pt-BR':
          'Conteúdo autoral da mesa: raças, classes, monstros e regras criados fora dos livros oficiais. Cabe ao Mestre aprová-lo e calibrá-lo com o grupo.',
        en: "The table's own content: races, classes, monsters and rules crafted outside the official books. The Master approves and calibrates it with the group.",
      },
    },
    {
      term: { 'pt-BR': 'Canon', en: 'Canon' },
      definition: {
        'pt-BR':
          'O que é verdade oficial na crônica da campanha: fatos fixados pela narração e aceitos pela mesa. O resto é rumor, lenda ou projeto de futuro.',
        en: "What is officially true in the campaign's chronicle: facts fixed by narration and accepted by the table. Everything else is rumor, legend or a draft of the future.",
      },
    },
    {
      term: { 'pt-BR': 'Munchkin', en: 'Munchkin' },
      definition: {
        'pt-BR':
          'O jogador que trata a mesa como tabuleiro de conquista: apunhala o equilíbrio, a narração e os amigos para ganhar vantagem. Epíteto carinhoso... quase sempre.',
        en: 'The player who treats the table as a conquest board: stabbing balance, narration and friends for an edge. An affectionate epithet... almost always.',
      },
    },
  ],
}

// Semente bilíngue do Glossário Arcano: termos clássicos e essenciais de RPG, chaveados por
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
      term: { 'pt-BR': 'Dano & Tipos de Dano', en: 'Damage & Damage Types' },
      definition: {
        'pt-BR':
          'Os pontos de vida subtraídos quando um ataque, feitiço ou perigo acerta. Dividido em cortante, perfurante, contundente, fogo, gelo, elétrico, necrótico e radiante.',
        en: 'The hit points subtracted when an attack, spell or hazard lands. Divided into slashing, piercing, bludgeoning, fire, cold, lightning, necrotic and radiant.',
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
      term: { 'pt-BR': 'Reação', en: 'Reaction' },
      definition: {
        'pt-BR':
          'Uma resposta instantânea a um gatilho durante o turno de outro combatente, como conjurar o feitiço Escudo Arcano ou desferir um Ataque de Oportunidade.',
        en: 'An instant response to a trigger during another combatant’s turn, such as casting Shield or delivering an Opportunity Attack.',
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
      term: { 'pt-BR': 'Cobertura & Linha de Visão', en: 'Cover & Line of Sight' },
      definition: {
        'pt-BR':
          'Obstáculos físicos que concedem bônus na Classe de Armadura e em testes de Destreza (+2 para meia-cobertura, +5 para três-quartos, e bloqueio total em cobertura completa).',
        en: 'Physical obstacles that grant bonuses to AC and Dexterity saving throws (+2 for half cover, +5 for three-quarters, and full blockage for total cover).',
      },
    },
    {
      term: { 'pt-BR': 'Salvaguarda contra a Morte', en: 'Death Saving Throw' },
      definition: {
        'pt-BR':
          'Três testes de d20 rolados a cada turno enquanto zerado de PV: 10 ou mais é sucesso, menos de 10 é falha. Três sucessos estabilizam; três falhas trazem o descanso eterno.',
        en: 'Three d20 rolls taken each turn at 0 HP: 10 or higher is a success, below 10 is a failure. Three successes stabilize; three failures mean eternal rest.',
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
    {
      term: { 'pt-BR': 'Dado de Vida (DV)', en: 'Hit Die (HD)' },
      definition: {
        'pt-BR':
          'O dado representativo da resiliência da classe (d6, d8, d10 ou d12). Gastos durante descansos curtos para curar pontos de vida sem gastar magias ou poções.',
        en: 'The die reflecting class resilience (d6, d8, d10 or d12). Expended during short rests to recover hit points without spending spells or potions.',
      },
    },
    {
      term: { 'pt-BR': 'Explosão de Dados (Exploding Dice)', en: 'Exploding Dice' },
      definition: {
        'pt-BR':
          'Mecânica presente em sistemas narrativos onde rolar o valor máximo do dado permite jogá-lo novamente e somar o novo resultado ao total.',
        en: 'A mechanic in narrative systems where rolling the maximum face grants an extra roll, adding both results together.',
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
      term: { 'pt-BR': 'Modificador de Atributo', en: 'Ability Modifier' },
      definition: {
        'pt-BR':
          'O valor derivado do atributo ((Atributo - 10) / 2) adicionado a testes, ataques, danos e defesas. Um valor de 16 gera bônus +3.',
        en: 'The value derived from an ability score ((Score - 10) / 2) added to checks, attacks, damage and saves. A score of 16 yields a +3 bonus.',
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
      term: { 'pt-BR': 'Talento (Feat)', en: 'Feat' },
      definition: {
        'pt-BR':
          'Uma capacidade especial ou mestria marcial/mágica adquirida no lugar do aumento de atributos, customizando o estilo de jogo do aventureiro.',
        en: 'A special capability or martial/magical mastery chosen instead of an ability score improvement, customizing the adventurer’s playstyle.',
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
    {
      term: { 'pt-BR': 'Alinhamento / Tendência', en: 'Alignment' },
      definition: {
        'pt-BR':
          'A bússola moral do personagem entre Ordem, Caos, Bem e Mal. Um guia de intenção e código pessoal, e não uma camisa de força para interpretação.',
        en: 'The moral compass between Law, Chaos, Good and Evil. A guide of intent and personal code, not a straitjacket for roleplay.',
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
      term: { 'pt-BR': 'Concentração', en: 'Concentration' },
      definition: {
        'pt-BR':
          'O foco mental contínuo exigido por certos encantamentos prolongados. Sofrer dano exige teste de Constituição (CD 10 ou metade do dano) para não perder o feitiço.',
        en: 'The sustained mental focus required by certain enduring enchantments. Taking damage triggers a Constitution check (DC 10 or half the damage) to avoid losing the spell.',
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
    {
      term: { 'pt-BR': 'Sintonia (Attunement)', en: 'Attunement' },
      definition: {
        'pt-BR':
          'O vínculo mágico indispensável entre um aventureiro e uma relíquia poderosa durante um descanso curto. A maioria dos sistemas limita o herói a no máximo três itens sintonizados.',
        en: 'The magical bond forged between an adventurer and a powerful relic over a short rest. Most systems limit a hero to a maximum of three attuned items.',
      },
    },
    {
      term: { 'pt-BR': 'Condições de Status', en: 'Conditions' },
      definition: {
        'pt-BR':
          'Estados temporários que alteram capacidades: Cego, Enfeitiçado, Envenenado, Paralisado, Caído, Atordoado e Inconsciente. Cada uma impõe regras específicas.',
        en: 'Temporary states altering capabilities: Blinded, Charmed, Poisoned, Paralyzed, Prone, Stunned and Unconscious. Each imposes dedicated rules.',
      },
    },
  ],
  mesa: [
    {
      term: { 'pt-BR': 'NPC (Personagem Não Jogador)', en: 'NPC (Non-Player Character)' },
      definition: {
        'pt-BR':
          'Todo ser do mundo que não pertence ao grupo: o taverneiro, o vilão, o aliado improvável. Cabe ao Mestre interpretá-los com voz e vontade próprias.',
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
      term: { 'pt-BR': 'Sessão Zero', en: 'Session Zero' },
      definition: {
        'pt-BR':
          'O encontro inaugural antes da campanha propriamente dita, dedicado ao alinhamento de expectativas, limites temáticos, regras da casa e criação conjunta de personagens.',
        en: 'The inaugural gathering before the campaign kicks off, dedicated to aligning expectations, safety tools, house rules and collective character creation.',
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
      term: { 'pt-BR': 'Linhas & Véus (Safety Tools)', en: 'Lines & Veils' },
      definition: {
        'pt-BR':
          'Ferramenta de consenso da mesa: Linhas são assuntos proibidos e ausentes da crônica; Véus são temas que podem ocorrer mas são descritos discretamente sem detalhes gráficos.',
        en: 'A table safety tool: Lines are prohibited topics never brought into the narrative; Veils are topics that may exist but are discreetly faded to black.',
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
  nerd: [
    {
      term: { 'pt-BR': 'OC (Original Character)', en: 'OC (Original Character)' },
      definition: {
        'pt-BR':
          'Personagem original criado pelo jogador ou autor, não pertencente ao elenco canônico da obra ou cenário.',
        en: 'An original character conceived by the player or author, not part of the canon franchise or setting.',
      },
    },
    {
      term: { 'pt-BR': 'OOC (Out of Character)', en: 'OOC (Out of Character)' },
      definition: {
        'pt-BR':
          'Fora do personagem: falas, comentários ou atitudes do jogador como pessoa real, e não como o herói interpretado.',
        en: 'Out of character: comments, questions or chatter coming from the real-life player rather than the persona being roleplayed.',
      },
    },
    {
      term: { 'pt-BR': 'IC (In Character)', en: 'IC (In Character)' },
      definition: {
        'pt-BR':
          'No personagem: atuação, diálogos e reações estritamente dentro da voz, pensamentos e visão de mundo do personagem.',
        en: 'In character: speech, thoughts, dialogue and actions strictly aligned with the persona and worldview being portrayed.',
      },
    },
    {
      term: { 'pt-BR': 'Canon', en: 'Canon' },
      definition: {
        'pt-BR':
          'O material, histórico e acontecimentos oficiais estabelecidos pelo criador da obra ou pelo mestre da mesa.',
        en: 'The official lore, timeline and events officially recognized by the creator or the game master.',
      },
    },
    {
      term: { 'pt-BR': 'Headcanon', en: 'Headcanon' },
      definition: {
        'pt-BR':
          'Interpretação, detalhe ou teoria pessoal que um fã ou jogador tem sobre um personagem, mesmo sem confirmação explícita no material canônico.',
        en: 'Personal beliefs, backstories or interpretations held by a fan or player about a character, even without explicit confirmation.',
      },
    },
    {
      term: { 'pt-BR': 'AU (Alternative Universe)', en: 'AU (Alternative Universe)' },
      definition: {
        'pt-BR':
          'Universo alternativo: narrativa que coloca personagens conhecidos em um cenário diferente do original (ex.: fantasia medieval, moderno, cyberpunk).',
        en: 'Alternate universe: a scenario setting established characters in a world different from canon (e.g., modern, medieval fantasy, sci-fi).',
      },
    },
    {
      term: { 'pt-BR': 'Ship / Shipping', en: 'Ship / Shipping' },
      definition: {
        'pt-BR':
          'O desejo e torcida para que dois personagens formem um casal ou relação romântica/afetiva em uma história ou mesa de RP.',
        en: 'The wish or active support for two characters to enter into a romantic or close relational dynamic.',
      },
    },
    {
      term: { 'pt-BR': 'OTP (One True Pairing)', en: 'OTP (One True Pairing)' },
      definition: {
        'pt-BR':
          'O par romântico supremo e favorito de um jogador ou fã, considerado a combinação perfeita de almas.',
        en: "A fan or player's all-time favorite romantic pairing, viewed as the ultimate match of souls.",
      },
    },
    {
      term: { 'pt-BR': 'Muse (Musa)', en: 'Muse' },
      definition: {
        'pt-BR':
          'O personagem específico que um participante de RP está interpretando ou escrevendo no momento.',
        en: 'The specific character that a roleplayer is writing, portraying or embodying in an active thread.',
      },
    },
    {
      term: { 'pt-BR': 'Mun (O Escritor)', en: 'Mun' },
      definition: {
        'pt-BR':
          'A pessoa real por trás da tela que escreve e controla a musa (abreviação comum em fóruns de RP e escrita criativa).',
        en: 'The real-world author/person sitting behind the screen writing the muse (common in text roleplay and forum communities).',
      },
    },
    {
      term: { 'pt-BR': 'RP Literário / Para-RP', en: 'Literary RP / Para-RP' },
      definition: {
        'pt-BR':
          'Estilo de interpretação textual em formato de prosa literária e parágrafos elaborados, valorizando descrições sensoriais e riqueza narrativa.',
        en: 'Textual roleplay written in descriptive multi-paragraph literary prose, prioritizing depth, sensory detail and narrative polish.',
      },
    },
    {
      term: { 'pt-BR': 'Semiliterato (Semi-Lit)', en: 'Semi-Lit RP' },
      definition: {
        'pt-BR':
          'Formato de RP com postagens de tamanho moderado (1 a 3 parágrafos curtos), equilibrando ritmo ágil e boa pontuação.',
        en: 'A roleplay pacing format featuring moderate posts (1 to 3 short paragraphs), balancing quick turns with descriptive grammar.',
      },
    },
    {
      term: { 'pt-BR': 'Godmoding', en: 'Godmoding' },
      definition: {
        'pt-BR':
          'A conduta proibida de controlar as ações de outro personagem sem consentimento, ou declarar que seu herói é imune a todo e qualquer golpe.',
        en: 'The taboo practice of controlling another player’s character without consent, or declaring one’s avatar immune to all harm.',
      },
    },
    {
      term: { 'pt-BR': 'Powerplay', en: 'Powerplay' },
      definition: {
        'pt-BR':
          'Forçar um golpe ou efeito irreversível em outro jogador sem permitir que o parceiro de cena reaja ou tente esquivar.',
        en: 'Forcing an automatic hit or irreversible outcome onto another character without granting the scene partner a chance to respond.',
      },
    },
    {
      term: { 'pt-BR': 'Retcon', en: 'Retcon (Retroactive Continuity)' },
      definition: {
        'pt-BR':
          'Continuidade retroativa: alterar, reescrever ou anular fatos previamente narrados para corrigir incoerências ou ajustar o rumo da trama.',
        en: 'Retroactive continuity: amending, rewriting or nullifying previously narrated facts to fix plot holes or steer the narrative.',
      },
    },
    {
      term: { 'pt-BR': 'Crossover', en: 'Crossover' },
      definition: {
        'pt-BR':
          'Encontro narrativo entre personagens ou cenários de franquias distintas (ex.: personagens de animes com cenários medievais de D&D).',
        en: 'A narrative meeting blending characters, factions or lore from two separate franchises or unrelated fictional universes.',
      },
    },
    {
      term: { 'pt-BR': 'Fandom', en: 'Fandom' },
      definition: {
        'pt-BR':
          'A comunidade coletiva de fãs apaixonados por um livro, anime, jogo ou franquia fictícia.',
        en: 'The collective community of enthusiastic fans sharing love for a specific franchise, book, anime or game.',
      },
    },
    {
      term: { 'pt-BR': 'Lore', en: 'Lore' },
      definition: {
        'pt-BR':
          'O conjunto de mitos, história antiga, geografia, deuses e tradições que compõem a fundação do mundo fictício.',
        en: 'The tapestry of history, ancient myths, traditions, gods and geography that forms the background foundation of a fictional realm.',
      },
    },
    {
      term: { 'pt-BR': 'PC (Player Character)', en: 'PC (Player Character)' },
      definition: {
        'pt-BR':
          'Personagem do jogador: o protagonista individual controlado por um participante da mesa de RPG.',
        en: 'Player character: the protagonist avatar controlled directly by an individual tabletop participant.',
      },
    },
    {
      term: { 'pt-BR': 'TPK (Total Party Kill)', en: 'TPK (Total Party Kill)' },
      definition: {
        'pt-BR':
          'A aniquilação completa de todos os heróis do grupo em combate ou catástrofe, encerrando a campanha ou exigindo um milagre narrativo.',
        en: 'The total annihilation of every hero in the adventuring party in a single fight or trap, often closing the chronicle.',
      },
    },
    {
      term: { 'pt-BR': 'PVP (Player vs Player)', en: 'PvP (Player vs Player)' },
      definition: {
        'pt-BR':
          'Confronto direto ou duelo entre personagens de jogadores na mesma mesa. Requer maturidade e consentimento prévio dos participantes.',
        en: 'Direct conflict or duel between player characters at the same table. Requires maturity and clear mutual consent.',
      },
    },
    {
      term: { 'pt-BR': 'PVE (Player vs Environment)', en: 'PvE (Player vs Environment)' },
      definition: {
        'pt-BR':
          'O jogo colaborativo tradicional: os heróis unidos contra os perigos do mundo, monstros e desafios criados pelo mestre.',
        en: 'Traditional cooperative tabletop play: heroes united facing the hazards, monsters and puzzles orchestrated by the game master.',
      },
    },
    {
      term: { 'pt-BR': 'Bleed (Sangramento Emocional)', en: 'Bleed' },
      definition: {
        'pt-BR':
          'O fenômeno em que as emoções sentidas pelo personagem transbordam para o jogador real, ou vice-versa, durante cenas intensas.',
        en: 'The psychological crossover where a character’s emotional state spills into the real player, or vice versa, during intense scenes.',
      },
    },
    {
      term: { 'pt-BR': 'Slow Burn', en: 'Slow Burn' },
      definition: {
        'pt-BR':
          'Narrativa ou romance de desenvolvimento lento e paciente, com tensão gradual construída ao longo de muitas sessões ou capítulos.',
        en: 'A pacing trope where romance or intense plot bonds unfold gradually across dozens of sessions and patient interactions.',
      },
    },
    {
      term: { 'pt-BR': 'Enemies to Lovers', en: 'Enemies to Lovers' },
      definition: {
        'pt-BR':
          'Clássica dinâmica em que dois personagens começam como rivais ou adversários mortais e, aos poucos, desenvolvem confiança e amor.',
        en: 'A beloved trope where two characters begin as fierce adversaries or rivals, gradually earning mutual trust and romantic bond.',
      },
    },
    {
      term: { 'pt-BR': 'Angst', en: 'Angst' },
      definition: {
        'pt-BR':
          'Gênero ou tom de cena focado em angústia, conflito interior, dor moral, culpa ou tristeza profunda de um personagem.',
        en: 'A narrative mood centered on deep emotional torment, grief, guilt, moral friction and existential yearning.',
      },
    },
    {
      term: { 'pt-BR': 'Fluff', en: 'Fluff' },
      definition: {
        'pt-BR':
          'Cenas leves, aconchegantes e doces, focadas em carinho e descanso cômico ou afetivo entre os personagens, sem ameaças iminentes.',
        en: 'Warm, cozy and heartwarming narrative moments centered on comfort, humor and tenderness free of impending danger.',
      },
    },
    {
      term: { 'pt-BR': 'Plot Armor', en: 'Plot Armor' },
      definition: {
        'pt-BR':
          'A blindagem de enredo: quando um personagem sobrevive a situações estatisticamente fatais apenas porque a história precisa dele vivo.',
        en: 'The phenomenon where a character survives statistically lethal circumstances purely because the narrative demands their survival.',
      },
    },
    {
      term: { 'pt-BR': 'Nat 20 / 20 Natural', en: 'Nat 20 (Natural 20)' },
      definition: {
        'pt-BR':
          'Tirar o número 20 puro na face de um dado d20: o ápice da sorte, gerando acertos críticos e momentos lendários na mesa.',
        en: 'Rolling an unaltered 20 on a d20 die face: the pinnacle of fortune, yielding critical triumphs and legendary cheers.',
      },
    },
    {
      term: { 'pt-BR': 'Nat 1 / 1 Natural', en: 'Nat 1 (Natural 1)' },
      definition: {
        'pt-BR':
          'Tirar o número 1 puro na face de um dado d20: falha crítica automática, frequentemente resultando em tragédias cômicas ou desastres heróicos.',
        en: 'Rolling an unaltered 1 on a d20 die face: an automatic critical fumble, often sparking comedic mishaps or dramatic peril.',
      },
    },
  ],
}

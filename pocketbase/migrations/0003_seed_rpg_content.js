migrate(
  (app) => {
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      userRecord = new Record(users)
      userRecord.setEmail('amanda_fac1@yahoo.com.br')
      userRecord.setPassword('Skip@Pass')
      userRecord.setVerified(true)
      userRecord.set('name', 'Amanda Mestra da Campanha')
      app.save(userRecord)
    }

    const userId = userRecord.id
    const pages = app.findCollectionByNameOrId('pages')
    const boards = app.findCollectionByNameOrId('boards')
    const databases = app.findCollectionByNameOrId('databases')

    // 1. Fichas de Personagem & Crônicas
    const rpgPage1 = new Record(pages)
    rpgPage1.set('user', userId)
    rpgPage1.set('title', 'Valerius Lâmina Rubra — Guerreiro Nv. 5')
    rpgPage1.set('icon', '⚔️')
    rpgPage1.set('is_favorite', true)
    rpgPage1.set('blocks', [
      { id: 'b1', type: 'heading_1', content: 'Ficha de Personagem: Valerius Lâmina Rubra' },
      {
        id: 'b2',
        type: 'callout',
        content:
          'Raça: Humano Vencedor | Classe: Guerreiro (Mestre de Batalha) | Nível: 5 | Alinhamento: Caótico e Bom',
      },
      { id: 'b3', type: 'heading_2', content: 'Atributos & Estatísticas Vitais' },
      {
        id: 'b4',
        type: 'bullet',
        content: 'Pontos de Vida (HP): 48 / 48 | Classe de Armadura (CA): 18 (Placas e Escudo)',
      },
      {
        id: 'b5',
        type: 'bullet',
        content: 'Força: 18 (+4) | Destreza: 14 (+2) | Constituição: 16 (+3)',
      },
      {
        id: 'b6',
        type: 'bullet',
        content: 'Inteligência: 10 (+0) | Sabedoria: 12 (+1) | Carisma: 13 (+1)',
      },
      { id: 'b7', type: 'heading_2', content: 'Habilidades Notáveis & Manobras' },
      {
        id: 'b8',
        type: 'todo',
        content: 'Ataque Desarmante (Gasta 1 Dado de Superioridade)',
        checked: false,
      },
      {
        id: 'b9',
        type: 'todo',
        content: 'Ripostar com golpe de reação ao errar golpe inimigo',
        checked: false,
      },
      {
        id: 'b10',
        type: 'todo',
        content: 'Retomar o Fôlego (1d10 + nível) — Pronto para usar',
        checked: true,
      },
      {
        id: 'b11',
        type: 'quote',
        content: '"Aço forjado sob o fogo dos dragões antigos nunca se quebra diante das sombras."',
      },
      { id: 'b12', type: 'heading_3', content: 'Equipamento em Posse' },
      {
        id: 'b13',
        type: 'text',
        content:
          'Espada Longa de Prata Rúnica +1, Escudo Forjado com Brasão de Lobo, Poção de Cura Maior (x2), 65 Moedas de Ouro.',
      },
    ])
    app.save(rpgPage1)

    const rpgPage2 = new Record(pages)
    rpgPage2.set('user', userId)
    rpgPage2.set('title', 'Crônica da Sessão #12: O Resgate nas Criptas Esquecidas')
    rpgPage2.set('icon', '📜')
    rpgPage2.set('is_favorite', true)
    rpgPage2.set('blocks', [
      {
        id: 'p1',
        type: 'heading_1',
        content: 'Crônica da Sessão XII: As Criptas dos Reis Perdidos',
      },
      {
        id: 'p2',
        type: 'callout',
        content: 'Local: Criptas de Val-Morath | Data no jogo: 14 do Mês do Corvo | Mestre: Amanda',
      },
      { id: 'p3', type: 'heading_2', content: 'Resumo dos Acontecimentos' },
      {
        id: 'p4',
        type: 'text',
        content:
          'O grupo atravessou a floresta pantanosa e desceu pelas escadarias úmidas de Val-Morath. Encontraram o tomo selado com cera esmeralda e enfrentaram três carniçais arcanos.',
      },
      { id: 'p5', type: 'heading_3', content: 'Decisões Críticas do Grupo' },
      {
        id: 'p6',
        type: 'todo',
        content: 'Valerius protegeu a maga Lyra de um ataque surpresa',
        checked: true,
      },
      {
        id: 'p7',
        type: 'todo',
        content: 'Decifrar as runas da porta selada antes do amanhecer',
        checked: true,
      },
      {
        id: 'p8',
        type: 'todo',
        content: 'Encontrar a chave de obsidiana guardada pelo Espectro Ancião',
        checked: false,
      },
      {
        id: 'p9',
        type: 'quote',
        content:
          '"Apenas os puros de coração ou os portadores da chama primordial ultrapassarão este umbral."',
      },
    ])
    app.save(rpgPage2)

    const rpgPage3 = new Record(pages)
    rpgPage3.set('user', userId)
    rpgPage3.set('title', 'Lyra Sombra-Estelar — Maga Evocadora Nv. 4')
    rpgPage3.set('icon', '🔮')
    rpgPage3.set('is_favorite', false)
    rpgPage3.set('blocks', [
      { id: 'l1', type: 'heading_1', content: 'Ficha de Personagem: Lyra Sombra-Estelar' },
      {
        id: 'l2',
        type: 'callout',
        content: 'Raça: Meio-Elfa | Classe: Maga (Evocação) | Nível: 4 | HP: 26 / 26',
      },
      { id: 'l3', type: 'heading_2', content: 'Grimório de Magias Preparadas' },
      {
        id: 'l4',
        type: 'todo',
        content: 'Mísseis Mágicos (1º círculo) — 3 espaços restantes',
        checked: true,
      },
      { id: 'l5', type: 'todo', content: 'Escudo Arcano (1º círculo)', checked: true },
      { id: 'l6', type: 'todo', content: 'Passo Nebuloso (2º círculo)', checked: false },
      { id: 'l7', type: 'todo', content: 'Esfera Flamejante (2º círculo)', checked: false },
    ])
    app.save(rpgPage3)

    // 2. Quadro de Missões (Quests)
    const rpgBoard = new Record(boards)
    rpgBoard.set('user', userId)
    rpgBoard.set('name', 'Mural de Missões da Taverna do Javali Dourado')
    rpgBoard.set(
      'description',
      'Contratos de caça, expedições arcanas e missões principais da campanha',
    )
    rpgBoard.set('icon', '🛡️')
    rpgBoard.set('columns', [
      {
        id: 'todo',
        title: 'Missões Disponíveis',
        color: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
      },
      {
        id: 'in_progress',
        title: 'Em Andamento',
        color: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
      },
      {
        id: 'done',
        title: 'Missões Cumpridas',
        color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
      },
    ])
    rpgBoard.set('cards', [
      {
        id: 'c_rpg_1',
        columnId: 'todo',
        title: 'Investigar o Culto do Olho Vazio',
        description:
          'Rumores dizem que clérigos corrompidos estão se reunindo nas catacumbas sob a catedral abandonada.',
        priority: 'alta',
        dueDate: '2025-05-01',
      },
      {
        id: 'c_rpg_2',
        columnId: 'todo',
        title: 'Coletar Raiz de Mandrágora Prateada',
        description:
          'O alquimista Gorim pagará 50 PO por três raízes colhidas na névoa da Floresta dos Sussurros.',
        priority: 'baixa',
        dueDate: '2025-05-10',
      },
      {
        id: 'c_rpg_3',
        columnId: 'in_progress',
        title: 'Recuperar o Amuleto de Solaris',
        description:
          'O artefato foi roubado por um bando de orcs e goblins entrincheirados na Fortaleza da Cicatriz.',
        priority: 'alta',
        dueDate: '2025-04-20',
      },
      {
        id: 'c_rpg_4',
        columnId: 'done',
        title: 'Livrar o Moinho do Vale da Infestação de Aranhas',
        description:
          'A aranha-gigante rainha foi derrotada e o trigo da aldeia foi salvo com louvor.',
        priority: 'media',
        dueDate: '2025-04-02',
      },
    ])
    app.save(rpgBoard)

    // 3. Códice de NPCs, Itens e Monstros (Database)
    const rpgDb = new Record(databases)
    rpgDb.set('user', userId)
    rpgDb.set('name', 'Códice Arcano: Monstros, Itens & NPCs')
    rpgDb.set(
      'description',
      'Arquivo de criaturas, relíquias mágicas e personagens não jogáveis da mesa',
    )
    rpgDb.set('icon', '🐉')
    rpgDb.set('columns', [
      { id: 'col_name', name: 'Nome / Identificação', type: 'text' },
      {
        id: 'col_type',
        name: 'Categoria',
        type: 'select',
        values: [
          'NPC Aliado',
          'Inimigo / Chefe',
          'Monstro Bestial',
          'Item Mágico',
          'Artefato Lendário',
        ],
      },
      {
        id: 'col_cr',
        name: 'Nível / Desafio (ND)',
        type: 'text',
      },
      {
        id: 'col_status',
        name: 'Estado no Jogo',
        type: 'select',
        values: ['Ativo / Vivo', 'Derrotado', 'Em Posse do Grupo', 'Desaparecido'],
      },
      { id: 'col_loc', name: 'Localização / Origem', type: 'text' },
    ])
    rpgDb.set('rows', [
      {
        id: 'r_rpg_1',
        col_name: 'Lorde Malakor, o Espectro',
        col_type: 'Inimigo / Chefe',
        col_cr: 'ND 7 (2.900 XP)',
        col_status: 'Ativo / Vivo',
        col_loc: 'Torre de Obsidiana de Mal-Gath',
      },
      {
        id: 'r_rpg_2',
        col_name: 'Anel do Salto Arcano',
        col_type: 'Item Mágico',
        col_cr: 'Raro (Requer Sintonia)',
        col_status: 'Em Posse do Grupo',
        col_loc: 'Inventário de Lyra',
      },
      {
        id: 'r_rpg_3',
        col_name: 'Gorim Mão-de-Ferro (Ferreiro Anão)',
        col_type: 'NPC Aliado',
        col_cr: 'Cidadão Especial',
        col_status: 'Ativo / Vivo',
        col_loc: 'Vila da Pedra Alta',
      },
      {
        id: 'r_rpg_4',
        col_name: 'Aranha Rainha da Cripta',
        col_type: 'Monstro Bestial',
        col_cr: 'ND 3 (700 XP)',
        col_status: 'Derrotado',
        col_loc: 'Moinho Antigo do Vale',
      },
      {
        id: 'r_rpg_5',
        col_name: 'Coração de Solaris (Gema da Luz)',
        col_type: 'Artefato Lendário',
        col_cr: 'Artefato Sagrado',
        col_status: 'Desaparecido',
        col_loc: 'Fortaleza da Cicatriz',
      },
    ])
    app.save(rpgDb)
  },
  (app) => {
    // rollback
  },
)

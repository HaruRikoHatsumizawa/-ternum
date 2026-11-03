migrate(
  (app) => {
    // 1. Sessions collection
    const sessions = new Collection({
      name: 'sessions',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != '' && @request.body.user = @request.auth.id",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'date', type: 'date', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Agendada', 'Realizada', 'Cancelada'],
          maxSelect: 1,
        },
        { name: 'campaign', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_sessions_user ON sessions (user)',
        'CREATE INDEX idx_sessions_user_date ON sessions (user, date ASC)',
      ],
    })
    app.save(sessions)

    // 2. NPCs collection
    const npcs = new Collection({
      name: 'npcs',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != '' && @request.body.user = @request.auth.id",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'race', type: 'text' },
        { name: 'occupation', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'alignment', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Vivo', 'Desconhecido', 'Morto'],
          maxSelect: 1,
        },
        { name: 'appearance', type: 'text' },
        { name: 'hp', type: 'number' },
        { name: 'ac', type: 'number' },
        { name: 'cr', type: 'text' },
        // Atributos D&D/Fantasy
        { name: 'str', type: 'number' },
        { name: 'dex', type: 'number' },
        { name: 'con', type: 'number' },
        { name: 'int', type: 'number' },
        { name: 'wis', type: 'number' },
        { name: 'cha', type: 'number' },
        // Personalidade e Enredo (JSON)
        { name: 'personality', type: 'json' }, // { traits, ideals, bonds, flaws }
        { name: 'secrets', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'avatar', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_npcs_user ON npcs (user)',
        'CREATE INDEX idx_npcs_user_name ON npcs (user, name)',
      ],
    })
    app.save(npcs)

    // Semente para a conta demo 'amanda_fac1@yahoo.com.br' se ela já existir
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
    } catch (_) {
      // Ignora se não existir
    }

    if (userRecord) {
      const userId = userRecord.id

      // Seed de Sessões
      const session1 = new Record(sessions)
      session1.set('user', userId)
      session1.set('title', 'Sessão 12 — A Caça à Aranha Rainha e o Tomo Selado')
      session1.set('date', '2025-04-18 19:30:00.000Z')
      session1.set('status', 'Realizada')
      session1.set('campaign', 'As Crônicas de Val-Morath')
      session1.set('location', 'Taverna do Javali Dourado / Criptas')
      session1.set(
        'notes',
        'O grupo enfrentou a prole da aranha rainha no antigo moinho e recuperou o fragmento de obsidiana com inscrições rúnicas.',
      )
      app.save(session1)

      const session2 = new Record(sessions)
      session2.set('user', userId)
      session2.set('title', 'Sessão 13 — O Enigma das Portas de Val-Morath')
      session2.set('date', '2025-05-02 20:00:00.000Z')
      session2.set('status', 'Agendada')
      session2.set('campaign', 'As Crônicas de Val-Morath')
      session2.set('location', 'Umbral de Val-Morath')
      session2.set(
        'notes',
        'Desvendar as runas do portão selado e interrogar o espírito de Aldwin antes que o eclipse se complete.',
      )
      app.save(session2)

      const session3 = new Record(sessions)
      session3.set('user', userId)
      session3.set('title', 'Sessão 14 — O Confronto na Fortaleza da Cicatriz')
      session3.set('date', '2025-05-16 19:00:00.000Z')
      session3.set('status', 'Agendada')
      session3.set('campaign', 'As Crônicas de Val-Morath')
      session3.set('location', 'Fortaleza da Cicatriz')
      session3.set(
        'notes',
        'Infiltração no acampamento do Culto do Olho Vazio para reaver o Amuleto de Solaris.',
      )
      app.save(session3)

      // Seed de NPCs
      const npc1 = new Record(npcs)
      npc1.set('user', userId)
      npc1.set('name', 'Mestre Aldwin, o Barqueiro')
      npc1.set('race', 'Humano Ancião')
      npc1.set('occupation', 'Barqueiro das Águas Veladas & Historiador Arcano')
      npc1.set('location', 'Cais das Névoas, Margem de Val-Morath')
      npc1.set('alignment', 'Neutro Verdadeiro')
      npc1.set('status', 'Vivo')
      npc1.set(
        'appearance',
        'Alto e curvado, com barba prateada trançada até o peito, manto puído cinzento e olhos translúcidos como névoa da manhã.',
      )
      npc1.set('hp', 32)
      npc1.set('ac', 12)
      npc1.set('cr', 'ND 2')
      npc1.set('str', 10)
      npc1.set('dex', 12)
      npc1.set('con', 13)
      npc1.set('int', 16)
      npc1.set('wis', 18)
      npc1.set('cha', 11)
      npc1.set('personality', {
        traits: 'Fala por parábolas enigmáticas e escuta a correnteza do rio antes de responder.',
        ideals: 'A história do rio não deve ser silenciada pela guerra dos homens.',
        bonds: 'Guarda o segredo da chave da cripta submersa confiada por seu avô.',
        flaws: 'Recusa-se a cruzar o rio durante tempestades, temendo o Guardião das Profundezas.',
      })
      npc1.set(
        'secrets',
        'Aldwin sabe exatamente onde a espada ancestral do primeiro rei jaz no fundo do pântano.',
      )
      npc1.set(
        'notes',
        'Cobra 1 moeda de prata e uma história nunca contada para transportar aventureiros pelo pântano.',
      )
      npc1.set('avatar', '🧙‍♂️')
      app.save(npc1)

      const npc2 = new Record(npcs)
      npc2.set('user', userId)
      npc2.set('name', 'Serafina das Sete Cartas')
      npc2.set('race', 'Tiefling')
      npc2.set('occupation', 'Cartomante & Negociante de Artefatos Ocultos')
      npc2.set('location', 'Tenda da Rosa de Ferro, Vila da Pedra Alta')
      npc2.set('alignment', 'Caótico e Neutro')
      npc2.set('status', 'Vivo')
      npc2.set(
        'appearance',
        'Pele cor de cobre polido, chifres delgados envoltos em anéis dourados, olhos carmesim brilhantes e lenços escarlates bordados com constelações.',
      )
      npc2.set('hp', 24)
      npc2.set('ac', 13)
      npc2.set('cr', 'ND 3')
      npc2.set('str', 8)
      npc2.set('dex', 15)
      npc2.set('con', 12)
      npc2.set('int', 14)
      npc2.set('wis', 15)
      npc2.set('cha', 18)
      npc2.set('personality', {
        traits: 'Sempre manipula um baralho de tarô de marfim enquanto conversa.',
        ideals: 'O destino pode ser dobrado por aqueles corajosos o bastante para pagar o preço.',
        bonds: 'Procura o assassino de seu mentor arcano, um antigo clérigo do Olho Vazio.',
        flaws: 'Gananciosa por relíquias com inscrições pré-cataclismo, subestimando maldições.',
      })
      npc2.set(
        'secrets',
        'Sua sétima carta é um portal de bolso capaz de engolir feitiços uma vez por lua cheia.',
      )
      npc2.set(
        'notes',
        'Oferece previsões em troca de favores arcanos ou informações sobre a Fortaleza da Cicatriz.',
      )
      npc2.set('avatar', '🎴')
      app.save(npc2)

      const npc3 = new Record(npcs)
      npc3.set('user', userId)
      npc3.set('name', 'Capitão Vane Corvo-Negro')
      npc3.set('race', 'Humano')
      npc3.set('occupation', 'Comandante da Guarda do Vale')
      npc3.set('location', 'Quartel dos Vigias, Vila da Pedra Alta')
      npc3.set('alignment', 'Leal e Bom')
      npc3.set('status', 'Vivo')
      npc3.set(
        'appearance',
        'Cicatriz profunda cruzando a bochecha esquerda, armadura de placas prateada com insígnia de corvo e postura impecável de veterano.',
      )
      npc3.set('hp', 58)
      npc3.set('ac', 18)
      npc3.set('cr', 'ND 4')
      npc3.set('str', 16)
      npc3.set('dex', 12)
      npc3.set('con', 16)
      npc3.set('int', 11)
      npc3.set('wis', 13)
      npc3.set('cha', 14)
      npc3.set('personality', {
        traits: 'Direto e pragmático. Não tolera fanfarronices nem atrasos.',
        ideals: 'A ordem e a defesa dos camponeses são a única barreira contra a anarquia.',
        bonds:
          'Jurou defender a Vila da Pedra Alta até o último suspiro em homenagem à sua irmã falecida.',
        flaws: 'Desconfia excessivamente de usuários de magia arcana e estranhos encapuzados.',
      })
      npc3.set(
        'secrets',
        'Descobriu que um dos magistrados do conselho municipal financia contrabandistas.',
      )
      npc3.set(
        'notes',
        'Paga recompensas em moedas cunhadas por caçadas de monstros e contratos concluídos.',
      )
      npc3.set('avatar', '🛡️')
      app.save(npc3)
    }
  },
  (app) => {
    try {
      const npcs = app.findCollectionByNameOrId('npcs')
      app.delete(npcs)
    } catch (_) {}
    try {
      const sessions = app.findCollectionByNameOrId('sessions')
      app.delete(sessions)
    } catch (_) {}
  },
)

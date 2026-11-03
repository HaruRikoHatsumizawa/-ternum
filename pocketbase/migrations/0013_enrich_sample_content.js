migrate(
  (app) => {
    // 1. Enriquecer o Mural de Missões com mais contratos detalhados para todas as colunas
    try {
      const boards = app.findCollectionByNameOrId('boards')
      const rpgBoards = app.findRecordsByFilter(
        'boards',
        "target_mode = 'rpg' || name ~ 'Javali Dourado'",
        '+created',
        10,
        0,
      )

      rpgBoards.forEach((board) => {
        const currentCards = board.get('cards') || []
        const hasCard5 = currentCards.some((c) => c.id === 'c_rpg_5')
        if (!hasCard5) {
          const enrichedCards = [
            ...currentCards,
            {
              id: 'c_rpg_5',
              columnId: 'todo',
              title: 'Códice Perdido da Ordem Astrolábio',
              description:
                'O bibliotecário da capital busca o terceiro tomo de astronomia pré-cataclismo, avistado na Torre Inclinada.',
              priority: 'media',
              dueDate: '2025-05-25',
            },
            {
              id: 'c_rpg_6',
              columnId: 'in_progress',
              title: 'Proteger a Caravana de Ouro Rúnico',
              description:
                'Mercadores de Val-Morath atravessam o Desfiladeiro dos Dentes sob constante vigília de batedores orcs.',
              priority: 'alta',
              dueDate: '2025-04-28',
            },
            {
              id: 'c_rpg_7',
              columnId: 'done',
              title: 'Purificar a Fonte das Lágrimas de Prata',
              description:
                'As águas sagradas foram expurgadas da praga viscosa após a queima da raiz corrompida. Recompensa recebida de 120 PO.',
              priority: 'alta',
              dueDate: '2025-03-22',
            },
          ]
          board.set('cards', enrichedCards)
          app.save(board)
        }
      })
    } catch (_) {}

    // 2. Enriquecer o Códice de Monstros & Itens com relíquias de todas as raridades e monstros detalhados
    try {
      const databases = app.findCollectionByNameOrId('databases')
      const codexDbs = app.findRecordsByFilter(
        'databases',
        "target_mode = 'rpg' || name ~ 'Códice Arcano'",
        '+created',
        10,
        0,
      )

      codexDbs.forEach((db) => {
        const currentRows = db.get('rows') || []
        const hasRow6 = currentRows.some((r) => r.id === 'r_rpg_6')
        if (!hasRow6) {
          const enrichedRows = [
            ...currentRows,
            {
              id: 'r_rpg_6',
              col_name: 'Manto das Sombras Tecidas',
              col_type: 'Item Mágico',
              col_cr: 'Incomum (+1 Furtividade)',
              col_status: 'Em Posse do Grupo',
              col_loc: 'Inventário de Valerius',
            },
            {
              id: 'r_rpg_7',
              col_name: 'Adaga da Víbora Noturna',
              col_type: 'Item Mágico',
              col_cr: 'Muito Raro (+2, Dano Venenoso 2d6)',
              col_status: 'Em Posse do Grupo',
              col_loc: 'Coldre Oculto',
            },
            {
              id: 'r_rpg_8',
              col_name: 'Behemoth de Basalto Rúnico',
              col_type: 'Monstro Bestial',
              col_cr: 'ND 8 (3.900 XP)',
              col_status: 'Ativo / Vivo',
              col_loc: 'Cratera dos Gigantes Adormecidos',
            },
            {
              id: 'r_rpg_9',
              col_name: 'Poção de Fogo de Dragão Ancestral',
              col_type: 'Item Mágico',
              col_cr: 'Comum (Alquimia Consumível)',
              col_status: 'Em Posse do Grupo',
              col_loc: 'Bolsa Alquímica do Grupo',
            },
          ]
          db.set('rows', enrichedRows)
          app.save(db)
        }
      })
    } catch (_) {}

    // 3. Enriquecer o Códice de NPCs com mais aliados e monstros com stat blocks completos
    try {
      const npcs = app.findCollectionByNameOrId('npcs')
      let userRecord
      try {
        userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
      } catch (_) {}

      if (userRecord) {
        // Checar se já temos o Behemoth ou o Feiticeiro no códice de NPCs
        const existingBehemoth = app.findRecordsByFilter(
          'npcs',
          `user = '${userRecord.id}' && name ~ 'Ignis'`,
          '+created',
          1,
          0,
        )

        if (existingBehemoth.length === 0) {
          // NPC 1: Ignis Cinza-Brilhante, Mestre Alquimista
          const npc1 = new Record(npcs)
          npc1.set('user', userRecord.id)
          npc1.set('name', 'Ignis Cinza-Brilhante')
          npc1.set('race', 'Raposa Vermelha Alquimista')
          npc1.set('species', 'Raposa Antropomórfica')
          npc1.set('occupation', 'Artífice & Alquimista da Corte')
          npc1.set('location', 'Oficina dos Frascos de Bronze, Cidade Baixa')
          npc1.set('alignment', 'Caótico e Bom')
          npc1.set('status', 'Vivo')
          npc1.set('cr', 'ND 3')
          npc1.set('hp', 28)
          npc1.set('ac', 14)
          npc1.set('str', 9)
          npc1.set('dex', 16)
          npc1.set('con', 13)
          npc1.set('int', 18)
          npc1.set('wis', 14)
          npc1.set('cha', 12)
          npc1.set('avatar', '🦊')
          npc1.set(
            'appearance',
            'Pelagem ruiva lustrosa com ponta da cauda prateada, óculos de aumento com múltiplas lentes de cristal e avental de couro reforçado manchado de fósforo.',
          )
          npc1.set(
            'bio',
            'Dedicou quatro décadas à destilação de essências primordiais e à criação de elixires que aceleram o vigor dos guerreiros. Amigo íntimo de Valerius.',
          )
          npc1.set(
            'notes',
            'Fornece poções de cura e fogo grego com 15% de desconto mediante entrega de ervas raras colhidas nas montanhas.',
          )
          npc1.set(
            'relationships',
            'Irmão de ninhada de Valerius Lâmina Rubra; cliente frequente de Serafina.',
          )
          npc1.set(
            'secrets',
            'Esconde a fórmula proibida da Tintura da Fênix, capaz de ressuscitar uma criatura recém-falecida.',
          )
          npc1.set('target_mode', 'geral')
          npc1.set('personality', {
            traits:
              'Meticuloso ao extremo, cheira ingredientes antes de falar e fala rápido quando animado.',
            ideals: 'O conhecimento alquímico deve libertar os fracos e curar os incuráveis.',
            bonds: 'Proteger seu laboratório e os estudos deixados por seu pai.',
            flaws: 'Não resiste ao cheiro de ervas desconhecidas, mesmo que visivelmente tóxicas.',
          })
          app.save(npc1)

          // NPC 2: Urso Guardião Kaelen Pé-de-Trovoada
          const npc2 = new Record(npcs)
          npc2.set('user', userRecord.id)
          npc2.set('name', 'Kaelen Pé-de-Trovoada')
          npc2.set('race', 'Urso Pardo Bárbaro')
          npc2.set('species', 'Urso Antropomórfico')
          npc2.set('occupation', 'Protetor das Cordilheiras do Sul')
          npc2.set('location', 'Acampamento da Rocha Rachada')
          npc2.set('alignment', 'Neutro e Bom')
          npc2.set('status', 'Vivo')
          npc2.set('cr', 'ND 5')
          npc2.set('hp', 68)
          npc2.set('ac', 16)
          npc2.set('str', 19)
          npc2.set('dex', 11)
          npc2.set('con', 18)
          npc2.set('int', 10)
          npc2.set('wis', 15)
          npc2.set('cha', 10)
          npc2.set('avatar', '🐻')
          npc2.set(
            'appearance',
            'Massa muscular colossal com pelagem castanha escura espessa, cicatrizes de batalha nos ombros, manoplas de ferro batido e um medalhão de chifre ancestral.',
          )
          npc2.set(
            'bio',
            'Guardião solitário das passagens nevadas que dividem o vale civilizado das terras selvagens. Empunha um machado de guerra entalhado em madeira-férrea.',
          )
          npc2.set(
            'notes',
            'Respeita força física e honra sincera; jamais recusa hospitalidade em torno de sua fogueira a quem demonstrar respeito pelas matas.',
          )
          npc2.set(
            'relationships',
            'Aliado de longa data do Capitão Vane Corvo-Negro; já lutou lado a lado com Mestre Aldwin.',
          )
          npc2.set(
            'secrets',
            'Sobreviveu à fúria de um dragão branco na juventude e guarda uma escama congelada que pulsa com geada eterna.',
          )
          npc2.set('target_mode', 'rpg')
          npc2.set('personality', {
            traits:
              'Voz cavernosa e calma, gargalhada estrondosa, bebe hidromel em canecos de chifre de touro.',
            ideals:
              'A terra pertence a todos que a respeitam, e quem a profana enfrentará meu machado.',
            bonds: 'O pacto solene feito com os espíritos das cavernas de gelo.',
            flaws:
              'Teimoso como uma montanha de granito; mudar sua opinião requer evidências inegáveis.',
          })
          app.save(npc2)
        }
      }
    } catch (_) {}

    // 4. Enriquecer as Sessões do Calendário
    try {
      const sessions = app.findCollectionByNameOrId('sessions')
      let userRecord
      try {
        userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
      } catch (_) {}

      if (userRecord) {
        const existingSess15 = app.findRecordsByFilter(
          'sessions',
          `user = '${userRecord.id}' && title ~ 'Sessão 15'`,
          '+created',
          1,
          0,
        )

        if (existingSess15.length === 0) {
          const sess15 = new Record(sessions)
          sess15.set('user', userRecord.id)
          sess15.set('campaign', 'As Crônicas de Val-Morath')
          sess15.set('title', 'Sessão 15 — O Ritual sob o Eclipse Vermelho')
          sess15.set('date', '2025-05-30 20:00:00.000Z')
          sess15.set('location', 'Círculo das Sete Luas, Pináculo de Cristal')
          sess15.set('status', 'Agendada')
          sess15.set('target_mode', 'rpg')
          sess15.set(
            'notes',
            'Interromper a conjuração do Culto do Olho Vazio antes que o eclipse atinja o alinhamento total. Encontro com reforços de Kaelen Pé-de-Trovoada.',
          )
          app.save(sess15)
        }
      }
    } catch (_) {}
  },
  (app) => {
    // rollback
  },
)

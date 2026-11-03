migrate(
  (app) => {
    // 1. Atualizar itens existentes com classificação representativa para RPG, RP e Geral (Ambos)

    // Páginas (Fichas e Crônicas)
    try {
      // RPG Tático (Fichas de combate / masmorras)
      app
        .db()
        .newQuery(`
        UPDATE pages SET target_mode = 'rpg'
        WHERE LOWER(title) LIKE '%espadachim%' 
           OR LOWER(title) LIKE '%arcanista%'
           OR LOWER(title) LIKE '%nv.%'
           OR LOWER(title) LIKE '%ficha%'
      `)
        .execute()

      // RP Narrativo (Crônicas de cenas / diálogos / sessões narrativas)
      app
        .db()
        .newQuery(`
        UPDATE pages SET target_mode = 'rp'
        WHERE LOWER(title) LIKE '%crônica%'
           OR LOWER(title) LIKE '%resgate%'
           OR LOWER(title) LIKE '%cena%'
           OR LOWER(title) LIKE '%diário%'
      `)
        .execute()

      // Ambos / Geral (Espaço de trabalho, metas e guias)
      app
        .db()
        .newQuery(`
        UPDATE pages SET target_mode = 'geral'
        WHERE LOWER(title) LIKE '%espaço de trabalho%'
           OR LOWER(title) LIKE '%projetos%'
           OR LOWER(title) LIKE '%metas%'
      `)
        .execute()
    } catch (err) {
      console.log('Erro ao atualizar páginas em 0009:', err)
    }

    // Murais (Boards)
    try {
      // RPG: Missões e caçadas
      app
        .db()
        .newQuery(`
        UPDATE boards SET target_mode = 'rpg'
        WHERE LOWER(name) LIKE '%missões%' OR LOWER(name) LIKE '%taverna%' OR LOWER(name) LIKE '%contrato%'
      `)
        .execute()

      // RP: Tramas de corte e capítulos
      app
        .db()
        .newQuery(`
        UPDATE boards SET target_mode = 'rp'
        WHERE LOWER(name) LIKE '%trama%' OR LOWER(name) LIKE '%capítulo%' OR LOWER(name) LIKE '%corte%'
      `)
        .execute()

      // Geral: Tarefas e projetos gerais
      app
        .db()
        .newQuery(`
        UPDATE boards SET target_mode = 'geral'
        WHERE LOWER(name) LIKE '%tarefas%' OR LOWER(name) LIKE '%projeto%' OR LOWER(name) LIKE '%principal%'
      `)
        .execute()

      // Se não houver board de RP, criar um de exemplo representativo
      const rpBoards = app.findRecordsByFilter('boards', "target_mode = 'rp'", '-created', 1, 0)
      if (rpBoards.length === 0) {
        const users = app.findRecordsByFilter('users', '', '-created', 1, 0)
        if (users.length > 0) {
          const bCol = app.findCollectionByNameOrId('boards')
          const newRpBoard = new Record(bCol)
          newRpBoard.set('user', users[0].id)
          newRpBoard.set('name', 'Tramas da Corte & Arcos dos Personagens')
          newRpBoard.set(
            'description',
            'Acompanhamento de intrigas, alianças aristocráticas e desfechos de cena',
          )
          newRpBoard.set('icon', 'scroll')
          newRpBoard.set('target_mode', 'rp')
          newRpBoard.set(
            'columns',
            JSON.stringify([
              {
                id: 'todo',
                title: 'Tramas em Aberto',
                color: 'border-purple-500/40 text-purple-300 bg-purple-950/30',
              },
              {
                id: 'in_progress',
                title: 'Cenas em Desenvolvimento',
                color: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
              },
              {
                id: 'done',
                title: 'Desfechos Estabelecidos',
                color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
              },
            ]),
          )
          newRpBoard.set(
            'cards',
            JSON.stringify([
              {
                id: 'c_rp_1',
                columnId: 'in_progress',
                title: 'A Negociação do Tratado com o Clã das Brumas',
                description:
                  'O Mestre Aldwin atua como mediador entre a nobreza e os espíritos do pântano.',
                priority: 'alta',
                dueDate: '2025-05-10',
              },
              {
                id: 'c_rp_2',
                columnId: 'todo',
                title: 'O Segredo da Rosa de Ferro',
                description: 'Descobrir por que Serafina guarda a sétima carta com tanta cautela.',
                priority: 'media',
                dueDate: '2025-05-20',
              },
            ]),
          )
          app.save(newRpBoard)
        }
      }
    } catch (err) {
      console.log('Erro ao atualizar boards em 0009:', err)
    }

    // Códices (Databases)
    try {
      // RPG: Bestiário e monstros
      app
        .db()
        .newQuery(`
        UPDATE databases SET target_mode = 'rpg'
        WHERE LOWER(name) LIKE '%monstros%' OR LOWER(name) LIKE '%bestiário%' OR LOWER(name) LIKE '%loot%'
      `)
        .execute()

      // RP: Relacionamentos e registros narrativos
      app
        .db()
        .newQuery(`
        UPDATE databases SET target_mode = 'rp'
        WHERE LOWER(name) LIKE '%nobres%' OR LOWER(name) LIKE '%crônicas%' OR LOWER(name) LIKE '%corte%'
      `)
        .execute()

      // Geral: Leituras e arquivos gerais
      app
        .db()
        .newQuery(`
        UPDATE databases SET target_mode = 'geral'
        WHERE LOWER(name) LIKE '%livros%' OR LOWER(name) LIKE '%leituras%'
      `)
        .execute()

      // Se não houver database de RP, criar um de exemplo representativo
      const rpDbs = app.findRecordsByFilter('databases', "target_mode = 'rp'", '-created', 1, 0)
      if (rpDbs.length === 0) {
        const users = app.findRecordsByFilter('users', '', '-created', 1, 0)
        if (users.length > 0) {
          const dbCol = app.findCollectionByNameOrId('databases')
          const newRpDb = new Record(dbCol)
          newRpDb.set('user', users[0].id)
          newRpDb.set('name', 'Registro Social & Vínculos da Nobreza')
          newRpDb.set(
            'description',
            'Linhagens, alianças de clãs e afeições entre personagens da corte',
          )
          newRpDb.set('icon', 'tome')
          newRpDb.set('target_mode', 'rp')
          newRpDb.set(
            'columns',
            JSON.stringify([
              { id: 'col_name', name: 'Nobre / Figura', type: 'text' },
              { id: 'col_species', name: 'Espécie Antropomórfica', type: 'text' },
              {
                id: 'col_faction',
                name: 'Clã ou Casa',
                type: 'select',
                values: [
                  'Casa da Garra Prateada',
                  'Ordem dos Rios Velados',
                  'Rosa de Ferro',
                  'Independentes',
                ],
              },
              {
                id: 'col_status',
                name: 'Vínculo com o Grupo',
                type: 'select',
                values: ['Aliado de Confiança', 'Trégua Tensa', 'Rival Cortês', 'Inimigo Oculto'],
              },
              { id: 'col_notes', name: 'Anotações de Interpretação', type: 'text' },
            ]),
          )
          newRpDb.set(
            'rows',
            JSON.stringify([
              {
                id: 'row_rp_1',
                col_name: 'Duquesa Vaelen Garras-de-Prata',
                col_species: 'Loba-do-Ártico Antropomórfica',
                col_faction: 'Casa da Garra Prateada',
                col_status: 'Aliado de Confiança',
                col_notes: 'Senhora do Palácio de Gelo; preza juramentos e lealdade acima do ouro.',
              },
              {
                id: 'row_rp_2',
                col_name: 'Visconde Cassian Olhos-de-Âmbar',
                col_species: 'Raposa Astuta Antropomórfica',
                col_faction: 'Rosa de Ferro',
                col_status: 'Rival Cortês',
                col_notes: 'Mestre da diplomacia; fala em charadas e coleciona favores.',
              },
            ]),
          )
          app.save(newRpDb)
        }
      }
    } catch (err) {
      console.log('Erro ao atualizar databases em 0009:', err)
    }

    // Personagens (NPCs)
    try {
      // Capitão Vane Corvo-Negro -> RPG (Líder militar, estatísticas marciais)
      app
        .db()
        .newQuery(`
        UPDATE npcs SET target_mode = 'rpg'
        WHERE LOWER(name) LIKE '%vane%' OR LOWER(name) LIKE '%capitão%'
      `)
        .execute()

      // Serafina das Sete Cartas -> RP (Cartomante, intriga social)
      app
        .db()
        .newQuery(`
        UPDATE npcs SET target_mode = 'rp'
        WHERE LOWER(name) LIKE '%serafina%'
      `)
        .execute()

      // Mestre Aldwin -> Geral (Ambos: guia tanto missões de combate quanto mistérios narrativos)
      app
        .db()
        .newQuery(`
        UPDATE npcs SET target_mode = 'geral'
        WHERE LOWER(name) LIKE '%aldwin%'
      `)
        .execute()
    } catch (err) {
      console.log('Erro ao atualizar npcs em 0009:', err)
    }

    // Sessões e Cenas
    try {
      // Sessão de combate de masmorra -> RPG
      app
        .db()
        .newQuery(`
        UPDATE sessions SET target_mode = 'rpg'
        WHERE LOWER(title) LIKE '%caça%' OR LOWER(title) LIKE '%aranha%' OR LOWER(title) LIKE '%confronto%'
      `)
        .execute()

      // Sessão de mistério e enigma narrativo -> RP
      app
        .db()
        .newQuery(`
        UPDATE sessions SET target_mode = 'rp'
        WHERE LOWER(title) LIKE '%enigma%' OR LOWER(title) LIKE '%portas%' OR LOWER(title) LIKE '%corte%'
      `)
        .execute()
    } catch (err) {
      console.log('Erro ao atualizar sessions em 0009:', err)
    }
  },
  (app) => {
    // Reversão
  },
)

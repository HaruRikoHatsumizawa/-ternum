migrate(
  (app) => {
    // 1. Adicionar campo target_mode (select: geral, rpg, rp) nas coleções
    const collectionsToUpdate = ['pages', 'boards', 'databases', 'sessions', 'npcs']

    for (const colName of collectionsToUpdate) {
      try {
        const col = app.findCollectionByNameOrId(colName)
        if (!col.fields.getByName('target_mode')) {
          col.fields.add(
            new SelectField({
              name: 'target_mode',
              values: ['geral', 'rpg', 'rp'],
              maxSelect: 1,
            }),
          )
          app.save(col)
        }
      } catch (err) {
        console.log(`Erro ao adicionar target_mode na coleção ${colName}:`, err)
      }
    }

    // 2. Backfill inicial idempotente:
    // Itens sem target_mode definido: default 'geral'
    for (const colName of collectionsToUpdate) {
      try {
        app
          .db()
          .newQuery(
            `UPDATE ${colName} SET target_mode = 'geral' WHERE target_mode IS NULL OR target_mode = ''`,
          )
          .execute()
      } catch (err) {
        console.log(`Backfill default geral em ${colName}:`, err)
      }
    }

    // Marcações temáticas coerentes para conteúdos de exemplo existentes:
    // - boards: Murais de missões de combate/loot -> rpg; tramas/capítulos/narrativa -> rp
    try {
      app
        .db()
        .newQuery(`
        UPDATE boards SET target_mode = 'rpg'
        WHERE LOWER(name) LIKE '%missões%' OR LOWER(name) LIKE '%quest%' OR LOWER(name) LIKE '%contrato%'
      `)
        .execute()
      app
        .db()
        .newQuery(`
        UPDATE boards SET target_mode = 'rp'
        WHERE LOWER(name) LIKE '%trama%' OR LOWER(name) LIKE '%capítulo%' OR LOWER(name) LIKE '%diálogo%'
      `)
        .execute()
    } catch (_) {}

    // - databases: Bestiários/monstros/loot -> rpg; registros sociais/cortes/relações -> rp
    try {
      app
        .db()
        .newQuery(`
        UPDATE databases SET target_mode = 'rpg'
        WHERE LOWER(name) LIKE '%bestiário%' OR LOWER(name) LIKE '%tesouro%' OR LOWER(name) LIKE '%loot%' OR LOWER(name) LIKE '%item%'
      `)
        .execute()
      app
        .db()
        .newQuery(`
        UPDATE databases SET target_mode = 'rp'
        WHERE LOWER(name) LIKE '%corte%' OR LOWER(name) LIKE '%nobreza%' OR LOWER(name) LIKE '%diário%'
      `)
        .execute()
    } catch (_) {}

    // - pages: Cenas narrativas / diários de cena -> rp; fichas táticas -> rpg; páginas gerais -> geral
    try {
      app
        .db()
        .newQuery(`
        UPDATE pages SET target_mode = 'rp'
        WHERE LOWER(title) LIKE '%cena%' OR LOWER(title) LIKE '%narrativa%' OR LOWER(title) LIKE '%diário%' OR LOWER(title) LIKE '%corte%'
      `)
        .execute()
      app
        .db()
        .newQuery(`
        UPDATE pages SET target_mode = 'rpg'
        WHERE LOWER(title) LIKE '%combate%' OR LOWER(title) LIKE '%masmorra%' OR LOWER(title) LIKE '%dungeon%'
      `)
        .execute()
    } catch (_) {}
  },
  (app) => {
    const collectionsToUpdate = ['pages', 'boards', 'databases', 'sessions', 'npcs']
    for (const colName of collectionsToUpdate) {
      try {
        const col = app.findCollectionByNameOrId(colName)
        const field = col.fields.getByName('target_mode')
        if (field) {
          col.fields.removeByName('target_mode')
          app.save(col)
        }
      } catch (_) {}
    }
  },
)

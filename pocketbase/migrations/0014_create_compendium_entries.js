migrate(
  (app) => {
    // Coleção compendium_entries: verbetes personalizados do usuário
    // de raças e poderes de universos conhecidos (D&D, Bleach, Dragon Ball, Animes, Jogos).
    // Verbetes de semente bilíngues vivem no frontend em i18n, enquanto customizações
    // e novos registros do usuário ficam gravados nesta coleção.
    const compendium = new Collection({
      name: 'compendium_entries',
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
        {
          name: 'universe',
          type: 'select',
          required: true,
          values: ['dnd', 'bleach', 'dragonball', 'anime', 'games', 'outro'],
          maxSelect: 1,
        },
        {
          name: 'entry_type',
          type: 'select',
          required: true,
          values: ['race', 'power'],
          maxSelect: 1,
        },
        { name: 'short_description', type: 'text', required: true },
        { name: 'traits', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_compendium_user ON compendium_entries (user)',
        'CREATE INDEX idx_compendium_user_universe ON compendium_entries (user, universe)',
        'CREATE INDEX idx_compendium_user_type ON compendium_entries (user, entry_type)',
      ],
    })
    app.save(compendium)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('compendium_entries')
      app.delete(col)
    } catch (_) {}
  },
)

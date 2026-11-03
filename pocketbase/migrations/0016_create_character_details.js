migrate(
  (app) => {
    // Coleção character_details: Dossiê completo da subpágina individual de cada personagem
    // com campos detalhados: idade, nome, sexualidade, raça/espécie, história, foto/pfp,
    // poderes (lista nome + descrição), habilidades (lista nome + descrição), vínculos,
    // resumos gerados por IA (RP e RPG) e ficha personalizada ornada gerada por IA.
    const details = new Collection({
      name: 'character_details',
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
        {
          name: 'character_id',
          type: 'text',
          required: true,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'age', type: 'text' },
        { name: 'sexuality', type: 'text' },
        { name: 'pronouns', type: 'text' },
        { name: 'race', type: 'text' },
        { name: 'species', type: 'text' },
        { name: 'backstory', type: 'text' },
        {
          name: 'photo',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        },
        { name: 'powers', type: 'json' }, // Array de { id, name, description, power_type? }
        { name: 'abilities', type: 'json' }, // Array de { id, name, description, category? }
        { name: 'bonds', type: 'text' },
        { name: 'rp_summary', type: 'text' },
        { name: 'rpg_summary', type: 'text' },
        { name: 'ai_custom_sheet', type: 'json' }, // { format: 'rp'|'rpg', title, content, generated_at, runic_theme }
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_char_details_user ON character_details (user)',
        'CREATE UNIQUE INDEX idx_char_details_user_char ON character_details (user, character_id)',
      ],
    })
    app.save(details)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('character_details')
      app.delete(col)
    } catch (_) {}
  },
)

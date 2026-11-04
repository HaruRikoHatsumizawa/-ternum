/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Coleção campaign_events para a Linha do Tempo / Crônicas
    const eventsCol = new Collection({
      name: 'campaign_events',
      type: 'base',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: 'user = @request.auth.id',
      updateRule: 'user = @request.auth.id',
      deleteRule: 'user = @request.auth.id',
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
        { name: 'campaign', type: 'text', required: true },
        { name: 'date', type: 'text', required: true }, // Data no formato YYYY-MM-DD ou data da era
        { name: 'description', type: 'text' },
        {
          name: 'category',
          type: 'select',
          values: ['batalha', 'politica', 'descoberta', 'sessao', 'morte', 'aliados', 'marco'],
          maxSelect: 1,
        },
        { name: 'session_id', type: 'text' }, // Vínculo opcional à sessão que gerou o evento
        {
          name: 'target_mode',
          type: 'select',
          values: ['geral', 'rpg', 'rp'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_events_user ON campaign_events (user)',
        'CREATE INDEX idx_events_campaign ON campaign_events (campaign)',
      ],
    })
    app.save(eventsCol)

    // 2. Adicionar campo bonds_data à coleção character_details (caso não exista)
    try {
      const detailsCol = app.findCollectionByNameOrId('character_details')
      if (!detailsCol.fields.getByName('bonds_data')) {
        detailsCol.fields.add(
          new JSONField({
            name: 'bonds_data',
          }),
        )
        app.save(detailsCol)
      }
    } catch (_) {}
  },
  (app) => {
    try {
      const eventsCol = app.findCollectionByNameOrId('campaign_events')
      app.delete(eventsCol)
    } catch (_) {}
  },
)

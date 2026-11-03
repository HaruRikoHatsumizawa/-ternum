migrate(
  (app) => {
    // Coleção glossary_terms: termos próprios do usuário do Glossário Arcano.
    // Termos de semente (clássicos) vivem nos locales, não no banco.
    const glossary = new Collection({
      name: 'glossary_terms',
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
        { name: 'term', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['combate', 'personagem', 'regras', 'dados', 'mesa'],
          maxSelect: 1,
        },
        { name: 'definition', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_glossary_user ON glossary_terms (user)',
        'CREATE UNIQUE INDEX idx_glossary_user_term ON glossary_terms (user, term)',
      ],
    })
    app.save(glossary)
  },
  (app) => {
    try {
      const glossary = app.findCollectionByNameOrId('glossary_terms')
      app.delete(glossary)
    } catch (_) {}
  },
)

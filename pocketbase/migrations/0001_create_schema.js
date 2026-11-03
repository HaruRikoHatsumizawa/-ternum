migrate(
  (app) => {
    // 1. Pages collection
    const pages = new Collection({
      name: 'pages',
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
        { name: 'icon', type: 'text' },
        { name: 'cover', type: 'text' },
        { name: 'blocks', type: 'json' },
        { name: 'is_favorite', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pages_user ON pages (user)',
        'CREATE INDEX idx_pages_user_updated ON pages (user, updated DESC)',
      ],
    })
    app.save(pages)

    // 2. Boards collection
    const boards = new Collection({
      name: 'boards',
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
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'columns', type: 'json' },
        { name: 'cards', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_boards_user ON boards (user)',
        'CREATE INDEX idx_boards_user_updated ON boards (user, updated DESC)',
      ],
    })
    app.save(boards)

    // 3. Databases collection
    const databases = new Collection({
      name: 'databases',
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
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'columns', type: 'json' },
        { name: 'rows', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_databases_user ON databases (user)',
        'CREATE INDEX idx_databases_user_updated ON databases (user, updated DESC)',
      ],
    })
    app.save(databases)
  },
  (app) => {
    try {
      const databases = app.findCollectionByNameOrId('databases')
      app.delete(databases)
    } catch (_) {}
    try {
      const boards = app.findCollectionByNameOrId('boards')
      app.delete(boards)
    } catch (_) {}
    try {
      const pages = app.findCollectionByNameOrId('pages')
      app.delete(pages)
    } catch (_) {}
  },
)

migrate(
  (app) => {
    // Coleção inventory_items: itens de inventário associados a personagens/fichas de RPG.
    // Pode vincular à ficha via page_id ou npc_id (ou texto livre de personagem),
    // com categoria, quantidade, equipado, valor em PO, raridade e peso.
    const inventory = new Collection({
      name: 'inventory_items',
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
        { name: 'character_id', type: 'text', required: true },
        { name: 'character_name', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['weapon', 'armor', 'consumable', 'treasure', 'adventure'],
          maxSelect: 1,
        },
        { name: 'is_equipped', type: 'bool' },
        { name: 'value_gold', type: 'number' },
        {
          name: 'rarity',
          type: 'select',
          values: ['Comum', 'Incomum', 'Raro', 'Muito Raro', 'Lendário', 'Artefato'],
          maxSelect: 1,
        },
        { name: 'weight', type: 'number' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_inventory_user ON inventory_items (user)',
        'CREATE INDEX idx_inventory_user_char ON inventory_items (user, character_id)',
      ],
    })
    app.save(inventory)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('inventory_items')
      app.delete(col)
    } catch (_) {}
  },
)

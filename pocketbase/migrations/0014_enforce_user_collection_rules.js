/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collectionsToEnforce = [
    'pages',
    'boards',
    'databases',
    'npcs',
    'sessions',
    'encounters',
    'inventory_items',
    'character_details',
    'glossary_terms',
    'compendium_entries',
  ]

  const rule = 'user = @request.auth.id'

  for (const name of collectionsToEnforce) {
    try {
      const col = app.findCollectionByNameOrId(name)
      if (col) {
        col.listRule = rule
        col.viewRule = rule
        col.createRule = rule
        col.updateRule = rule
        col.deleteRule = rule
        app.save(col)
      }
    } catch (e) {
      // Coleção não encontrada ou já no estado desejado
    }
  }
})

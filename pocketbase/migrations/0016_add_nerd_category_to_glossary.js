migrate(
  (app) => {
    // Adiciona a nova categoria 'nerd' à coleção glossary_terms para o Dicionário Nerd
    const col = app.findCollectionByNameOrId('glossary_terms')
    const categoryField = col.fields.getByName('category')
    if (categoryField) {
      categoryField.values = ['combate', 'personagem', 'regras', 'dados', 'mesa', 'nerd']
      app.save(col)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('glossary_terms')
      const categoryField = col.fields.getByName('category')
      if (categoryField) {
        categoryField.values = ['combate', 'personagem', 'regras', 'dados', 'mesa']
        app.save(col)
      }
    } catch (_) {}
  },
)

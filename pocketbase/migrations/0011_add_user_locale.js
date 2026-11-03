migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('locale')) {
      usersCol.fields.add(
        new SelectField({
          name: 'locale',
          values: ['pt-BR', 'en'],
          maxSelect: 1,
        }),
      )
    }
    app.save(usersCol)

    // Set default value for existing demo user if present
    try {
      const demoUser = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
      if (!demoUser.getString('locale')) {
        demoUser.set('locale', 'pt-BR')
      }
      app.save(demoUser)
    } catch (_) {}
  },
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const localeField = usersCol.fields.getByName('locale')
    if (localeField) {
      usersCol.fields.removeByName('locale')
    }
    app.save(usersCol)
  },
)

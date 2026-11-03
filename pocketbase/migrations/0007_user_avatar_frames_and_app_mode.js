migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('pfp_frame')) {
      usersCol.fields.add(new TextField({ name: 'pfp_frame' }))
    }
    if (!usersCol.fields.getByName('app_mode')) {
      usersCol.fields.add(new TextField({ name: 'app_mode' }))
    }
    app.save(usersCol)

    // Set default values for existing demo user if present
    try {
      const demoUser = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
      if (!demoUser.getString('pfp_frame')) {
        demoUser.set('pfp_frame', 'runic-gold')
      }
      if (!demoUser.getString('app_mode')) {
        demoUser.set('app_mode', 'rpg')
      }
      app.save(demoUser)
    } catch (_) {}
  },
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const frameField = usersCol.fields.getByName('pfp_frame')
    if (frameField) {
      usersCol.fields.removeByName('pfp_frame')
    }
    const modeField = usersCol.fields.getByName('app_mode')
    if (modeField) {
      usersCol.fields.removeByName('app_mode')
    }
    app.save(usersCol)
  },
)

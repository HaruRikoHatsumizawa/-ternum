migrate(
  (app) => {
    // 1. Criar coleção encounters (Combate Tático)
    const encounters = new Collection({
      name: 'encounters',
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
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Preparando', 'Em Andamento', 'Finalizado'],
          maxSelect: 1,
        },
        { name: 'round', type: 'number' },
        { name: 'current_turn_index', type: 'number' },
        { name: 'combatants', type: 'json' },
        {
          name: 'target_mode',
          type: 'select',
          required: false,
          values: ['geral', 'rpg', 'rp'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_encounters_user ON encounters (user)',
        'CREATE INDEX idx_encounters_user_updated ON encounters (user, updated DESC)',
      ],
    })
    app.save(encounters)

    // 2. Semear um combate demonstrativo se o usuário padrão existir
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
    } catch (_) {}

    if (userRecord) {
      const demoCombat = new Record(encounters)
      demoCombat.set('user', userRecord.id)
      demoCombat.set('name', 'Emboscada nas Criptas de Val-Morath')
      demoCombat.set(
        'description',
        'Confronto tático contra Lorde Malakor e os carniçais arcanos nos degraus de obsidiana.',
      )
      demoCombat.set('status', 'Em Andamento')
      demoCombat.set('round', 1)
      demoCombat.set('current_turn_index', 0)
      demoCombat.set('target_mode', 'rpg')
      demoCombat.set('combatants', [
        {
          id: 'cbt_valerius',
          name: 'Valerius Lâmina Rubra',
          type: 'hero',
          source: 'ficha',
          initiative: 19,
          hpCurrent: 44,
          hpMax: 48,
          tempHp: 0,
          ac: 18,
          conditions: ['abençoado'],
          notes: 'Espada longa de prata rúnica +1 pronta.',
        },
        {
          id: 'cbt_malakor',
          name: 'Lorde Malakor, o Espectro',
          type: 'monster',
          source: 'codice',
          initiative: 16,
          hpCurrent: 52,
          hpMax: 65,
          tempHp: 0,
          ac: 15,
          conditions: [],
          notes: 'Flutuando sobre as lápides; resistência a corte comum.',
        },
        {
          id: 'cbt_lyra',
          name: 'Lyra Sombra-Estelar',
          type: 'hero',
          source: 'ficha',
          initiative: 14,
          hpCurrent: 26,
          hpMax: 26,
          tempHp: 0,
          ac: 14,
          conditions: [],
          notes: 'Preparando Escudo Arcano de reação.',
        },
        {
          id: 'cbt_ghoul',
          name: 'Carniçal das Criptas',
          type: 'monster',
          source: 'avulso',
          initiative: 9,
          hpCurrent: 0,
          hpMax: 22,
          tempHp: 0,
          ac: 12,
          conditions: ['caído'],
          notes: 'Derrubado no primeiro impacto por Valerius.',
        },
      ])
      app.save(demoCombat)
    }
  },
  (app) => {
    try {
      const encounters = app.findCollectionByNameOrId('encounters')
      app.delete(encounters)
    } catch (_) {}
  },
)

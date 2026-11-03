migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let userRecord

    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
    } catch (_) {
      userRecord = new Record(users)
      userRecord.setEmail('amanda_fac1@yahoo.com.br')
      userRecord.setPassword('Skip@Pass')
      userRecord.setVerified(true)
      userRecord.set('name', 'Amanda')
      app.save(userRecord)
    }

    const userId = userRecord.id

    // 1. Seed demo page
    const pages = app.findCollectionByNameOrId('pages')
    const existingPages = app.findRecordsByFilter('pages', "user = '" + userId + "'", '', 1, 0)
    if (existingPages.length === 0) {
      const demoPage = new Record(pages)
      demoPage.set('user', userId)
      demoPage.set('title', 'Bem-vindo ao seu Espaço de Trabalho')
      demoPage.set('icon', '📝')
      demoPage.set('is_favorite', true)
      demoPage.set('blocks', [
        { id: 'b1', type: 'heading_1', content: 'Bem-vindo ao Notion Aprimorado!' },
        {
          id: 'b2',
          type: 'text',
          content:
            'Este aplicativo foi desenhado para ser mais simples, direto e rápido. Aqui você organiza suas ideias, tarefas e tabelas sem complicações.',
        },
        { id: 'b3', type: 'heading_2', content: 'Primeiros passos' },
        { id: 'b4', type: 'todo', content: 'Crie sua primeira página de anotações', checked: true },
        {
          id: 'b5',
          type: 'todo',
          content: 'Organize tarefas arrastando cartões no Quadro Kanban',
          checked: false,
        },
        {
          id: 'b6',
          type: 'todo',
          content: 'Monte uma tabela com colunas personalizadas no Banco de Dados',
          checked: false,
        },
        { id: 'b7', type: 'bullet', content: 'Blocos de texto simples e fáceis de editar' },
        { id: 'b8', type: 'bullet', content: 'Reordenação de blocos com botões rápidos' },
        { id: 'b9', type: 'bullet', content: 'Busca global instantânea no topo' },
      ])
      app.save(demoPage)

      const demoPage2 = new Record(pages)
      demoPage2.set('user', userId)
      demoPage2.set('title', 'Ideias de Projetos & Metas 2025')
      demoPage2.set('icon', '💡')
      demoPage2.set('is_favorite', false)
      demoPage2.set('blocks', [
        { id: 'p1', type: 'heading_1', content: 'Planejamento Estratégico' },
        {
          id: 'p2',
          type: 'text',
          content: 'Anote insights rápidos e objetivos chave do trimestre.',
        },
        { id: 'p3', type: 'heading_2', content: 'Metas Principais' },
        { id: 'p4', type: 'todo', content: 'Lançar novo site institucional', checked: true },
        { id: 'p5', type: 'todo', content: 'Implementar automação de e-mails', checked: false },
        { id: 'p6', type: 'todo', content: 'Revisar metas financeiras com o time', checked: false },
      ])
      app.save(demoPage2)
    }

    // 2. Seed demo board
    const boards = app.findCollectionByNameOrId('boards')
    const existingBoards = app.findRecordsByFilter('boards', "user = '" + userId + "'", '', 1, 0)
    if (existingBoards.length === 0) {
      const demoBoard = new Record(boards)
      demoBoard.set('user', userId)
      demoBoard.set('name', 'Quadro de Tarefas Principal')
      demoBoard.set('description', 'Fluxo semanal de entregas e prioridades')
      demoBoard.set('icon', '📌')
      demoBoard.set('columns', [
        { id: 'todo', title: 'A fazer', color: 'bg-slate-100 text-slate-700' },
        { id: 'in_progress', title: 'Fazendo', color: 'bg-blue-50 text-blue-700' },
        { id: 'done', title: 'Feito', color: 'bg-emerald-50 text-emerald-700' },
      ])
      demoBoard.set('cards', [
        {
          id: 'c1',
          columnId: 'todo',
          title: 'Pesquisar referências de design minimalista',
          description: 'Buscar padrões de UI e tipografia moderna',
          priority: 'alta',
          dueDate: '2025-04-10',
        },
        {
          id: 'c2',
          columnId: 'todo',
          title: 'Estruturar tabela de despesas mensais',
          description: 'Criar colunas de categoria, valor e data de vencimento',
          priority: 'media',
          dueDate: '2025-04-12',
        },
        {
          id: 'c3',
          columnId: 'in_progress',
          title: 'Testar editor em blocos e reordenação',
          description: 'Garantir que a adição de títulos e tarefas seja suave',
          priority: 'alta',
          dueDate: '2025-04-05',
        },
        {
          id: 'c4',
          columnId: 'done',
          title: 'Configurar ambiente do Notion Aprimorado',
          description: 'Configuração inicial de login, rotas e banco de dados',
          priority: 'baixa',
          dueDate: '2025-04-01',
        },
      ])
      app.save(demoBoard)
    }

    // 3. Seed demo database
    const databases = app.findCollectionByNameOrId('databases')
    const existingDatabases = app.findRecordsByFilter(
      'databases',
      "user = '" + userId + "'",
      '',
      1,
      0,
    )
    if (existingDatabases.length === 0) {
      const demoDb = new Record(databases)
      demoDb.set('user', userId)
      demoDb.set('name', 'Controle de Livros & Leituras')
      demoDb.set('description', 'Acompanhe seus livros em andamento e notas de avaliação')
      demoDb.set('icon', '📚')
      demoDb.set('columns', [
        { id: 'col_title', name: 'Título', type: 'text' },
        { id: 'col_author', name: 'Autor', type: 'text' },
        {
          id: 'col_status',
          name: 'Status',
          type: 'select',
          values: ['Lendo', 'Concluído', 'Pausado', 'Desejo'],
        },
        { id: 'col_rating', name: 'Nota (1-5)', type: 'number' },
        { id: 'col_category', name: 'Categoria', type: 'text' },
      ])
      demoDb.set('rows', [
        {
          id: 'r1',
          col_title: 'Hábitos Atômicos',
          col_author: 'James Clear',
          col_status: 'Concluído',
          col_rating: 5,
          col_category: 'Produtividade',
        },
        {
          id: 'r2',
          col_title: 'Essencialismo',
          col_author: 'Greg McKeown',
          col_status: 'Lendo',
          col_rating: 4,
          col_category: 'Foco',
        },
        {
          id: 'r3',
          col_title: 'A Psicologia Financeira',
          col_author: 'Morgan Housel',
          col_status: 'Concluído',
          col_rating: 5,
          col_category: 'Finanças',
        },
        {
          id: 'r4',
          col_title: 'Deep Work: Foco Máximo',
          col_author: 'Cal Newport',
          col_status: 'Desejo',
          col_rating: null,
          col_category: 'Produtividade',
        },
      ])
      app.save(demoDb)
    }
  },
  (app) => {
    // rollback
  },
)

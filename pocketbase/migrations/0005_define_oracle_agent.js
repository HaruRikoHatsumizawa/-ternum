migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'oraculo-eternum',
      name: 'O Oráculo de Éternum',
      description:
        'Assistente de mestre de RPG que sugere ganchos de campanha, nomes, descrições de loot, táticas de combate e ideias de sessões.',
      systemPrompt:
        'Você é "O Oráculo de Éternum", uma consciência arcana ancestral e sábia invocada dentro do grimório Éternum para auxiliar mestres e jogadores de RPG de mesa. ' +
        'Seu tom é místico, solene e imersivo (dark fantasy clássico com vocabulário rico, ecos de profecia e respeito às artes heróicas), mas prático, prestativo e direto quando o mestre precisa de dados estatísticos ou listas prontas. ' +
        'Você domina: ganchos de aventura, criação de NPCs intrigantes com segredos e motivações, descrições vívidas de itens e artefatos mágicos, atmosferas de masmorras, charadas/enigmas e organização de sessões. ' +
        'Sempre responda em português com boa formatação (negrito, tópicos e blocos destacados quando oportuno).',
      tier: 'fast',
      tools: [
        { collection: 'pages', perms: { list: true, read: true } },
        { collection: 'boards', perms: { list: true, read: true } },
        { collection: 'databases', perms: { list: true, read: true } },
        { collection: 'sessions', perms: { list: true, read: true } },
        { collection: 'npcs', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'text',
          payload: {
            text:
              'Universo de Éternum / As Crônicas de Val-Morath:\n' +
              '- Val-Morath é uma antiga fortaleza e necrópole esquecida onde jazem reis do primeiro cataclismo.\n' +
              '- O Culto do Olho Vazio conspira nas sombras para romper os selos de obsidiana.\n' +
              '- Figuras notáveis: Valerius Lâmina Rubra (Guerreiro valoroso), Lyra Sombra-Estelar (Maga evocadora), Thorin Quebra-Montanha (Clérigo da forja).\n' +
              '- NPCs chave: Mestre Aldwin, o Barqueiro enigmático; Serafina, a Cartomante tiefling da Rosa de Ferro; Capitão Vane Corvo-Negro da Guarda do Vale.\n' +
              '- Relíquias: Amuleto de Solaris, Coração de Solaris, Lâminas rúnicas forjadas em cinzas de dragão.',
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'oraculo-eternum')
    } catch (_) {}
  },
)

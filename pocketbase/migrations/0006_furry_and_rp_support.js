migrate(
  (app) => {
    // 1. Atualizar campos da coleção npcs com suporte explícito a RP:
    // species (espécie furry / raça antropomórfica), bio, relationships
    const npcsCol = app.findCollectionByNameOrId('npcs')
    if (!npcsCol.fields.getByName('species')) {
      npcsCol.fields.add(new TextField({ name: 'species' }))
    }
    if (!npcsCol.fields.getByName('bio')) {
      npcsCol.fields.add(new TextField({ name: 'bio' }))
    }
    if (!npcsCol.fields.getByName('relationships')) {
      npcsCol.fields.add(new TextField({ name: 'relationships' }))
    }
    app.save(npcsCol)

    // 2. Atualizar o Agente Oráculo para integrar o foco RPG + RP e espécies antropomórficas sofisticadas
    try {
      $ai.agents.define(app, {
        slug: 'oraculo-eternum',
        name: 'O Oráculo de Éternum',
        description:
          'Assistente de mestre e jogadores de RPG e RP que sugere ganchos de campanha, desenvolvimento de personagens (espécie antropomórfica, bio, personalidade, relações), cenas narrativas e encontros.',
        systemPrompt:
          'Você é "O Oráculo de Éternum", uma consciência arcana ancestral e sábia invocada dentro do grimório Éternum para auxiliar mestres e jogadores tanto em RPG de mesa clássico (atributos, regras, combates, loot) quanto em RP / Roleplay narrativo (interpretação, biografias profundas, arcos de personagens, relações, motivações e cenas dramáticas). ' +
          'O universo de Éternum possui identidade dark fantasy sofisticada com personagens antropomórficos (furry elegante e discreto: raposas mercenárias, lobos arcanistas, dragões viajantes, felinos batedores, corvos eruditos). ' +
          'Mantenha sempre um tom místico, solene e maduro (obsidiana, ouro rúnico, pergaminho antigo), NUNCA use jargões caricatos, infantilizados ou exagerados. A antropomorfia aqui é tratada com nobreza e estilo de fábula heróica medieval. ' +
          'Atenda com primazia: criação de fichas híbridas (RPG com classe/HP/atributos ou RP com espécie, aparência, personalidade e relações), tramas para sessões ou cenas de interpretação e enigmas rúnicos. ' +
          'Sempre responda em português com excelente formatação.',
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
                '- Val-Morath é uma ancestral cidadela nas brumas onde clãs antropomórficos de nobres feras e arcanistas convivem.\n' +
                '- O Culto do Olho Vazio conspira nas criptas para quebrar os selos de obsidiana.\n' +
                '- Personagens em Destaque:\n' +
                '  * Valerius Lâmina Rubra: Raposa mercenária e espadachim valoroso, mestre de manobras de duelo.\n' +
                '  * Lyra Sombra-Estelar: Loba arcanista e evocadora das constelações veladas.\n' +
                '  * Ignis Escama-de-Cinza: Dragão viajante e clérigo da forja rúnica.\n' +
                '- NPCs Chave:\n' +
                '  * Mestre Aldwin: Lobo cinzento ancião, barqueiro das Águas Veladas e historiador.\n' +
                '  * Serafina das Sete Cartas: Leopardo-das-neves cartomante e negociante de relíquias ocultas.\n' +
                '  * Capitão Vane Corvo-Negro: Corvo antropomórfico batedor e comandante da guarda do vale.\n' +
                '- Suporte Híbrido: Todas as fichas servem tanto para RPG tático quanto para RP narrativo.',
            },
          },
        ],
      })
    } catch (_) {}

    // 3. Atualizar dados existentes do usuário demo (amanda_fac1@yahoo.com.br) para alinhar aos novos personagens furry sofisticados
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'amanda_fac1@yahoo.com.br')
    } catch (_) {}

    if (userRecord) {
      const userId = userRecord.id

      // Atualizar páginas existentes (Valerius -> Raposa, Lyra -> Loba)
      const userPages = app.findRecordsByFilter('pages', "user = '" + userId + "'", '', 20, 0)
      for (let i = 0; i < userPages.length; i++) {
        const p = userPages[i]
        const t = p.getString('title')
        if (t.includes('Valerius')) {
          p.set('title', 'Valerius Lâmina Rubra — Raposa Espadachim Nv. 5')
          p.set('blocks', [
            { id: 'b1', type: 'heading_1', content: 'Ficha de Personagem: Valerius Lâmina Rubra' },
            {
              id: 'b2',
              type: 'callout',
              content:
                'Espécie: Raposa-Vermelha Antropomórfica | Classe: Guerreiro / Espadachim | Nível: 5 | Alinhamento: Caótico e Bom',
            },
            { id: 'b3', type: 'heading_2', content: 'Visão Narrativa & RP (Roleplay)' },
            {
              id: 'b_bio',
              type: 'text',
              content:
                'Valerius nasceu nas estepes setentrionais de Val-Morath. Sobreviveu como batedor e mercenário antes de jurar proteger os refugiados da floresta. Carrega o brasão de sua matilha gravado no cabo da rapieira de prata.',
            },
            {
              id: 'b_app',
              type: 'text',
              content:
                'Pelagem carmesim densa com peito níveo, orelhas pontiagudas atentas a qualquer estalar de folhas, cauda farta com ponta prateada e um gibão de couro reforçado com broches de obsidiana.',
            },
            {
              id: 'b_pers',
              type: 'quote',
              content:
                '"Minha lâmina é afiada, mas meus sentidos de caçador são ainda mais rápidos. Nenhuma sombra passa despercebida."',
            },
            { id: 'b4', type: 'heading_2', content: 'Estatísticas de Combate & RPG' },
            {
              id: 'b5',
              type: 'bullet',
              content:
                'Pontos de Vida (HP): 48 / 48 | Classe de Armadura (CA): 18 (Cota de Placas & Escudo)',
            },
            {
              id: 'b6',
              type: 'bullet',
              content:
                'Força: 18 (+4) | Destreza: 16 (+3) | Constituição: 16 (+3) | Sentidos Aguçados (+4 Percepção)',
            },
            {
              id: 'b7',
              type: 'bullet',
              content: 'Inteligência: 12 (+1) | Sabedoria: 14 (+2) | Carisma: 13 (+1)',
            },
            { id: 'b8', type: 'heading_3', content: 'Habilidades & Manobras de Duelo' },
            {
              id: 'b9',
              type: 'todo',
              content: 'Furtividade Natural da Raposa (Vantagem em espreita na penumbra)',
              checked: true,
            },
            {
              id: 'b10',
              type: 'todo',
              content: 'Ripostar com golpe de reação ao desviar de lâmina inimiga',
              checked: false,
            },
            {
              id: 'b11',
              type: 'todo',
              content: 'Retomar o Fôlego (1d10 + 5) — Pronto para usar',
              checked: true,
            },
          ])
          app.save(p)
        } else if (t.includes('Lyra')) {
          p.set('title', 'Lyra Sombra-Estelar — Loba Arcanista Nv. 4')
          p.set('blocks', [
            { id: 'l1', type: 'heading_1', content: 'Ficha de Personagem: Lyra Sombra-Estelar' },
            {
              id: 'l2',
              type: 'callout',
              content:
                'Espécie: Loba Cinzenta Antropomórfica | Classe: Maga Evocadora | Nível: 4 | HP: 26 / 26',
            },
            { id: 'l_rp', type: 'heading_2', content: 'Perfil Narrativo (RP)' },
            {
              id: 'l_bio',
              type: 'text',
              content:
                'Estudiosa do Círculo Lunar de Val-Morath, Lyra canaliza energia estelar em suas orbes de gelo e fogo. Silenciosa, perspicaz e leal até a última gota à sua matilha de companheiros.',
            },
            { id: 'l3', type: 'heading_2', content: 'Grimório de Magias Preparadas (RPG)' },
            {
              id: 'l4',
              type: 'todo',
              content: 'Mísseis Cósmicos (1º círculo) — 3 espaços restantes',
              checked: true,
            },
            { id: 'l5', type: 'todo', content: 'Escudo Rúnico (1º círculo)', checked: true },
            { id: 'l6', type: 'todo', content: 'Passo Nebuloso (2º círculo)', checked: false },
          ])
          app.save(p)
        }
      }

      // Atualizar NPCs existentes para espécies antropomórficas elegantes
      const userNpcs = app.findRecordsByFilter('npcs', "user = '" + userId + "'", '', 20, 0)
      for (let j = 0; j < userNpcs.length; j++) {
        const n = userNpcs[j]
        const nName = n.getString('name')
        if (nName.includes('Aldwin')) {
          n.set('name', 'Mestre Aldwin, o Barqueiro')
          n.set('race', 'Lobo Ancião')
          n.set('species', 'Lobo Cinzento Antropomórfico')
          n.set('avatar', '🐺')
          n.set(
            'appearance',
            'Alto e esguio, pelagem grisalha com mechas prateadas nas têmporas, manto de linho escuro com broche rúnico de caçador e olhos dourados profundos como brasas.',
          )
          n.set(
            'bio',
            'Navega pelas águas veladas de Val-Morath há mais de três luas de séculos. Conhece o canto dos espíritos do pântano e guia viajantes que honram o código da floresta ancestral.',
          )
          n.set(
            'relationships',
            'Mentor espiritual de Lyra Sombra-Estelar; aliado cauteloso do Capitão Vane.',
          )
          app.save(n)
        } else if (nName.includes('Serafina')) {
          n.set('name', 'Serafina das Sete Cartas')
          n.set('race', 'Leopardo-das-neves')
          n.set('species', 'Leopardo-das-neves Antropomórfica')
          n.set('avatar', '🐆')
          n.set(
            'appearance',
            'Pelagem nívea com rosetas esfumaçadas de ébano, cauda longa e felpuda que envolve os ombros como estola, olhos ametista brilhantes e véus carmesim bordados com runas estrelares.',
          )
          n.set(
            'bio',
            'Cartomante errante que descende dos clãs montanhosos do norte. Suas garras delicadas manejam o baralho de marfim com precisão cirúrgica.',
          )
          n.set(
            'relationships',
            'Comerciante de confiança de Valerius; rival de contrabandistas da Fortaleza da Cicatriz.',
          )
          app.save(n)
        } else if (nName.includes('Vane')) {
          n.set('name', 'Capitão Vane Corvo-Negro')
          n.set('race', 'Corvo Batedor')
          n.set('species', 'Corvo Antropomórfico')
          n.set('avatar', '🦅')
          n.set(
            'appearance',
            'Plumagem negro-azulada reluzente com reflexos de obsidiana, bico nobre adornado com anel de prata, armadura de cota de malha leve e manto com insígnia da Guarda das Asas.',
          )
          n.set(
            'bio',
            'Comandante de vigilância do vale. Seus olhos agudos enxergam emboscadas antes mesmo que os tambores inimigos soem.',
          )
          n.set(
            'relationships',
            'Comanda os batedores do vale; contrata aventureiros e patrulheiros para missões além da muralha.',
          )
          app.save(n)
        }
      }
    }
  },
  (app) => {
    // rollback
  },
)

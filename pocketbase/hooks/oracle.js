// Endpoints para conversar com o Oráculo de Éternum (Agente Nativo do Skip Cloud)

routerAdd(
  'POST',
  '/backend/v1/oracle/ask',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária para consultar o Oráculo.')
      if (!body.message || !body.message.trim()) {
        return e.badRequestError('A mensagem para o Oráculo é obrigatória.')
      }

      const result = $ai.agent('oraculo-eternum').chat({
        user_id: userId,
        conversation_id: body.conversation_id || null,
        message: body.message,
      })

      return e.json(200, {
        conversation_id: result.conversation_id,
        content: result.content,
        citations: result.citations || [],
        message_id: result.message_id,
      })
    } catch (err) {
      if (err instanceof SkipAiConfigError) {
        return e.json(503, { error: 'O Oráculo está temporariamente em meditação silenciosa.' })
      }
      if (err instanceof SkipAiAgentsError) {
        const status = err.status || 500
        return e.json(status, {
          error: status >= 500 ? 'O Oráculo não conseguiu processar sua prece.' : err.message,
        })
      }
      if (err instanceof SkipAiError) {
        const status = err.status || 502
        return e.json(status, {
          error: status >= 500 ? 'O véu arcano oscilou. Tente novamente.' : err.message,
        })
      }
      return e.json(500, { error: 'Falha arcana ao consultar o Oráculo.' })
    }
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/oracle/conversations',
  (e) => {
    try {
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária.')
      const limit = parseInt(e.requestInfo().query?.limit || '20', 10) || 20
      const list = $ai.agent('oraculo-eternum').listConversations({ user_id: userId, limit })
      return e.json(200, list)
    } catch (err) {
      return e.json(500, { error: 'Falha ao recuperar crônicas do Oráculo.' })
    }
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/oracle/conversations/{conversationId}/messages',
  (e) => {
    try {
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária.')
      const conversationId = e.request.pathValue('conversationId')
      const messages = $ai.agent('oraculo-eternum').listMessages({
        conversation_id: conversationId,
        user_id: userId,
      })
      return e.json(200, messages)
    } catch (err) {
      if (err instanceof SkipAiAgentsError) {
        const status = err.status || 500
        return e.json(status, {
          error: status >= 500 ? 'Falha ao recuperar preces anteriores.' : err.message,
        })
      }
      return e.json(500, { error: 'Falha ao carregar mensagens da conversa.' })
    }
  },
  $apis.requireAuth(),
)

// Endpoint dedicado para o Oráculo de Éternum gerar resumos narrativos (RP) e táticos (RPG)
// e fichas personalizadas ornadas de personagens, usando o agente nativo 'oraculo-eternum'.
routerAdd(
  'POST',
  '/backend/v1/oracle/character-generate',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária para consultar o Oráculo.')

      const type = body.type // 'rp_summary' | 'rpg_summary' | 'custom_sheet'
      const sheetFormat = body.sheet_format || 'rp' // 'rp' | 'rpg'
      const characterData = body.character || {}
      const locale = body.locale || 'pt-BR'

      if (!type) {
        return e.badRequestError(
          "Tipo de geração obrigatório: 'rp_summary', 'rpg_summary' ou 'custom_sheet'.",
        )
      }

      const name = characterData.name || 'Personagem Desconhecido'
      const race = characterData.race || characterData.species || 'Raça desconhecida'
      const age = characterData.age ? `Idade: ${characterData.age}.` : ''
      const sexuality = characterData.sexuality ? `Sexualidade: ${characterData.sexuality}.` : ''
      const pronouns = characterData.pronouns ? `Pronomes: ${characterData.pronouns}.` : ''
      const backstory = characterData.backstory
        ? `História/Origem: ${characterData.backstory}.`
        : ''
      const bonds = characterData.bonds ? `Vínculos/Relações: ${characterData.bonds}.` : ''
      const occupation = characterData.occupation
        ? `Ocupação/Classe: ${characterData.occupation}.`
        : ''
      const alignment = characterData.alignment ? `Alinhamento: ${characterData.alignment}.` : ''

      const powersList = Array.isArray(characterData.powers)
        ? characterData.powers
            .map((p) => `- ${p.name || 'Poder'}: ${p.description || ''}`)
            .join('\n')
        : ''
      const abilitiesList = Array.isArray(characterData.abilities)
        ? characterData.abilities
            .map((a) => `- ${a.name || 'Habilidade'}: ${a.description || ''}`)
            .join('\n')
        : ''

      let prompt = ''

      if (type === 'rp_summary') {
        prompt =
          (locale === 'en'
            ? `Please write an evocative and elegant ROLEPLAY (RP) narrative summary for the character "${name}". Focus on personality, aesthetic presence, moral nuances, noble or wanderer motivations, emotional bonds, and dramatic potential in a dark fantasy setting. Avoid dice mechanics or stats. Keep it between 2 and 3 poetic, atmospheric paragraphs in English.\n`
            : `Escreva um resumo NARRATIVO DE ROLEPLAY (RP) evocativo e elegante para o personagem "${name}". Foque na personalidade, presença estética, nuances morais, motivações, vínculos afetivos/dramáticos e tom de interpretação em um cenário dark fantasy medieval. Não inclua números de regras ou dados. Escreva entre 2 e 3 parágrafos poéticos e envolventes em Português.\n`) +
          `Dados do personagem:\nNome: ${name}\n${race ? `Raça/Espécie: ${race}` : ''}\n${age}\n${sexuality}\n${pronouns}\n${occupation}\n${alignment}\n${backstory}\n${bonds}\n` +
          (powersList ? `Poderes narrativos:\n${powersList}\n` : '') +
          (abilitiesList ? `Habilidades expressivas:\n${abilitiesList}\n` : '')
      } else if (type === 'rpg_summary') {
        prompt =
          (locale === 'en'
            ? `Please write a TACTICAL RPG summary for the character "${name}". Highlight their combat style, tactical strengths, synergies between powers and abilities, role in an adventuring party (e.g. vanguard, controller, mystic support, stealth scout), and survival instincts in dark fantasy encounters. Keep it between 2 and 3 concise, structured paragraphs in English.\n`
            : `Escreva um resumo TÁTICO DE RPG para o personagem "${name}". Destaque o estilo de combate marcial ou arcano, vantagens táticas, sinergias entre seus poderes e habilidades, função no grupo de aventureiros (ex: vanguarda, suporte místico, controlador de campo ou batedor) e postura em confrontos épicos. Escreva entre 2 e 3 parágrafos estruturados e estratégicos em Português.\n`) +
          `Dados do personagem:\nNome: ${name}\n${race ? `Raça/Espécie: ${race}` : ''}\n${occupation}\n${alignment}\n` +
          (characterData.hp
            ? `HP: ${characterData.hp}, AC: ${characterData.ac || 10}, ND: ${characterData.cr || 'ND 1'}\n`
            : '') +
          (powersList ? `Poderes mágicos/especiais:\n${powersList}\n` : '') +
          (abilitiesList ? `Habilidades e técnicas:\n${abilitiesList}\n` : '')
      } else if (type === 'custom_sheet') {
        const isRp = sheetFormat === 'rp'
        prompt =
          (locale === 'en'
            ? `Generate a fully realized, ornate CUSTOM ${isRp ? 'ROLEPLAY (RP) CHRONICLE' : 'TACTICAL RPG DOSSIER'} for the character "${name}". Format it with clear markdown sections, noble heraldic titles, thematic quote, core traits, and distinctive runic titles. Never use emojis (only elegant medieval text/punctuation or bullet markers). Write in English.\n`
            : `Gere uma FICHA PERSONALIZADA ORNADA DE ${isRp ? 'INTERPRETAÇÃO E ROLEPLAY (RP)' : 'RPG TÁTICO & COMBATE'} para o personagem "${name}". Estruture o documento com seções bem definidas em Markdown (Título Heráldico, Epígrafe/Citação Temática, Perfil do Personagem, Arquétipo, Poderes e Dons, Filosofia e Conflitos). NUNCA utilize emojis (use apenas texto medieval refinado, pontuação ou marcadores sóbrios). Escreva em Português.\n`) +
          `Ficha base:\nNome: ${name}\nRaça/Espécie: ${race}\n${age}\n${sexuality}\n${pronouns}\n${occupation}\n${alignment}\n${backstory}\n${bonds}\n` +
          (powersList ? `Poderes:\n${powersList}\n` : '') +
          (abilitiesList ? `Habilidades:\n${abilitiesList}\n` : '')
      }

      // Consulta o agente nativo do Skip Cloud
      const result = $ai.agent('oraculo-eternum').chat({
        user_id: userId,
        message: prompt,
      })

      return e.json(200, {
        type,
        format: sheetFormat,
        content: result.content,
      })
    } catch (err) {
      if (err instanceof SkipAiConfigError) {
        return e.json(503, { error: 'O Oráculo está temporariamente em meditação silenciosa.' })
      }
      if (err instanceof SkipAiAgentsError) {
        const status = err.status || 500
        return e.json(status, {
          error:
            status >= 500 ? 'O Oráculo não conseguiu gerar a crônica do personagem.' : err.message,
        })
      }
      if (err instanceof SkipAiError) {
        const status = err.status || 502
        return e.json(status, {
          error: status >= 500 ? 'O véu arcano oscilou. Tente novamente.' : err.message,
        })
      }
      return e.json(500, { error: 'Falha arcana ao gerar dados do personagem pelo Oráculo.' })
    }
  },
  $apis.requireAuth(),
)

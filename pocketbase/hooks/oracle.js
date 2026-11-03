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

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import pb from '@/lib/pocketbase/client'
import { Sparkles, Send, User, Plus, Trash2, ExternalLink, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RunicCircle } from '@/components/rpg/RpgArtwork'
import { RuneOracleIcon, RuneNpcIcon, RuneSwordIcon } from '@/components/rpg/EternumIcons'
import { DiscordMarkdown } from '@/components/rpg/DiscordMarkdown'
import { toast } from '@/hooks/use-toast'

export interface CreatedCharacterMeta {
  id: string
  name: string
  species?: string
  occupation?: string
  avatar?: string
  target_mode?: string
  created?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created?: string
  createdCharacters?: CreatedCharacterMeta[]
}

interface ConversationItem {
  id: string
  title?: string
  updated?: string
}

export default function OracleChat() {
  const navigate = useNavigate()
  const { mode } = useAppMode()
  const { t } = useLanguage()
  const confirm = useConfirm()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Saudações, nobre Mestre. Eu sou **O Oráculo de Éternum**, a consciência ancestral que ecoa através das páginas deste grimório. Diga-me: quais segredos de campanha, ganchos de aventura ou fichas de heróis desejas forjar hoje? (Peça-me para criar um personagem e gravarei as runas da ficha diretamente em teu grimório!)',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Carregar conversas salvas
  const loadConversations = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/oracle/conversations`,
        {
          headers: {
            Authorization: pb.authStore.token,
          },
        },
      )
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setConversations(data)
        }
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const handleClearChat = async () => {
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.oracleDesc'),
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      dangerous: true,
      icon: 'oracle',
    })
    if (!confirmed) return

    setActiveConvId(null)
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content:
          'O espelho arcano foi purificado. Um novo fio do destino se abre diante de vós. O que desejas consultar ao Oráculo de Éternum?',
      },
    ])
    toast({ title: 'Vozes arcanas silenciadas' })
  }

  const handleStartNewChat = () => {
    setActiveConvId(null)
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content:
          'Um novo fio do destino se abre diante do espelho arcano. O que desejas consultar ao Oráculo de Éternum?',
      },
    ])
  }

  const handleSelectConversation = async (convId: string) => {
    setActiveConvId(convId)
    setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/oracle/conversations/${convId}/messages`,
        {
          headers: {
            Authorization: pb.authStore.token,
          },
        },
      )
      if (res.ok) {
        const data = await res.json()
        const rawList = data.messages || data || []
        const formatted: ChatMessage[] = rawList
          .filter((m: any) => m.role === 'user' || m.role === 'assistant')
          .map((m: any) => ({
            id: m.id || Math.random().toString(),
            role: m.role,
            content: m.content || '',
            created: m.created,
          }))

        if (formatted.length > 0) {
          setMessages(formatted)
        }
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao carregar histórico da conversa' })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || input).trim()
    if (!message || loading) return

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: message,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/oracle/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: pb.authStore.token,
        },
        body: JSON.stringify({
          message,
          conversation_id: activeConvId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'O Oráculo não pôde responder.')
      }

      if (data.conversation_id && !activeConvId) {
        setActiveConvId(data.conversation_id)
        loadConversations()
      }

      const assistantMsg: ChatMessage = {
        id: data.message_id || `ast_${Date.now()}`,
        role: 'assistant',
        content: data.content || 'O Oráculo sussurrou palavras inaudíveis nas brumas.',
        createdCharacters: Array.isArray(data.created_characters)
          ? data.created_characters
          : undefined,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Comunicação com o Oráculo interrompida',
        description: err?.message || 'Tente formular sua prece novamente.',
      })
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content:
            '*As brumas do éter oscilaram e a conexão mágica enfraqueceu. Por favor, tente enviar sua pergunta novamente.*',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-8 space-y-6 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Topo do Santuário do Oráculo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262c3a] pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/35 text-purple-300 flex items-center justify-center shrink-0">
            <RuneOracleIcon className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              {t('oracle.title')}
            </h1>
            <p className="text-xs text-amber-300/70">{t('oracle.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs border-rose-500/30 text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 font-fantasy"
            title="Limpar diálogo com o Oráculo"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> {t('confirm.deleteAction')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNewChat}
            className="text-xs border-[#2c3547] text-amber-300 hover:text-amber-100 hover:bg-amber-500/10 font-fantasy"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> {t('oracle.newConsult')}
          </Button>
        </div>
      </div>

      {/* Área Principal de Conversa */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Histórico lateral de conversas */}
        {conversations.length > 0 && (
          <div className="w-56 hidden md:flex flex-col border border-[#242b38] bg-[#0c1017] rounded-xl p-2.5 space-y-2 shrink-0 overflow-y-auto text-xs">
            <span className="text-[10px] font-fantasy font-bold uppercase tracking-wider text-amber-400/80 px-1">
              Crônicas Anteriores
            </span>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConversation(c.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md truncate transition-colors text-xs ${
                    activeConvId === c.id
                      ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/30'
                      : 'text-[#a39b8d] hover:bg-[#161c27] hover:text-amber-100'
                  }`}
                >
                  {c.title || 'Consulta Arcana'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Caixa de Mensagens */}
        <div className="flex-1 flex flex-col border border-amber-500/30 bg-[#121620] rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${
                    isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-xs ${
                      isAssistant
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-[#1e2535] border-[#313c54] text-slate-200'
                    }`}
                  >
                    {isAssistant ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border space-y-3 shadow-md max-w-full ${
                      isAssistant
                        ? 'bg-[#161c28] border-amber-500/25 text-amber-100'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <DiscordMarkdown content={m.content} />

                    {/* Exibição heróica de personagens forjados pelo Oráculo */}
                    {isAssistant && m.createdCharacters && m.createdCharacters.length > 0 && (
                      <div className="pt-2 border-t border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-fantasy font-semibold text-amber-300">
                          <RuneNpcIcon className="w-4 h-4 text-amber-400" />
                          <span>{t('oracle.characterCreatedCardTitle')}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {m.createdCharacters.map((char) => (
                            <div
                              key={char.id}
                              className="p-3 rounded-xl bg-[#0c1017] border border-amber-500/35 hover:border-amber-400 transition-all flex flex-col justify-between gap-2.5 shadow-md"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-fantasy font-bold text-amber-100 text-sm truncate">
                                    {char.name}
                                  </h4>
                                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    {char.target_mode || 'geral'}
                                  </span>
                                </div>
                                <p className="text-xs text-[#a39b8d] mt-0.5">
                                  {char.species} • {char.occupation}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-[#1a2332]">
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/characters/${char.id}`)}
                                  className="flex-1 h-7 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-fantasy"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {t('oracle.openDossierBtn')}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigate('/npcs')}
                                  className="h-7 px-2 text-xs text-[#a39b8d] hover:text-amber-200"
                                  title={t('oracle.viewInSheetList')}
                                >
                                  <RuneSwordIcon className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex gap-3 max-w-3xl mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <RunicCircle className="w-4 h-4 animate-spin text-amber-400" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#161c28] border border-amber-500/20 text-xs text-amber-300/80 italic flex items-center gap-2">
                  <span>{t('oracle.thinking')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#232b3b] bg-[#0c1017]/80 flex flex-wrap gap-2 text-[11px]">
              {Array.isArray(t('oracle.suggestions'))
                ? (t('oracle.suggestions') as unknown as string[]).map((sug: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 py-1 rounded-full bg-[#161c28] hover:bg-amber-500/15 border border-[#2b3548] hover:border-amber-500/40 text-amber-200/80 transition-colors text-left"
                    >
                      {sug}
                    </button>
                  ))
                : null}
            </div>
          )}

          {/* Campo de Envio */}
          <div className="p-3 bg-[#0d1118] border-t border-[#262f42] flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('oracle.inputPlaceholder')}
              rows={1}
              className="resize-none min-h-[42px] max-h-24 bg-[#141a24] border-[#2c374b] text-xs sm:text-sm text-amber-100 placeholder:text-amber-200/40 focus-visible:ring-amber-500/40"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="h-10 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold border border-amber-300/40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

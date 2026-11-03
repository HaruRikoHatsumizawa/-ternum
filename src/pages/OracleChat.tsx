import { useState, useEffect, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import {
  Sparkles,
  Send,
  Bot,
  User,
  History,
  Plus,
  Compass,
  Scroll,
  Swords,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RunicCircle, ArcaneOrb, TomeOrnament } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created?: string
}

interface ConversationItem {
  id: string
  title?: string
  updated?: string
}

const ORACLE_SUGGESTIONS = [
  'Crie uma ficha híbrida (RPG & RP) de uma Raposa espadachim com segredo de clã.',
  'Sugira uma cena dramática de RP entre dois nobres feras com visões opostas.',
  'Sugira 3 ganchos misteriosos de campanha nas brumas de Val-Morath.',
  'Como conduzir um enigma de runas e constelações em uma cripta selada?',
]

export default function OracleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Saudações, nobre Mestre. Eu sou **O Oráculo de Éternum**, a consciência ancestral que ecoa através das páginas deste grimório. Diga-me: quais segredos de campanha, ganchos de aventura ou relíquias esquecidas desejas desvendar hoje?',
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
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <ArcaneOrb className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              O Oráculo de Éternum
            </h1>
            <p className="text-xs text-amber-300/70">
              Assistente de IA Arcana nativo para mestres e jogadores de RPG & RP • Fichas, Cenas,
              NPCs & Enigmas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNewChat}
            className="text-xs border-[#2c3547] text-amber-300 hover:text-amber-100 hover:bg-amber-500/10 font-fantasy"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Nova Consulta
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
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border space-y-1 shadow-md ${
                      isAssistant
                        ? 'bg-[#161c28] border-amber-500/25 text-amber-100'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
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
                  <span>O Oráculo perscruta as linhas do éter...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#232b3b] bg-[#0c1017]/80 flex flex-wrap gap-2 text-[11px]">
              {ORACLE_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 rounded-full bg-[#161c28] hover:bg-amber-500/15 border border-[#2b3548] hover:border-amber-500/40 text-amber-200/80 transition-colors text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Campo de Envio */}
          <div className="p-3 bg-[#0d1118] border-t border-[#262f42] flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte ao Oráculo (ex: Crie um personagem híbrido raposa mercenária, cena de RP, gancho de sessão...)"
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

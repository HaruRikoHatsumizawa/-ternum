import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { boardsService, BoardRecord, BoardCard, BoardColumn } from '@/services/boards'
import {
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  GripHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

export default function BoardView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [board, setBoard] = useState<BoardRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [cards, setCards] = useState<BoardCard[]>([])

  // Modal para criar/editar cartão
  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<BoardCard | null>(null)
  const [cardTitle, setCardTitle] = useState('')
  const [cardDesc, setCardDesc] = useState('')
  const [cardPriority, setCardPriority] = useState<'baixa' | 'media' | 'alta'>('media')
  const [cardDueDate, setCardDueDate] = useState('')
  const [targetColumnId, setTargetColumnId] = useState<string>('todo')

  // Drag and drop state simples via HTML5 DnD
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      try {
        const data = await boardsService.getById(id)
        setBoard(data)
        setName(data.name || '')
        setColumns(data.columns || [])
        setCards(data.cards || [])
      } catch (err) {
        console.error(err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const triggerSave = async (newName = name, newCols = columns, newCards = cards) => {
    if (!id) return
    try {
      await boardsService.update(id, {
        name: newName,
        columns: newCols,
        cards: newCards,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleNameChange = (val: string) => {
    setName(val)
    triggerSave(val, columns, cards)
  }

  const handleDeleteBoard = async () => {
    if (!id) return
    if (confirm('Tem certeza que deseja excluir este quadro?')) {
      await boardsService.delete(id)
      navigate('/')
    }
  }

  // Abertura do modal de criação de cartão
  const openNewCardModal = (colId: string) => {
    setEditingCard(null)
    setTargetColumnId(colId)
    setCardTitle('')
    setCardDesc('')
    setCardPriority('media')
    setCardDueDate('')
    setCardModalOpen(true)
  }

  const openEditCardModal = (card: BoardCard) => {
    setEditingCard(card)
    setTargetColumnId(card.columnId)
    setCardTitle(card.title)
    setCardDesc(card.description || '')
    setCardPriority(card.priority || 'media')
    setCardDueDate(card.dueDate || '')
    setCardModalOpen(true)
  }

  const handleSaveCard = () => {
    if (!cardTitle.trim()) return

    if (editingCard) {
      const updated = cards.map((c) =>
        c.id === editingCard.id
          ? {
              ...c,
              title: cardTitle.trim(),
              description: cardDesc.trim(),
              priority: cardPriority,
              dueDate: cardDueDate,
              columnId: targetColumnId,
            }
          : c,
      )
      setCards(updated)
      triggerSave(name, columns, updated)
    } else {
      const newCard: BoardCard = {
        id: 'c_' + Date.now(),
        columnId: targetColumnId,
        title: cardTitle.trim(),
        description: cardDesc.trim(),
        priority: cardPriority,
        dueDate: cardDueDate,
      }
      const updated = [...cards, newCard]
      setCards(updated)
      triggerSave(name, columns, updated)
    }

    setCardModalOpen(false)
  }

  const handleDeleteCard = (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId)
    setCards(updated)
    triggerSave(name, columns, updated)
  }

  const handleMoveCardColumn = (cardId: string, newColId: string) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, columnId: newColId } : c))
    setCards(updated)
    triggerSave(name, columns, updated)
  }

  // HTML5 Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId)
    setDraggedCardId(cardId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId
    if (cardId) {
      handleMoveCardColumn(cardId, targetColId)
    }
    setDraggedCardId(null)
  }

  // Cálculo de Progresso
  const totalCards = cards.length
  const doneCards = cards.filter((c) => c.columnId === 'done').length
  const progressPercent = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Carregando quadro...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-6">
      {/* Header do Quadro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{board?.icon || '📌'}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do Quadro"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
            />
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Arraste os cartões entre as colunas para atualizar o status e acompanhar o progresso.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Barra de Progresso */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-center gap-3 min-w-[200px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Progresso
                </span>
                <span className="text-slate-900 font-bold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-slate-200" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {doneCards}/{totalCards}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteBoard}
            className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Excluir quadro"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Colunas do Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {columns.map((col) => {
          const colCards = cards.filter((c) => c.columnId === col.id)

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 min-h-[420px] transition-colors"
            >
              {/* Header da Coluna */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      col.color || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {col.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({colCards.length})</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-slate-700"
                  onClick={() => openNewCardModal(col.id)}
                  title="Adicionar cartão"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Lista de Cartões */}
              <div className="flex-1 space-y-2.5">
                {colCards.map((card) => {
                  return (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onClick={() => openEditCardModal(card)}
                      className="cursor-grab active:cursor-grabbing border-slate-200/90 shadow-xs hover:shadow-sm transition-all hover:border-slate-300 bg-white group"
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                            {card.title}
                          </h4>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 rounded transition-opacity">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs w-40">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditCardModal(card)
                                }}
                              >
                                Editar cartão
                              </DropdownMenuItem>
                              <div className="border-t border-slate-100 my-1" />
                              {columns.map((c) => {
                                if (c.id === card.columnId) return null
                                return (
                                  <DropdownMenuItem
                                    key={c.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveCardColumn(card.id, c.id)
                                    }}
                                  >
                                    Mover para: {c.title}
                                  </DropdownMenuItem>
                                )
                              })}
                              <div className="border-t border-slate-100 my-1" />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCard(card.id)
                                }}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {card.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {card.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          {card.priority && (
                            <span
                              className={`px-1.5 py-0.5 rounded font-medium capitalize ${
                                card.priority === 'alta'
                                  ? 'bg-rose-50 text-rose-700'
                                  : card.priority === 'media'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {card.priority}
                            </span>
                          )}

                          {card.dueDate && (
                            <span className="flex items-center gap-1 font-mono text-slate-500">
                              <Clock className="h-2.5 w-2.5" />
                              {card.dueDate}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {colCards.length === 0 && (
                  <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    <p className="text-[11px]">Nenhum cartão nesta coluna</p>
                    <button
                      onClick={() => openNewCardModal(col.id)}
                      className="text-[11px] text-slate-700 hover:underline font-medium mt-1 inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Criar cartão
                    </button>
                  </div>
                )}
              </div>

              {/* Botão rápido no rodapé da coluna */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openNewCardModal(col.id)}
                className="w-full mt-2 text-xs text-slate-500 hover:text-slate-900 justify-start gap-1.5 h-7"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Novo cartão</span>
              </Button>
            </div>
          )
        })}
      </div>

      {/* Modal Criar/Editar Cartão */}
      <Dialog open={cardModalOpen} onOpenChange={setCardModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              {editingCard ? 'Editar Cartão' : 'Novo Cartão de Tarefa'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Título da tarefa</label>
              <Input
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Ex: Concluir relatório mensal"
                className="text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Descrição / Detalhes</label>
              <Textarea
                value={cardDesc}
                onChange={(e) => setCardDesc(e.target.value)}
                placeholder="Adicione notas, links ou requisitos..."
                className="text-xs min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Coluna / Status</label>
                <select
                  value={targetColumnId}
                  onChange={(e) => setTargetColumnId(e.target.value)}
                  className="w-full text-xs h-9 px-2 rounded-md border border-slate-200 bg-white text-slate-800"
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Prioridade</label>
                <select
                  value={cardPriority}
                  onChange={(e) => setCardPriority(e.target.value as any)}
                  className="w-full text-xs h-9 px-2 rounded-md border border-slate-200 bg-white text-slate-800"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Prazo / Data de entrega</label>
              <Input
                type="date"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            {editingCard ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleDeleteCard(editingCard.id)
                  setCardModalOpen(false)
                }}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Excluir
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCardModalOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveCard}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white"
              >
                {editingCard ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

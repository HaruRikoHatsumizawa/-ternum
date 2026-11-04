import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import { boardsService, BoardRecord, BoardCard, BoardColumn } from '@/services/boards'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import { RuneSwordIcon, RunicInsignia } from '@/components/rpg/EternumIcons'
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
  const { mode, setMode } = useAppMode()
  const { t } = useLanguage()
  const confirm = useConfirm()
  const navigate = useNavigate()

  const [board, setBoard] = useState<BoardRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [cards, setCards] = useState<BoardCard[]>([])
  const [boardTargetMode, setBoardTargetMode] = useState<string>('geral')

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
        setBoardTargetMode(data.target_mode || 'geral')
      } catch (err) {
        console.error(err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const triggerSave = async (
    newName = name,
    newCols = columns,
    newCards = cards,
    newMode = boardTargetMode,
  ) => {
    if (!id) return
    try {
      await boardsService.update(id, {
        name: newName,
        columns: newCols,
        cards: newCards,
        target_mode: newMode as any,
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
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.boardColumnDesc') || t('confirm.genericDesc'),
      itemName: name || undefined,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      dangerous: true,
      icon: 'trash',
    })
    if (confirmed) {
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

  const handleDeleteCard = async (cardId: string) => {
    const card = cards.find((c) => c.id === cardId)
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.boardCardDesc'),
      itemName: card?.title || undefined,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      dangerous: true,
      icon: 'trash',
    })
    if (!confirmed) return
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
      <EternumLoadingScreen
        message={t('loading.consultingContracts')}
        submessage={t('loading.organizingQuestBoard')}
        fullScreen={false}
      />
    )
  }
  // Verificação de compatibilidade de modo quando navegado por URL direta:
  const isModeMismatch =
    mode !== 'geral' && boardTargetMode && boardTargetMode !== 'geral' && boardTargetMode !== mode

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-6">
      {isModeMismatch && (
        <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <RuneSwordIcon className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-200">
              {t('common.modeMismatched', {
                targetMode: boardTargetMode.toUpperCase(),
                currentMode: mode.toUpperCase(),
              })}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setMode('geral')}
            className="h-7 text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-fantasy font-bold shrink-0"
          >
            {t('common.switchToGeneral')}
          </Button>{' '}
        </div>
      )}
      {/* Header do Mural de Missões */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262e40]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <RunicInsignia name={board?.icon || 'sword'} className="w-5 h-5 mode-accent-text" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do Mural de Missões"
              className="text-2xl sm:text-3xl font-fantasy font-bold tracking-tight text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
            />
          </div>
          <p className="text-xs text-[#a39b8d] pl-8">
            Mural de Contratos, Quests & Tramas Narrativas (RPG & RP): arraste os pergaminhos entre
            as colunas para acompanhar missões e arcos dos personagens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Classificação de Modo do Mural */}
          <div className="flex items-center gap-1 bg-[#121620] border border-[#2c3548] rounded-md px-2.5 py-1 text-xs">
            <span className="text-[10px] font-fantasy text-amber-300/80">Modo:</span>
            <select
              value={boardTargetMode}
              onChange={(e) => {
                const nextM = e.target.value
                setBoardTargetMode(nextM)
                triggerSave(name, columns, cards, nextM)
              }}
              className="bg-transparent text-amber-100 text-xs font-fantasy focus:outline-hidden cursor-pointer"
            >
              <option value="geral" className="bg-[#121620] text-amber-100">
                Geral (Ambos)
              </option>
              <option value="rpg" className="bg-[#121620] text-amber-100">
                RPG Tático
              </option>
              <option value="rp" className="bg-[#121620] text-amber-100">
                RP Narrativo
              </option>
            </select>
          </div>
          {/* Barra de Progresso de Quests */}
          <div className="bg-[#121620] border border-amber-500/25 rounded-lg p-2.5 flex items-center gap-3 min-w-[210px] shadow-sm">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] font-fantasy font-bold text-amber-200 mb-1">
                <span className="flex items-center gap-1 text-amber-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Vitórias / Conclusão
                </span>
                <span className="text-amber-100 font-mono">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-[#1c2230]" />
            </div>
            <span className="text-[10px] text-amber-300/70 font-mono">
              {doneCards}/{totalCards}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteBoard}
            className="h-8 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            title={t('board.deleteBoard')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>{' '}
        </div>
      </div>

      {/* Colunas do Mural (Kanban de Missões) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {columns.map((col) => {
          const colCards = cards.filter((c) => c.columnId === col.id)

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col bg-[#0f131b]/90 border border-[#242b3b] rounded-xl p-3 min-h-[440px] shadow-lg transition-colors hover:border-[#323d54]"
            >
              {/* Header da Coluna */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#222938]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-fantasy font-bold px-2.5 py-0.5 rounded-md border ${
                      col.color || 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {col.title}
                  </span>
                  <span className="text-xs text-amber-300/60 font-mono">({colCards.length})</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-400/70 hover:text-amber-200 hover:bg-amber-500/10"
                  onClick={() => openNewCardModal(col.id)}
                  title="Afixar nova missão"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Lista de Cartões de Missão */}
              <div className="flex-1 space-y-2.5">
                {colCards.map((card) => {
                  return (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onClick={() => openEditCardModal(card)}
                      className="cursor-grab active:cursor-grabbing border-[#2a3346] hover:border-amber-500/50 shadow-md transition-all bg-gradient-to-b from-[#151a26] to-[#11151f] text-amber-50 group hover:shadow-amber-950/20"
                    >
                      <CardContent className="p-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-fantasy font-bold text-amber-100 leading-snug group-hover:text-amber-200">
                            {card.title}
                          </h4>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="opacity-0 group-hover:opacity-100 p-0.5 text-amber-400/60 hover:text-amber-200 rounded transition-opacity">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-xs w-44 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
                            >
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditCardModal(card)
                                }}
                                className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                              >
                                Editar missão
                              </DropdownMenuItem>
                              <div className="border-t border-[#262c3a] my-1" />
                              {columns.map((c) => {
                                if (c.id === card.columnId) return null
                                return (
                                  <DropdownMenuItem
                                    key={c.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveCardColumn(card.id, c.id)
                                    }}
                                    className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                                  >
                                    Mover para: {c.title}
                                  </DropdownMenuItem>
                                )
                              })}
                              <div className="border-t border-[#262c3a] my-1" />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCard(card.id)
                                }}
                                className="text-rose-400 focus:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
                              >
                                Cancelar / Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {card.description && (
                          <p className="text-[11px] text-[#a39b8d] line-clamp-2 leading-relaxed">
                            {card.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          {card.priority && (
                            <span
                              className={`px-1.5 py-0.5 rounded font-fantasy font-semibold border ${
                                card.priority === 'alta'
                                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                                  : card.priority === 'media'
                                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                                    : 'bg-[#1a2130] text-[#c2b9a7] border-[#2c3547]'
                              }`}
                            >
                              Perigo: {card.priority}
                            </span>
                          )}

                          {card.dueDate && (
                            <span className="flex items-center gap-1 font-mono text-amber-300/70">
                              <Clock className="h-2.5 w-2.5 text-amber-400" />
                              {card.dueDate}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {colCards.length === 0 && (
                  <div className="py-8 text-center text-[#7d7568] border border-dashed border-[#242b3b] rounded-lg">
                    <p className="text-[11px] font-fantasy">Nenhum contrato afixado</p>
                    <button
                      onClick={() => openNewCardModal(col.id)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-medium mt-1 inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Afixar contrato
                    </button>
                  </div>
                )}
              </div>

              {/* Botão rápido no rodapé da coluna */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openNewCardModal(col.id)}
                className="w-full mt-2 text-xs text-amber-300/70 hover:text-amber-200 hover:bg-amber-500/10 justify-start gap-1.5 h-7 font-fantasy"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nova missão</span>
              </Button>
            </div>
          )
        })}
      </div>

      {/* Modal Criar/Editar Cartão de Missão */}
      <Dialog open={cardModalOpen} onOpenChange={setCardModalOpen}>
        <DialogContent className="max-w-md bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="text-base font-fantasy font-bold text-amber-100">
              {editingCard ? 'Editar Contrato de Missão' : 'Afixar Nova Missão no Mural'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Título do Contrato / Trama Narrativa
              </label>
              <Input
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Ex: Investigar o Pacto do Clã das Sombras / Resgatar a Relíquia"
                className="text-sm bg-[#090c10] border-[#2a3346] text-amber-100 placeholder:text-amber-200/40"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Instruções & Recompensas
              </label>
              <Textarea
                value={cardDesc}
                onChange={(e) => setCardDesc(e.target.value)}
                placeholder="Descreva a recompensa em PO, local, fraquezas do monstro..."
                className="text-xs min-h-[80px] bg-[#090c10] border-[#2a3346] text-amber-100 placeholder:text-amber-200/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  Coluna / Status
                </label>
                <select
                  value={targetColumnId}
                  onChange={(e) => setTargetColumnId(e.target.value)}
                  className="w-full text-xs h-9 px-2 rounded-md border border-[#2a3346] bg-[#090c10] text-amber-100"
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  Grau de Perigo
                </label>
                <select
                  value={cardPriority}
                  onChange={(e) => setCardPriority(e.target.value as any)}
                  className="w-full text-xs h-9 px-2 rounded-md border border-[#2a3346] bg-[#090c10] text-amber-100"
                >
                  <option value="baixa">Baixo (Aventureiros iniciantes)</option>
                  <option value="media">Médio (Grupo experiente)</option>
                  <option value="alta">Alto / Mortal (Chefes & Dragões)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Prazo da Campanha (Data limite)
              </label>
              <Input
                type="date"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
                className="text-xs h-9 bg-[#090c10] border-[#2a3346] text-amber-100"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between pt-2 border-t border-[#222938]">
            {editingCard ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleDeleteCard(editingCard.id)
                  setCardModalOpen(false)
                }}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              >
                Excluir Missão
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCardModalOpen(false)}
                className="text-xs border-[#2a3346] text-amber-200/70 hover:text-amber-100 hover:bg-[#18202e]"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveCard}
                className="text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold border border-amber-300/40"
              >
                {editingCard ? 'Salvar Contrato' : 'Afixar Missão'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

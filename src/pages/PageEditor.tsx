import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pagesService, PageRecord, PageBlock } from '@/services/pages'
import {
  Trash2,
  Star,
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
  CheckSquare,
  Square,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  List,
  Quote,
  AlertCircle,
  MoreVertical,
  Share2,
  Sparkles,
  Smile,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const BLOCK_TYPES = [
  { id: 'text', label: 'Texto simples', icon: AlignLeft },
  { id: 'heading_1', label: 'Título 1', icon: Heading1 },
  { id: 'heading_2', label: 'Título 2', icon: Heading2 },
  { id: 'heading_3', label: 'Título 3', icon: Heading3 },
  { id: 'todo', label: 'Tarefa / Checklist', icon: CheckSquare },
  { id: 'bullet', label: 'Lista com marcadores', icon: List },
  { id: 'quote', label: 'Citação', icon: Quote },
  { id: 'callout', label: 'Destaque / Aviso', icon: AlertCircle },
] as const

const EMOJI_OPTIONS = ['📝', '💡', '🚀', '📌', '🎯', '📚', '⚡', '✨', '☕', '📂', '🌱', '⭐']

export default function PageEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [page, setPage] = useState<PageRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('📝')
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Carregar dados da página
  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      try {
        const data = await pagesService.getById(id)
        setPage(data)
        setTitle(data.title || '')
        setIcon(data.icon || '📝')
        setBlocks(
          data.blocks && data.blocks.length > 0
            ? data.blocks
            : [{ id: 'b_' + Date.now(), type: 'text', content: '' }],
        )
        setIsFavorite(!!data.is_favorite)
      } catch (err) {
        console.error(err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  // Salvar alterações com debounce
  const triggerSave = async (
    newTitle = title,
    newIcon = icon,
    newBlocks = blocks,
    newFav = isFavorite,
  ) => {
    if (!id) return
    setIsSaving(true)
    try {
      await pagesService.update(id, {
        title: newTitle,
        icon: newIcon,
        blocks: newBlocks,
        is_favorite: newFav,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    triggerSave(val, icon, blocks, isFavorite)
  }

  const handleIconSelect = (eIcon: string) => {
    setIcon(eIcon)
    triggerSave(title, eIcon, blocks, isFavorite)
  }

  const handleToggleFavorite = () => {
    const next = !isFavorite
    setIsFavorite(next)
    triggerSave(title, icon, blocks, next)
  }

  const handleDeletePage = async () => {
    if (!id) return
    if (confirm('Tem certeza que deseja excluir esta página?')) {
      await pagesService.delete(id)
      navigate('/')
    }
  }

  // Manipulação de Blocos
  const handleBlockContentChange = (blockId: string, content: string) => {
    const updated = blocks.map((b) => (b.id === blockId ? { ...b, content } : b))
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  const handleToggleTodo = (blockId: string) => {
    const updated = blocks.map((b) => (b.id === blockId ? { ...b, checked: !b.checked } : b))
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  const handleChangeBlockType = (blockId: string, newType: PageBlock['type']) => {
    const updated = blocks.map((b) => (b.id === blockId ? { ...b, type: newType } : b))
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  const handleAddBlockAfter = (index: number, type: PageBlock['type'] = 'text') => {
    const newBlock: PageBlock = {
      id: 'b_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type,
      content: '',
      checked: false,
    }
    const updated = [...blocks]
    updated.splice(index + 1, 0, newBlock)
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= blocks.length) return
    const updated = [...blocks]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  const handleDeleteBlock = (blockId: string) => {
    if (blocks.length <= 1) {
      // Limpa o conteúdo em vez de excluir o único bloco
      const updated: PageBlock[] = [{ id: 'b_' + Date.now(), type: 'text', content: '' }]
      setBlocks(updated)
      triggerSave(title, icon, updated, isFavorite)
      return
    }
    const updated = blocks.filter((b) => b.id !== blockId)
    setBlocks(updated)
    triggerSave(title, icon, updated, isFavorite)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Carregando página...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-10 space-y-6">
      {/* Top Bar da Página */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Seletor de Emoji */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-2xl p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Alterar ícone"
              >
                {icon}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-2 grid grid-cols-4 gap-1 w-44">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => handleIconSelect(e)}
                  className="text-xl p-2 rounded hover:bg-slate-100 text-center transition-colors"
                >
                  {e}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs text-slate-400">
            {isSaving ? 'Salvando...' : 'Salvo na nuvem'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`h-8 px-2 text-xs ${
              isFavorite ? 'text-amber-500 font-medium' : 'text-slate-500'
            }`}
          >
            <Star className={`h-3.5 w-3.5 mr-1 ${isFavorite ? 'fill-amber-500' : ''}`} />
            {isFavorite ? 'Favorito' : 'Favoritar'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeletePage}
            className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Excluir página"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Título Principal */}
      <div className="space-y-1">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Sem título"
          className="w-full text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-1"
        />
      </div>

      {/* Editor em Blocos */}
      <div className="space-y-2 pt-2">
        {blocks.map((block, index) => {
          return (
            <div
              key={block.id}
              className="group relative flex items-start gap-1.5 rounded-lg py-1 px-1 -ml-1 transition-colors hover:bg-slate-50/70"
            >
              {/* Controles do Bloco (Drag / Reorder / Menu) */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 pt-1 text-slate-400 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-slate-400 hover:text-slate-700 p-0"
                  onClick={() => handleMoveBlock(index, 'up')}
                  disabled={index === 0}
                  title="Mover para cima"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-slate-400 hover:text-slate-700 p-0"
                  onClick={() => handleMoveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  title="Mover para baixo"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>

                {/* Seletor de Tipo de Bloco */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-slate-400 hover:text-slate-700 p-0"
                      title="Mudar tipo de bloco"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="text-xs w-48">
                    {BLOCK_TYPES.map((bt) => {
                      const Icon = bt.icon
                      return (
                        <DropdownMenuItem
                          key={bt.id}
                          onClick={() => handleChangeBlockType(block.id, bt.id as any)}
                          className={block.type === bt.id ? 'bg-slate-100 font-medium' : ''}
                        >
                          <Icon className="h-3.5 w-3.5 mr-2 text-slate-500" />
                          <span>{bt.label}</span>
                        </DropdownMenuItem>
                      )
                    })}
                    <div className="border-t border-slate-100 my-1" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-rose-600 focus:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      <span>Excluir bloco</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Conteúdo Renderizado do Bloco */}
              <div className="flex-1 min-w-0">
                {block.type === 'heading_1' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                    placeholder="Título 1"
                    className="w-full text-2xl font-bold text-slate-900 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBlockAfter(index, 'text')
                      }
                    }}
                  />
                )}

                {block.type === 'heading_2' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                    placeholder="Título 2"
                    className="w-full text-xl font-semibold text-slate-800 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBlockAfter(index, 'text')
                      }
                    }}
                  />
                )}

                {block.type === 'heading_3' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                    placeholder="Título 3"
                    className="w-full text-base font-semibold text-slate-800 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBlockAfter(index, 'text')
                      }
                    }}
                  />
                )}

                {block.type === 'todo' && (
                  <div className="flex items-start gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleToggleTodo(block.id)}
                      className="mt-1 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {block.checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Para fazer..."
                      className={`w-full text-sm text-slate-800 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5 ${
                        block.checked ? 'line-through text-slate-400' : ''
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddBlockAfter(index, 'todo')
                        }
                      }}
                    />
                  </div>
                )}

                {block.type === 'bullet' && (
                  <div className="flex items-start gap-2 pt-0.5">
                    <span className="text-slate-400 font-bold select-none mt-0.5 text-base leading-none">
                      •
                    </span>
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Item de lista..."
                      className="w-full text-sm text-slate-800 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddBlockAfter(index, 'bullet')
                        }
                      }}
                    />
                  </div>
                )}

                {block.type === 'quote' && (
                  <div className="border-l-2 border-slate-300 pl-3 py-1 my-0.5 italic text-slate-600">
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Escreva uma citação ou pensamento..."
                      className="w-full text-sm italic text-slate-700 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddBlockAfter(index, 'text')
                        }
                      }}
                    />
                  </div>
                )}

                {block.type === 'callout' && (
                  <div className="flex items-start gap-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 my-1 text-amber-900">
                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Nota importante ou lembrete..."
                      className="w-full text-sm text-amber-950 border-0 focus:outline-none placeholder:text-amber-400/80 bg-transparent py-0.5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddBlockAfter(index, 'text')
                        }
                      }}
                    />
                  </div>
                )}

                {block.type === 'text' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                    placeholder="Digite algo ou aperte Enter para criar nova linha..."
                    className="w-full text-sm text-slate-800 border-0 focus:outline-none placeholder:text-slate-300 bg-transparent py-0.5"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBlockAfter(index, 'text')
                      }
                    }}
                  />
                )}
              </div>

              {/* Botão rápido para adicionar bloco logo abaixo */}
              <button
                onClick={() => handleAddBlockAfter(index, 'text')}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 p-1 shrink-0 transition-opacity"
                title="Adicionar bloco abaixo"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Botão para adicionar bloco no final */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-slate-600 border-dashed hover:bg-slate-50 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar novo bloco</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="text-xs w-48">
            {BLOCK_TYPES.map((bt) => {
              const Icon = bt.icon
              return (
                <DropdownMenuItem
                  key={bt.id}
                  onClick={() => handleAddBlockAfter(blocks.length - 1, bt.id as any)}
                >
                  <Icon className="h-3.5 w-3.5 mr-2 text-slate-500" />
                  <span>{bt.label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-[11px] text-slate-400">
          Dica: Pressione <strong>Enter</strong> no final de uma linha para criar o próximo bloco
          automaticamente.
        </span>
      </div>
    </div>
  )
}

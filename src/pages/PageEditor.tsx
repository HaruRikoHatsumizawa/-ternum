import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppMode } from '@/contexts/ModeContext'
import { pagesService, PageRecord, PageBlock } from '@/services/pages'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import { RuneSwordIcon, RunicInsignia, RUNIC_INSIGNIA_CATALOG } from '@/components/rpg/EternumIcons'
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
  { id: 'text', label: 'Crônica / Cena Narrativa (RP)', icon: AlignLeft },
  { id: 'heading_1', label: 'Título Épico / Arco', icon: Heading1 },
  { id: 'heading_2', label: 'Seção de Perfil / Atributos (H2)', icon: Heading2 },
  { id: 'heading_3', label: 'Subseção de Perícias / Traços (H3)', icon: Heading3 },
  { id: 'todo', label: 'Habilidade / Meta de Cena', icon: CheckSquare },
  { id: 'bullet', label: 'Item / Vínculo de Personagem', icon: List },
  { id: 'quote', label: 'Citação / Fala & Diálogo (RP)', icon: Quote },
  { id: 'callout', label: 'Espécie, Classe ou Destaque', icon: AlertCircle },
] as const

export default function PageEditor() {
  const { id } = useParams<{ id: string }>()
  const { mode } = useAppMode()
  const navigate = useNavigate()
  const [page, setPage] = useState<PageRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('scroll')
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
        setIcon(data.icon || 'scroll')
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
      <EternumLoadingScreen
        message="Decifrando o tomo e suas crônicas..."
        submessage="Carregando anotações arcanas"
        fullScreen={false}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-10 space-y-6">
      {/* Top Bar da Página */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Seletor de Insígnia Rúnica Autoral */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2.5 rounded-xl bg-[#121620] border border-amber-500/30 hover:border-amber-500/60 shadow-md transition-all hover:scale-105 text-amber-300 flex items-center justify-center min-w-[48px] min-h-[48px]"
                title="Alterar insígnia rúnica da ficha"
              >
                <RunicInsignia name={icon} className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="p-2.5 grid grid-cols-4 gap-1.5 w-56 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
            >
              {RUNIC_INSIGNIA_CATALOG.map((item) => (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => handleIconSelect(item.id)}
                  className={`p-2 rounded text-center transition-colors border flex items-center justify-center ${
                    icon === item.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'border-transparent text-amber-400/80 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-200'
                  }`}
                >
                  <RunicInsignia name={item.id} className="w-5 h-5" />
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs font-fantasy text-amber-300/60">
            {isSaving ? 'Gravando no tomo sagrado...' : 'Tomo preservado'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`h-8 px-2 text-xs font-fantasy ${
              isFavorite
                ? 'text-amber-300 font-bold bg-amber-500/10'
                : 'text-amber-400/60 hover:text-amber-200'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 mr-1 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
            />
            {isFavorite ? 'Consagrada' : 'Consagrar (Favoritar)'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeletePage}
            className="h-8 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            title="Excluir crônica/ficha"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Título Principal Épico */}
      <div className="space-y-1">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Nome do Personagem (RPG/RP) ou Capítulo da Crônica..."
          className="w-full text-3xl sm:text-4xl font-fantasy font-bold tracking-tight text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-1"
        />
        <div className="flex items-center gap-2 text-xs text-amber-300/70 font-fantasy pt-1">
          <span>Formato Livre:</span>
          <span className="text-[#a8a090]">
            Atende Fichas de RPG (atributos, perícias), Fichas de RP (espécie, bio, relações) e
            Diários de Cenas. {mode === 'rp' ? '(Visual RP Ativo)' : '(Visual RPG Ativo)'}
          </span>
        </div>
      </div>

      {/* Editor em Blocos Estilizados de RPG */}
      <div className="space-y-2 pt-2">
        {blocks.map((block, index) => {
          return (
            <div
              key={block.id}
              className="group relative flex items-start gap-1.5 rounded-lg py-1.5 px-2 -ml-2 transition-colors hover:bg-[#121622]/80 border border-transparent hover:border-[#262f42]"
            >
              {/* Controles do Bloco (Drag / Reorder / Menu) */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 pt-1 text-amber-400/60 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 p-0"
                  onClick={() => handleMoveBlock(index, 'up')}
                  disabled={index === 0}
                  title="Mover para cima"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 p-0"
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
                      className="h-5 w-5 text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 p-0"
                      title="Mudar encantamento de bloco"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="text-xs w-56 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
                  >
                    {BLOCK_TYPES.map((bt) => {
                      const Icon = bt.icon
                      return (
                        <DropdownMenuItem
                          key={bt.id}
                          onClick={() => handleChangeBlockType(block.id, bt.id as any)}
                          className={
                            block.type === bt.id
                              ? 'bg-amber-500/20 font-medium text-amber-200'
                              : 'hover:bg-amber-500/10 cursor-pointer'
                          }
                        >
                          <Icon className="h-3.5 w-3.5 mr-2 text-amber-400" />
                          <span>{bt.label}</span>
                        </DropdownMenuItem>
                      )
                    })}
                    <div className="border-t border-[#262c3a] my-1" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-rose-400 focus:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      <span>Excluir anotação</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Conteúdo Renderizado do Bloco com visual Medieval */}
              <div className="flex-1 min-w-0">
                {block.type === 'heading_1' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                    placeholder="Título Épico (Capítulo)..."
                    className="w-full text-2xl font-fantasy font-bold text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-1 tracking-wide"
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
                    placeholder="Seção de Atributos (H2)..."
                    className="w-full text-xl font-fantasy font-semibold text-amber-200 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
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
                    placeholder="Subseção de Perícias (H3)..."
                    className="w-full text-base font-fantasy font-semibold text-amber-300/90 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
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
                      className="mt-1 text-amber-400 hover:text-amber-200 transition-colors"
                    >
                      {block.checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400 fill-emerald-950/40" />
                      ) : (
                        <Square className="h-4 w-4 text-amber-400/40" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Habilidade / Magia / Manobra..."
                      className={`w-full text-sm text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5 ${
                        block.checked ? 'line-through text-[#7d7568]' : ''
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
                    <RuneSwordIcon className="w-3.5 h-3.5 mode-accent-text shrink-0 mt-1" />
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Item de equipamento / estatística..."
                      className="w-full text-sm text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
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
                  <div className="border-l-2 border-amber-500/80 pl-3.5 py-1 my-0.5 italic text-amber-200/90 bg-amber-500/5 rounded-r">
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Palavras de oráculo, profecia ou fala de NPC..."
                      className="w-full text-sm italic font-serif text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
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
                  <div className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 my-1 text-amber-200">
                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      placeholder="Espécie / Raça, Classe, Nível, Biografia ou Nota de RP..."
                      className="w-full text-sm text-amber-100 border-0 focus:outline-none placeholder:text-amber-400/40 bg-transparent py-0.5 font-medium"
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
                    placeholder="Escreva a crônica da sessão ou pressione Enter..."
                    className="w-full text-sm text-amber-100 border-0 focus:outline-none placeholder:text-amber-200/30 bg-transparent py-0.5"
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
                className="opacity-0 group-hover:opacity-100 text-amber-400/50 hover:text-amber-300 p-1 shrink-0 transition-opacity"
                title="Adicionar anotação abaixo"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Botão para adicionar bloco no final */}
      <div className="pt-4 border-t border-[#262e40] flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-amber-300 border-dashed border-amber-500/30 bg-[#121620] hover:bg-[#18202d] gap-1.5 font-fantasy"
            >
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>Adicionar nova anotação</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="text-xs w-56 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
          >
            {BLOCK_TYPES.map((bt) => {
              const Icon = bt.icon
              return (
                <DropdownMenuItem
                  key={bt.id}
                  onClick={() => handleAddBlockAfter(blocks.length - 1, bt.id as any)}
                  className="hover:bg-amber-500/10 cursor-pointer"
                >
                  <Icon className="h-3.5 w-3.5 mr-2 text-amber-400" />
                  <span>{bt.label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-[11px] text-[#7d7568]">
          Dica: Pressione <strong>Enter</strong> no final de uma linha para criar a próxima anotação
          automaticamente.
        </span>
      </div>
    </div>
  )
}

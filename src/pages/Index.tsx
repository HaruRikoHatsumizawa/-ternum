import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { pagesService, PageRecord } from '@/services/pages'
import { boardsService, BoardRecord } from '@/services/boards'
import { databasesService, DatabaseRecord } from '@/services/databases'
import {
  FileText,
  Kanban,
  Table,
  Plus,
  Search,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function Index() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pages, setPages] = useState<PageRecord[]>([])
  const [boards, setBoards] = useState<BoardRecord[]>([])
  const [databases, setDatabases] = useState<DatabaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      try {
        const [p, b, d] = await Promise.all([
          pagesService.list(),
          boardsService.list(),
          databasesService.list(),
        ])
        setPages(p)
        setBoards(b)
        setDatabases(d)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  const handleCreatePage = async () => {
    try {
      const p = await pagesService.create({ title: 'Nova Página', icon: '📝' })
      navigate(`/pages/${p.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateBoard = async () => {
    try {
      const b = await boardsService.create({ name: 'Novo Quadro de Tarefas', icon: '📌' })
      navigate(`/boards/${b.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateDatabase = async () => {
    try {
      const d = await databasesService.create({ name: 'Nova Tabela de Dados', icon: '📊' })
      navigate(`/databases/${d.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const filteredPages = pages.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
  const filteredBoards = boards.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
  const filteredDatabases = databases.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  )

  const favoritePages = pages.filter((p) => p.is_favorite)

  // Estatísticas rápidas
  const totalTasks = boards.reduce((acc, b) => acc + (b.cards?.length || 0), 0)
  const completedTasks = boards.reduce(
    (acc, b) => acc + (b.cards?.filter((c) => c.columnId === 'done').length || 0),
    0,
  )
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8 space-y-10">
      {/* Boas-vindas e Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono bg-slate-900 text-white rounded-lg p-1.5 shadow-xs">
              N
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Olá, {user?.name || 'Amanda'} 👋
              </h1>
              <p className="text-xs text-slate-500">
                Seu espaço Notion Aprimorado: mais leve, direto e organizado.
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar nesta página..."
            className="pl-8 text-xs h-9 bg-slate-50/70 border-slate-200"
          />
        </div>
      </div>

      {/* Ações Rápidas em Destaque */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Criar Novo Item
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleCreatePage}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-900 block">Nova Página</span>
              <span className="text-xs text-slate-500 line-clamp-1">
                Anotações em blocos reordenáveis
              </span>
            </div>
            <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
          </button>

          <button
            onClick={handleCreateBoard}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Kanban className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-900 block">Quadro de Tarefas</span>
              <span className="text-xs text-slate-500 line-clamp-1">
                Kanban arrastável com progresso
              </span>
            </div>
            <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
          </button>

          <button
            onClick={handleCreateDatabase}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Table className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-900 block">Tabela de Dados</span>
              <span className="text-xs text-slate-500 line-clamp-1">Linhas, colunas e filtros</span>
            </div>
            <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
          </button>
        </div>
      </div>

      {/* Resumo de Progresso Geral */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-100/70 text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Progresso Geral de Tarefas</h3>
            <p className="text-xs text-slate-500">
              {completedTasks} de {totalTasks} tarefas concluídas nos seus quadros
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-900 font-mono">{taskProgress}%</span>
        </div>
      </div>

      {/* Páginas Favoritas */}
      {favoritePages.length > 0 && !search && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>Páginas Favoritas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {favoritePages.map((p) => (
              <Link
                key={p.id}
                to={`/pages/${p.id}`}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center gap-2.5"
              >
                <span className="text-xl">{p.icon || '📝'}</span>
                <span className="text-xs font-semibold text-slate-900 truncate flex-1">
                  {p.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Seção: Páginas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <FileText className="h-4 w-4 text-slate-500" />
            <span>Páginas ({filteredPages.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreatePage}
            className="text-xs h-7 text-slate-600 hover:text-slate-900"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Nova Página
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredPages.map((p) => (
            <Link
              key={p.id}
              to={`/pages/${p.id}`}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{p.icon || '📄'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {p.title || 'Sem título'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {p.blocks?.length || 0} blocos de conteúdo
                  </p>
                </div>
              </div>
              {p.is_favorite && <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />}
            </Link>
          ))}

          {filteredPages.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Nenhuma página encontrada.
            </div>
          )}
        </div>
      </div>

      {/* Seção: Quadros de Tarefas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Kanban className="h-4 w-4 text-slate-500" />
            <span>Quadros de Tarefas ({filteredBoards.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateBoard}
            className="text-xs h-7 text-slate-600 hover:text-slate-900"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Novo Quadro
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredBoards.map((b) => {
            const bCards = b.cards || []
            const bDone = bCards.filter((c) => c.columnId === 'done').length
            const bPct = bCards.length > 0 ? Math.round((bDone / bCards.length) * 100) : 0

            return (
              <Link
                key={b.id}
                to={`/boards/${b.id}`}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xl">{b.icon || '📌'}</span>
                    <span className="text-xs font-semibold text-slate-900 truncate">{b.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {bCards.length} tarefas
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Concluído</span>
                    <span className="font-semibold text-slate-800">{bPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${bPct}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}

          {filteredBoards.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Nenhum quadro de tarefas encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Seção: Tabelas / Banco de Dados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Table className="h-4 w-4 text-slate-500" />
            <span>Tabelas de Dados ({filteredDatabases.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateDatabase}
            className="text-xs h-7 text-slate-600 hover:text-slate-900"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Nova Tabela
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredDatabases.map((d) => (
            <Link
              key={d.id}
              to={`/databases/${d.id}`}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{d.icon || '📊'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{d.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {d.rows?.length || 0} linhas • {d.columns?.length || 0} colunas
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
            </Link>
          ))}

          {filteredDatabases.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              Nenhuma tabela de dados encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

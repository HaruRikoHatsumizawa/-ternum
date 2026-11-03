import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { pagesService, PageRecord } from '@/services/pages'
import { boardsService, BoardRecord } from '@/services/boards'
import { databasesService, DatabaseRecord } from '@/services/databases'
import {
  FileText,
  Kanban,
  Table,
  Settings as SettingsIcon,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Star,
  LogOut,
  FolderOpen,
  Home,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import pb from '@/lib/pocketbase/client'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pages, setPages] = useState<PageRecord[]>([])
  const [boards, setBoards] = useState<BoardRecord[]>([])
  const [databases, setDatabases] = useState<DatabaseRecord[]>([])

  const [pagesExpanded, setPagesExpanded] = useState(true)
  const [boardsExpanded, setBoardsExpanded] = useState(true)
  const [dbsExpanded, setDbsExpanded] = useState(true)

  // Busca rápida (Command/Search modal)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadNavData = async () => {
    if (!user) return
    try {
      const [pList, bList, dList] = await Promise.all([
        pagesService.list(),
        boardsService.list(),
        databasesService.list(),
      ])
      setPages(pList)
      setBoards(bList)
      setDatabases(dList)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadNavData()
  }, [user, location.pathname])

  // Atalho de teclado para busca (Ctrl+K ou Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCreateNewPage = async () => {
    try {
      const newPage = await pagesService.create({ title: 'Nova Página', icon: '📝' })
      navigate(`/pages/${newPage.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateNewBoard = async () => {
    try {
      const newBoard = await boardsService.create({ name: 'Novo Quadro', icon: '📌' })
      navigate(`/boards/${newBoard.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateNewDatabase = async () => {
    try {
      const newDb = await databasesService.create({ name: 'Nova Tabela', icon: '📊' })
      navigate(`/databases/${newDb.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const userAvatarUrl = user?.avatar
    ? pb.files.getUrl(user, user.avatar, { thumb: '64x64' })
    : undefined

  // Filtros de busca
  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredDatabases = databases.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 antialiased overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200/80 bg-slate-50/80 backdrop-blur transition-all duration-200 ease-in-out md:static ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0'
        }`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full w-64">
            {/* Header do Usuário */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200/60">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors text-left max-w-[200px]">
                    <Avatar className="h-7 w-7 rounded-md border border-slate-300">
                      {userAvatarUrl ? <AvatarImage src={userAvatarUrl} /> : null}
                      <AvatarFallback className="text-xs font-semibold bg-slate-800 text-white rounded-md">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {user?.name || 'Meu Espaço'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate">Notion Aprimorado</span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 text-xs">
                  <DropdownMenuLabel className="font-normal text-slate-500 text-[11px]">
                    Conectado como <strong className="text-slate-800">{user?.email}</strong>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <SettingsIcon className="mr-2 h-3.5 w-3.5" /> Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-rose-600 focus:text-rose-600">
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Sair da conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-slate-700 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Ações Rápidas */}
            <div className="px-2 pt-2 pb-1 space-y-0.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span className="flex-1 text-left">Buscar</span>
                <kbd className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded">
                  ⌘K
                </kbd>
              </button>

              <Link
                to="/"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/'
                    ? 'bg-slate-200/70 text-slate-900 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Home className="h-3.5 w-3.5 text-slate-500" />
                <span>Início</span>
              </Link>
            </div>

            {/* Listas de Seções */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs">
              {/* Páginas */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-slate-400 hover:text-slate-600 group">
                  <button
                    onClick={() => setPagesExpanded(!pagesExpanded)}
                    className="flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider"
                  >
                    {pagesExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    Páginas ({pages.length})
                  </button>
                  <button
                    onClick={handleCreateNewPage}
                    title="Criar nova página"
                    className="opacity-0 group-hover:opacity-100 hover:text-slate-900 p-0.5 rounded transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {pagesExpanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {pages.map((p) => {
                      const isActive = location.pathname === `/pages/${p.id}`
                      return (
                        <Link
                          key={p.id}
                          to={`/pages/${p.id}`}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate ${
                            isActive
                              ? 'bg-slate-200/80 font-medium text-slate-900'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{p.icon || '📄'}</span>
                          <span className="truncate">{p.title || 'Sem título'}</span>
                          {p.is_favorite && (
                            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500 ml-auto shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                    {pages.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-slate-400 italic">Nenhuma página</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quadros de Tarefas */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-slate-400 hover:text-slate-600 group">
                  <button
                    onClick={() => setBoardsExpanded(!boardsExpanded)}
                    className="flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider"
                  >
                    {boardsExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    Tarefas ({boards.length})
                  </button>
                  <button
                    onClick={handleCreateNewBoard}
                    title="Criar novo quadro"
                    className="opacity-0 group-hover:opacity-100 hover:text-slate-900 p-0.5 rounded transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {boardsExpanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {boards.map((b) => {
                      const isActive = location.pathname === `/boards/${b.id}`
                      return (
                        <Link
                          key={b.id}
                          to={`/boards/${b.id}`}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate ${
                            isActive
                              ? 'bg-slate-200/80 font-medium text-slate-900'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{b.icon || '📌'}</span>
                          <span className="truncate">{b.name || 'Quadro sem nome'}</span>
                        </Link>
                      )
                    })}
                    {boards.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-slate-400 italic">Nenhum quadro</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tabelas / Bancos de Dados */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-slate-400 hover:text-slate-600 group">
                  <button
                    onClick={() => setDbsExpanded(!dbsExpanded)}
                    className="flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider"
                  >
                    {dbsExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    Tabelas ({databases.length})
                  </button>
                  <button
                    onClick={handleCreateNewDatabase}
                    title="Criar nova tabela"
                    className="opacity-0 group-hover:opacity-100 hover:text-slate-900 p-0.5 rounded transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {dbsExpanded && (
                  <div className="space-y-0.5 mt-0.5">
                    {databases.map((d) => {
                      const isActive = location.pathname === `/databases/${d.id}`
                      return (
                        <Link
                          key={d.id}
                          to={`/databases/${d.id}`}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate ${
                            isActive
                              ? 'bg-slate-200/80 font-medium text-slate-900'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{d.icon || '📊'}</span>
                          <span className="truncate">{d.name || 'Tabela sem nome'}</span>
                        </Link>
                      )
                    })}
                    {databases.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-slate-400 italic">Nenhuma tabela</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer da Sidebar */}
            <div className="p-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
              >
                <SettingsIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Configurações</span>
              </Link>

              <button
                onClick={handleCreateNewPage}
                title="Novo Item Rápido"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors flex items-center gap-1 text-[11px] font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Novo</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white">
        {/* Barra Superior Simples */}
        <header className="h-11 border-b border-slate-100 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="h-7 text-xs text-slate-500 hover:text-slate-800 border-slate-200 px-2.5 gap-1.5 hidden sm:flex"
            >
              <Search className="h-3 w-3" />
              <span>Buscar...</span>
              <kbd className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-1 py-0.2 rounded ml-1">
                ⌘K
              </kbd>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white gap-1 px-2.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Criar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs w-44">
                <DropdownMenuItem onClick={handleCreateNewPage}>
                  <FileText className="mr-2 h-3.5 w-3.5 text-slate-500" /> Nova Página
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateNewBoard}>
                  <Kanban className="mr-2 h-3.5 w-3.5 text-slate-500" /> Novo Quadro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateNewDatabase}>
                  <Table className="mr-2 h-3.5 w-3.5 text-slate-500" /> Nova Tabela
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Área de Visualização com Scroll */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Modal de Busca Global */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
          <div className="flex items-center px-3 border-b border-slate-100">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar páginas, quadros e tabelas..."
              className="border-0 focus-visible:ring-0 text-sm py-3 px-0 shadow-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
            {/* Resultados de Páginas */}
            {filteredPages.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Páginas
                </p>
                <div className="space-y-0.5">
                  {filteredPages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/pages/${p.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-left transition-colors"
                    >
                      <span className="text-base">{p.icon || '📄'}</span>
                      <span className="font-medium text-slate-800 truncate">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Quadros */}
            {filteredBoards.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Quadros de Tarefas
                </p>
                <div className="space-y-0.5">
                  {filteredBoards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/boards/${b.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-left transition-colors"
                    >
                      <span className="text-base">{b.icon || '📌'}</span>
                      <span className="font-medium text-slate-800 truncate">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Tabelas */}
            {filteredDatabases.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Tabelas de Dados
                </p>
                <div className="space-y-0.5">
                  {filteredDatabases.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/databases/${d.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-left transition-colors"
                    >
                      <span className="text-base">{d.icon || '📊'}</span>
                      <span className="font-medium text-slate-800 truncate">{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery &&
              filteredPages.length === 0 &&
              filteredBoards.length === 0 &&
              filteredDatabases.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-sm">Nenhum resultado encontrado para "{searchQuery}"</p>
                  <p className="text-xs mt-1">Tente buscar por outro termo.</p>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

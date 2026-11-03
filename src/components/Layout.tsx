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
  Calendar,
  Flame,
  Users,
  Bot,
} from 'lucide-react'
import {
  RunicCircle,
  DragonSilhouette,
  CrestShield,
  RunicPawIcon,
} from '@/components/rpg/RpgArtwork'
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
    <div className="flex h-screen w-full bg-[#0c0f14] text-[#f1ede3] antialiased overflow-hidden font-sans">
      {/* Sidebar - Grimório Medieval */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#262c3a] bg-[#090c10]/95 backdrop-blur-md transition-all duration-200 ease-in-out md:static ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0'
        }`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full w-64">
            {/* Header do Usuário - Perfil do Aventureiro / Mestre */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-[#262c3a]/80 bg-gradient-to-r from-[#121620] to-[#090c10]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1a2130] transition-colors text-left max-w-[200px] border border-amber-500/20">
                    <Avatar className="h-7 w-7 rounded-md border border-amber-500/40 shadow-sm shadow-amber-950">
                      {userAvatarUrl ? <AvatarImage src={userAvatarUrl} /> : null}
                      <AvatarFallback className="text-xs font-fantasy font-bold bg-amber-500/20 text-amber-300 rounded-md">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-amber-100 truncate flex items-center gap-1">
                        {user?.name || 'Mestre da Mesa'}
                        <RunicPawIcon className="w-3 h-3 text-amber-400/70 shrink-0 inline" />
                      </span>
                      <span className="text-[10px] text-amber-400/70 font-fantasy truncate">
                        Éternum • RPG & RP
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-amber-400/60 ml-auto shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 text-xs bg-[#121620] border-[#2c3444] text-[#f1ede3]"
                >
                  <DropdownMenuLabel className="font-normal text-amber-200/70 text-[11px]">
                    Aventureiro: <strong className="text-amber-300">{user?.email}</strong>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#262c3a]" />
                  <DropdownMenuItem
                    onClick={() => navigate('/settings')}
                    className="hover:bg-amber-500/10 focus:bg-amber-500/10 text-amber-100"
                  >
                    <SettingsIcon className="mr-2 h-3.5 w-3.5 text-amber-400" /> Santuário & Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#262c3a]" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-rose-400 focus:text-rose-300 hover:bg-rose-950/30"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Deixar o Reino (Sair)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-amber-300/60 hover:text-amber-200 hover:bg-amber-500/10 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Ações Rápidas */}
            <div className="px-2 pt-2.5 pb-1 space-y-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d] rounded-md transition-colors border border-transparent hover:border-amber-500/20"
              >
                <Search className="h-3.5 w-3.5 text-amber-400/70" />
                <span className="flex-1 text-left font-medium">Consultar Oráculo</span>
                <kbd className="text-[10px] font-mono text-amber-300/70 bg-[#121620] border border-amber-500/30 px-1 py-0.2 rounded">
                  ⌘K
                </kbd>
              </button>

              <Link
                to="/"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/'
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-xs'
                    : 'text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d]'
                }`}
              >
                <Home className="h-3.5 w-3.5 text-amber-400" />
                <span>Salão Principal</span>
              </Link>

              <Link
                to="/sessions"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/sessions'
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-xs'
                    : 'text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Calendário de Sessões</span>
              </Link>

              <Link
                to="/loot"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/loot'
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-xs'
                    : 'text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d]'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Forja do Tesouro (Loot)</span>
              </Link>

              <Link
                to="/npcs"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/npcs'
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-xs'
                    : 'text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d]'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>Fichas de NPCs</span>
              </Link>

              <Link
                to="/oracle"
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/oracle'
                    ? 'bg-purple-950/40 text-purple-200 font-semibold border border-purple-500/40 shadow-xs'
                    : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                }`}
              >
                <Bot className="h-3.5 w-3.5 text-purple-400" />
                <span className="flex-1">Oráculo de Éternum</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-fantasy">
                  IA
                </span>
              </Link>
            </div>

            {/* Listas de Seções com visual de Tomo */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs">
              {/* Personagens & Crônicas (Páginas) */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                  <button
                    onClick={() => setPagesExpanded(!pagesExpanded)}
                    className="flex items-center gap-1 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                  >
                    {pagesExpanded ? (
                      <ChevronDown className="h-3 w-3 text-amber-400" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-amber-400" />
                    )}
                    Fichas & Crônicas ({pages.length})
                  </button>
                  <button
                    onClick={handleCreateNewPage}
                    title="Forjar nova ficha / crônica"
                    className="opacity-0 group-hover:opacity-100 hover:text-amber-300 p-0.5 rounded transition-opacity text-amber-400"
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
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate border ${
                            isActive
                              ? 'bg-amber-500/15 font-medium text-amber-200 border-amber-500/30 shadow-xs'
                              : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d] border-transparent'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{p.icon || '⚔️'}</span>
                          <span className="truncate">{p.title || 'Ficha Sem Título'}</span>
                          {p.is_favorite && (
                            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400 ml-auto shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                    {pages.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                        Nenhuma crônica forjada
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Murais de Missões (Quadros) */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                  <button
                    onClick={() => setBoardsExpanded(!boardsExpanded)}
                    className="flex items-center gap-1 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                  >
                    {boardsExpanded ? (
                      <ChevronDown className="h-3 w-3 text-amber-400" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-amber-400" />
                    )}
                    Mural de Missões ({boards.length})
                  </button>
                  <button
                    onClick={handleCreateNewBoard}
                    title="Adicionar mural de missões"
                    className="opacity-0 group-hover:opacity-100 hover:text-amber-300 p-0.5 rounded transition-opacity text-amber-400"
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
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate border ${
                            isActive
                              ? 'bg-amber-500/15 font-medium text-amber-200 border-amber-500/30 shadow-xs'
                              : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d] border-transparent'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{b.icon || '🛡️'}</span>
                          <span className="truncate">{b.name || 'Mural de Missões'}</span>
                        </Link>
                      )
                    })}
                    {boards.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                        Nenhum mural de missões
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Códices & Arquivos da Mesa (Tabelas) */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                  <button
                    onClick={() => setDbsExpanded(!dbsExpanded)}
                    className="flex items-center gap-1 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                  >
                    {dbsExpanded ? (
                      <ChevronDown className="h-3 w-3 text-amber-400" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-amber-400" />
                    )}
                    Códices & Bestiários ({databases.length})
                  </button>
                  <button
                    onClick={handleCreateNewDatabase}
                    title="Novo Códice Arcano"
                    className="opacity-0 group-hover:opacity-100 hover:text-amber-300 p-0.5 rounded transition-opacity text-amber-400"
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
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors truncate border ${
                            isActive
                              ? 'bg-amber-500/15 font-medium text-amber-200 border-amber-500/30 shadow-xs'
                              : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d] border-transparent'
                          }`}
                        >
                          <span className="shrink-0 text-sm">{d.icon || '🐉'}</span>
                          <span className="truncate">{d.name || 'Códice Sem Nome'}</span>
                        </Link>
                      )
                    })}
                    {databases.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                        Nenhum códice registrado
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer da Sidebar */}
            <div className="p-2 border-t border-[#262c3a] bg-[#090c10] flex items-center justify-between text-xs">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2 py-1.5 text-amber-200/70 hover:text-amber-200 hover:bg-[#18202d] rounded-md transition-colors"
              >
                <SettingsIcon className="h-3.5 w-3.5 text-amber-400" />
                <span>Santuário</span>
              </Link>

              <button
                onClick={handleCreateNewPage}
                title="Novo Item Rápido"
                className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-500/10 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold border border-amber-500/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Forjar</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#0c0f14]">
        {/* Barra Superior Dark Fantasy */}
        <header className="h-12 border-b border-[#262c3a] bg-[#0f131a]/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-fantasy text-amber-300/80">
              <RunicCircle className="h-4 w-4 text-amber-400" />
              <span className="font-bold tracking-wide">Éternum — Grimório de RPG & RP</span>
              <RunicPawIcon className="h-3.5 w-3.5 text-amber-400/60" />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="h-7 text-xs text-amber-200/80 hover:text-amber-100 bg-[#141923] border-[#2c3547] hover:border-amber-500/40 px-2.5 gap-1.5 hidden sm:flex"
            >
              <Search className="h-3 w-3 text-amber-400" />
              <span>Consultar Oráculo...</span>
              <kbd className="text-[9px] font-mono text-amber-400/80 bg-[#0c0f14] border border-amber-500/30 px-1 py-0.2 rounded ml-1">
                ⌘K
              </kbd>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold gap-1 px-3 border border-amber-300/40 shadow-sm shadow-amber-950"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Forjar Item</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="text-xs w-48 bg-[#121620] border-[#2c3444] text-[#f1ede3]"
              >
                <DropdownMenuItem
                  onClick={handleCreateNewPage}
                  className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                >
                  <FileText className="mr-2 h-3.5 w-3.5 text-amber-400" /> Nova Ficha / Crônica
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCreateNewBoard}
                  className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                >
                  <Kanban className="mr-2 h-3.5 w-3.5 text-amber-400" /> Novo Mural de Missões
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCreateNewDatabase}
                  className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                >
                  <Table className="mr-2 h-3.5 w-3.5 text-amber-400" /> Novo Códice Arcano
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

      {/* Modal de Busca Global / Oráculo */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <div className="flex items-center px-3 border-b border-[#262c3a] bg-[#161b26]">
            <Search className="h-4 w-4 text-amber-400 mr-2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nas fichas, missões, monstros ou itens..."
              className="border-0 focus-visible:ring-0 text-sm py-3 px-0 shadow-none bg-transparent text-amber-100 placeholder:text-amber-200/40"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-400/60 hover:text-amber-300"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
            {/* Resultados de Fichas/Crônicas */}
            {filteredPages.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80">
                  Fichas & Crônicas
                </p>
                <div className="space-y-0.5">
                  {filteredPages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/pages/${p.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-amber-500/10 text-left transition-colors text-amber-100"
                    >
                      <span className="text-base">{p.icon || '⚔️'}</span>
                      <span className="font-medium truncate">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Murais de Missões */}
            {filteredBoards.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80">
                  Murais de Missões
                </p>
                <div className="space-y-0.5">
                  {filteredBoards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/boards/${b.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-amber-500/10 text-left transition-colors text-amber-100"
                    >
                      <span className="text-base">{b.icon || '🛡️'}</span>
                      <span className="font-medium truncate">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Códices */}
            {filteredDatabases.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80">
                  Códices & Bestiários
                </p>
                <div className="space-y-0.5">
                  {filteredDatabases.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/databases/${d.id}`)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-amber-500/10 text-left transition-colors text-amber-100"
                    >
                      <span className="text-base">{d.icon || '🐉'}</span>
                      <span className="font-medium truncate">{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery &&
              filteredPages.length === 0 &&
              filteredBoards.length === 0 &&
              filteredDatabases.length === 0 && (
                <div className="py-8 text-center text-amber-200/50">
                  <p className="text-sm">
                    Nenhum registro encontrado no oráculo para "{searchQuery}"
                  </p>
                  <p className="text-xs mt-1">Verifique o tomo ou tente novos encantamentos.</p>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

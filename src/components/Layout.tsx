import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useAppMode, AppMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { LanguageSwitcher } from '@/components/rpg/LanguageSwitcher'
import { AvatarFrame } from '@/components/rpg/AvatarFrame'
import { pagesService, PageRecord } from '@/services/pages'
import { boardsService, BoardRecord } from '@/services/boards'
import { databasesService, DatabaseRecord } from '@/services/databases'
import {
  FileText,
  Kanban,
  Table,
  Plus,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Star,
  LogOut,
} from 'lucide-react'
import {
  RunicCircle,
  DragonSilhouette,
  CrestShield,
  RunicPawIcon,
} from '@/components/rpg/RpgArtwork'
import {
  RuneCrestIcon,
  RuneScrollIcon,
  RuneSwordIcon,
  RuneCombatIcon,
  RuneTomeIcon,
  RuneAstrolabeIcon,
  RuneHammerIcon,
  RuneNpcIcon,
  RuneOracleIcon,
  RuneGearIcon,
  RuneSearchIcon,
  RuneLexiconIcon,
  RuneCompendiumIcon,
  RuneNerdIcon,
  RunicInsignia,
} from '@/components/rpg/EternumIcons'
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
  const { mode, setMode } = useAppMode()
  const { t } = useLanguage()
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
      const defaultMode = mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral'
      const newPage = await pagesService.create({
        title: mode === 'rp' ? 'Nova Crônica' : 'Nova Ficha',
        icon: 'scroll',
        target_mode: defaultMode,
      })
      navigate(`/pages/${newPage.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateNewBoard = async () => {
    try {
      const defaultMode = mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral'
      const newBoard = await boardsService.create({
        name: mode === 'rp' ? 'Nova Trama / Capítulo' : 'Novo Mural de Missões',
        icon: 'sword',
        target_mode: defaultMode,
      })
      navigate(`/boards/${newBoard.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateNewDatabase = async () => {
    try {
      const defaultMode = mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral'
      const newDb = await databasesService.create({
        name: mode === 'rp' ? 'Novo Registro Narrativo' : 'Novo Códice Arcano',
        icon: 'tome',
        target_mode: defaultMode,
      })
      navigate(`/databases/${newDb.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const userAvatarUrl = user?.avatar
    ? pb.files.getUrl(user, user.avatar, { thumb: '64x64' })
    : undefined

  // Filtro de exibição conforme o modo do app:
  // No modo 'geral': tudo é visível (itens de RPG, RP e Geral)
  // No modo 'rpg': apenas itens com target_mode 'rpg' ou 'geral' (ou indefinido)
  // No modo 'rp': apenas itens com target_mode 'rp' ou 'geral' (ou indefinido)
  const visiblePages = pages.filter((p) => {
    if (mode === 'geral') return true
    if (!p.target_mode || p.target_mode === 'geral') return true
    return p.target_mode === mode
  })

  // No modo 'rp', murais táticos/quests não aparecem se foram marcados para RPG;
  // e se o modo for RPG, só aparecem quadros de RPG ou geral.
  const visibleBoards = boards.filter((b) => {
    if (mode === 'geral') return true
    if (!b.target_mode || b.target_mode === 'geral') return true
    return b.target_mode === mode
  })

  const visibleDatabases = databases.filter((d) => {
    if (mode === 'geral') return true
    if (!d.target_mode || d.target_mode === 'geral') return true
    return d.target_mode === mode
  })

  // Filtros de busca (respeitando o modo ativo e filtrando por texto)
  const filteredPages = visiblePages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredBoards = visibleBoards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredDatabases = visibleDatabases.filter((d) =>
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
                  <button className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#1a2130] transition-colors text-left max-w-[200px] border mode-accent-border">
                    <AvatarFrame frameId={user?.pfp_frame || 'runic-gold'} size="sm">
                      <Avatar className="h-full w-full rounded-full">
                        {userAvatarUrl ? <AvatarImage src={userAvatarUrl} /> : null}
                        <AvatarFallback className="text-xs font-fantasy font-bold mode-accent-bg mode-accent-text">
                          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                        </AvatarFallback>
                      </Avatar>
                    </AvatarFrame>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-amber-100 truncate flex items-center gap-1">
                        {user?.name || 'Mestre da Mesa'}
                        <RunicPawIcon className="w-3 h-3 mode-accent-text shrink-0 inline opacity-80" />
                      </span>
                      <span className="text-[10px] mode-accent-text font-fantasy truncate opacity-90">
                        {mode === 'rp'
                          ? 'Éternum • Modo RP (Nobre)'
                          : mode === 'rpg'
                            ? 'Éternum • Modo RPG (Ouro)'
                            : 'Éternum • Modo Geral (Tudo)'}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 mode-accent-text ml-auto shrink-0 opacity-70" />
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
                    <RuneGearIcon className="mr-2 h-3.5 w-3.5 text-amber-400" />{' '}
                    {t('nav.sanctuary')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#262c3a]" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-rose-400 focus:text-rose-300 hover:bg-rose-950/30"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" /> {t('nav.logout')}
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
            <div className="px-2 pt-2.5 pb-1 space-y-2">
              {/* Controles de Idioma da Interface - Posicionados ACIMA da Busca Rápida (⌘K) */}
              <LanguageSwitcher variant="sidebar" />

              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#d1c8b8] hover:text-amber-200 hover:bg-[#18202d] rounded-md transition-colors border border-transparent hover:border-amber-500/20 group"
              >
                <RuneSearchIcon className="h-3.5 w-3.5 text-amber-400/80 group-hover:text-amber-300" />
                <span className="flex-1 text-left font-medium">{t('nav.quickSearch')}</span>
                <kbd className="text-[10px] font-mono text-amber-300/70 bg-[#121620] border border-amber-500/30 px-1 py-0.2 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* NAVEGAÇÃO DA SIDEBAR CONFORME O MODO ATIVO: GERAL / RPG / RP */}
              {mode === 'geral' && (
                <>
                  <Link
                    to="/"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneCrestIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.overview')}</span>
                  </Link>

                  {/* Bloco Tático RPG */}
                  <div className="pt-2">
                    <div className="px-2 pb-1 text-[9px] font-fantasy uppercase tracking-wider text-amber-400/80 font-bold flex items-center gap-1">
                      <RuneSwordIcon className="w-3 h-3 text-amber-400" />
                      <span>Módulos RPG (Tática)</span>
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        to="/combat"
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          location.pathname === '/combat'
                            ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                            : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d]'
                        }`}
                      >
                        <RuneCombatIcon className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{t('nav.tacticalCombat')}</span>
                      </Link>
                      <Link
                        to="/npcs"
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          location.pathname === '/npcs'
                            ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                            : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d]'
                        }`}
                      >
                        <RuneNpcIcon className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{t('nav.npcCompendium')}</span>
                      </Link>
                      <Link
                        to="/sessions"
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          location.pathname === '/sessions'
                            ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                            : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d]'
                        }`}
                      >
                        <RuneAstrolabeIcon className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{t('nav.sessionsCalendar')}</span>
                      </Link>
                      <Link
                        to="/loot"
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          location.pathname === '/loot'
                            ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                            : 'text-[#c8c0b0] hover:text-amber-100 hover:bg-[#18202d]'
                        }`}
                      >
                        <RuneHammerIcon className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{t('nav.lootForge')}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Bloco Narrativo RP */}
                  <div className="pt-2">
                    <div className="px-2 pb-1 text-[9px] font-fantasy uppercase tracking-wider text-purple-400/90 font-bold flex items-center gap-1">
                      <RuneScrollIcon className="w-3 h-3 text-purple-400" />
                      <span>Módulos RP (Narrativa)</span>
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        to="/npcs"
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors text-[#c8c0b0] hover:text-purple-200 hover:bg-[#18202d]"
                      >
                        <RuneNpcIcon className="h-3 w-3 text-purple-400 shrink-0" />
                        <span>{t('nav.rpCharacters')}</span>
                      </Link>
                      <Link
                        to="/sessions"
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors text-[#c8c0b0] hover:text-purple-200 hover:bg-[#18202d]"
                      >
                        <RuneAstrolabeIcon className="h-3 w-3 text-purple-400 shrink-0" />
                        <span>{t('nav.sessionsCalendar')}</span>
                      </Link>
                    </div>
                  </div>

                  <Link
                    to="/oracle"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors mt-2 ${
                      location.pathname === '/oracle'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneOracleIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.oracleAi')}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-fantasy">
                      IA
                    </span>
                  </Link>

                  <Link
                    to="/compendium"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/compendium'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneCompendiumIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.compendium')}</span>
                  </Link>

                  <Link
                    to="/glossary"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/glossary' &&
                      !location.search.includes('categoria=nerd')
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneLexiconIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.glossary')}</span>
                  </Link>

                  <Link
                    to="/glossary?categoria=nerd"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/glossary' &&
                      location.search.includes('categoria=nerd')
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneNerdIcon className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span className="flex-1">{t('nav.nerdDictionary')}</span>
                  </Link>
                </>
              )}

              {mode === 'rpg' && (
                /* Modo RPG estrito: APENAS módulos e recursos de RPG e tática */
                <>
                  <Link
                    to="/"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneSwordIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.overview')}</span>
                  </Link>

                  <Link
                    to="/combat"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/combat'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneCombatIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.tacticalCombat')}</span>
                  </Link>

                  <Link
                    to="/npcs"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/npcs'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneNpcIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.npcCompendium')}</span>
                  </Link>

                  <Link
                    to="/sessions"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/sessions'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneAstrolabeIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.sessionsCalendar')}</span>
                  </Link>

                  <Link
                    to="/loot"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/loot'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneHammerIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.lootForge')}</span>
                  </Link>

                  <Link
                    to="/oracle"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/oracle'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneOracleIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.oracleAi')}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-fantasy">
                      IA
                    </span>
                  </Link>

                  <Link
                    to="/compendium"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/compendium'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneCompendiumIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.compendium')}</span>
                  </Link>

                  <Link
                    to="/glossary"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/glossary' &&
                      !location.search.includes('categoria=nerd')
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneLexiconIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.glossary')}</span>
                  </Link>

                  <Link
                    to="/glossary?categoria=nerd"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/glossary' &&
                      location.search.includes('categoria=nerd')
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-amber-100 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneNerdIcon className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span className="flex-1">{t('nav.nerdDictionary')}</span>
                  </Link>
                </>
              )}

              {mode === 'rp' && (
                /* Modo RP estrito: APENAS narrativa, cenas e corte. Módulos táticos (Loot/Missões táticas) ficam ocultos */
                <>
                  <Link
                    to="/"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneScrollIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.narrativeHall')}</span>
                  </Link>

                  <Link
                    to="/npcs"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/npcs'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneNpcIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.rpCharacters')}</span>
                  </Link>

                  <Link
                    to="/sessions"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/sessions'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneAstrolabeIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span>{t('nav.sessionsCalendar')}</span>
                  </Link>

                  <Link
                    to="/oracle"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/oracle'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneOracleIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.oracleAi')}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-fantasy">
                      IA
                    </span>
                  </Link>

                  <Link
                    to="/compendium"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/compendium'
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneCompendiumIcon className="h-3.5 w-3.5 mode-accent-text shrink-0" />
                    <span className="flex-1">{t('nav.compendium')}</span>
                  </Link>

                  <Link
                    to="/glossary?categoria=nerd"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === '/glossary' &&
                      location.search.includes('categoria=nerd')
                        ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border shadow-xs'
                        : 'text-[#d1c8b8] hover:text-purple-200 hover:bg-[#18202d]'
                    }`}
                  >
                    <RuneNerdIcon className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span className="flex-1">{t('nav.nerdDictionary')}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Listas de Seções com visual de Tomo */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs">
              {/* Personagens & Crônicas (Páginas) */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                  <button
                    onClick={() => setPagesExpanded(!pagesExpanded)}
                    className="flex items-center gap-1.5 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                  >
                    <RuneScrollIcon className="h-3.5 w-3.5 mode-accent-text" />
                    <span>
                      {mode === 'rp'
                        ? `Crônicas & Diários (${visiblePages.length})`
                        : mode === 'rpg'
                          ? `Fichas de RPG (${visiblePages.length})`
                          : `Fichas & Crônicas (${visiblePages.length})`}
                    </span>
                    {pagesExpanded ? (
                      <ChevronDown className="h-3 w-3 text-amber-400/70 ml-0.5" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-amber-400/70 ml-0.5" />
                    )}
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
                    {visiblePages.map((p) => {
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
                          <RunicInsignia
                            name={p.icon || 'scroll'}
                            className="w-3.5 h-3.5 text-amber-400 shrink-0"
                          />
                          <span className="truncate flex-1">{p.title || 'Ficha Sem Título'}</span>
                          {mode === 'geral' && p.target_mode && (
                            <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono opacity-60 border border-white/10 shrink-0">
                              {p.target_mode}
                            </span>
                          )}
                          {p.is_favorite && (
                            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400 ml-1 shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                    {visiblePages.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                        Nenhuma crônica forjada neste modo
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Murais de Missões / Tramas (Exibidos em Geral e RPG; em RP apenas se houver quadros específicos de RP/Geral) */}
              {(mode !== 'rp' || visibleBoards.length > 0) && (
                <div>
                  <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                    <button
                      onClick={() => setBoardsExpanded(!boardsExpanded)}
                      className="flex items-center gap-1.5 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                    >
                      <RuneSwordIcon className="h-3.5 w-3.5 mode-accent-text" />
                      <span>
                        {mode === 'rp'
                          ? `Tramas & Capítulos (${visibleBoards.length})`
                          : mode === 'rpg'
                            ? `Mural de Missões (${visibleBoards.length})`
                            : `Missões & Tramas (${visibleBoards.length})`}
                      </span>
                      {boardsExpanded ? (
                        <ChevronDown className="h-3 w-3 text-amber-400/70 ml-0.5" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-amber-400/70 ml-0.5" />
                      )}
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
                      {visibleBoards.map((b) => {
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
                            <RunicInsignia
                              name={b.icon || 'sword'}
                              className="w-3.5 h-3.5 text-amber-400 shrink-0"
                            />
                            <span className="truncate flex-1">{b.name || 'Mural de Missões'}</span>
                            {mode === 'geral' && b.target_mode && (
                              <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono opacity-60 border border-white/10 shrink-0">
                                {b.target_mode}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                      {visibleBoards.length === 0 && (
                        <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                          Nenhum mural cadastrado neste modo
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Códices & Arquivos da Mesa (Tabelas) */}
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-amber-300/60 hover:text-amber-200 group">
                  <button
                    onClick={() => setDbsExpanded(!dbsExpanded)}
                    className="flex items-center gap-1.5 font-fantasy font-bold uppercase text-[10px] tracking-wider"
                  >
                    <RuneTomeIcon className="h-3.5 w-3.5 mode-accent-text" />
                    <span>
                      {mode === 'rp'
                        ? `Tabelas & Registros (${visibleDatabases.length})`
                        : mode === 'rpg'
                          ? `Códices & Bestiários (${visibleDatabases.length})`
                          : `Códices, Bestiários & Tabelas (${visibleDatabases.length})`}
                    </span>
                    {dbsExpanded ? (
                      <ChevronDown className="h-3 w-3 text-amber-400/70 ml-0.5" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-amber-400/70 ml-0.5" />
                    )}
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
                    {visibleDatabases.map((d) => {
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
                          <RunicInsignia
                            name={d.icon || 'tome'}
                            className="w-3.5 h-3.5 text-amber-400 shrink-0"
                          />
                          <span className="truncate flex-1">{d.name || 'Códice Sem Nome'}</span>
                          {mode === 'geral' && d.target_mode && (
                            <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono opacity-60 border border-white/10 shrink-0">
                              {d.target_mode}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                    {visibleDatabases.length === 0 && (
                      <p className="px-3 py-1 text-[11px] text-[#7d7568] italic">
                        Nenhum códice registrado neste modo
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
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                  location.pathname === '/settings'
                    ? 'mode-accent-bg mode-accent-text font-semibold border mode-accent-border'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#18202d]'
                }`}
              >
                <RuneGearIcon className="h-3.5 w-3.5 mode-accent-text" />
                <span>{t('nav.sanctuary')}</span>
              </Link>

              <button
                onClick={handleCreateNewPage}
                title="Novo Item Rápido"
                className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-500/10 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold border border-amber-500/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t('common.create')}</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#0c0f14]">
        {/* Barra Superior Dark Fantasy */}
        <header className="h-12 border-b border-[#262c3a] bg-[#0f131a]/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 shrink-0 mode-accent-header">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mode-accent-text hover:bg-amber-500/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-fantasy mode-accent-text">
              <RunicCircle className="h-4 w-4" />
              <span className="font-bold tracking-wide">Éternum — Grimório de RPG & RP</span>
              <RunicPawIcon className="h-3.5 w-3.5 opacity-70" />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Seletor de TRÊS Modos no Top Header: Geral / RPG / RP */}
            <div className="flex items-center rounded-lg bg-[#141924] border border-[#2b3548] p-0.5 shadow-xs">
              <button
                onClick={() => setMode('geral')}
                className={`px-2 py-0.5 text-[11px] font-fantasy font-bold rounded-md transition-all flex items-center gap-1 ${
                  mode === 'geral'
                    ? 'bg-amber-100/15 text-amber-100 border border-amber-300/40 shadow-xs'
                    : 'text-[#8e8678] hover:text-amber-100'
                }`}
                title="Modo Geral: Exibe tudo junto (seções completas de RPG e RP)"
              >
                <span className="w-2 h-2 rounded-full bg-[#c99c36]" />
                <span>Geral</span>
              </button>
              <button
                onClick={() => setMode('rpg')}
                className={`px-2 py-0.5 text-[11px] font-fantasy font-bold rounded-md transition-all flex items-center gap-1 ${
                  mode === 'rpg'
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-xs'
                    : 'text-[#8e8678] hover:text-amber-200'
                }`}
                title="Modo RPG: Exibe apenas conteúdos táticos e de aventura (ouro rúnico)"
              >
                <span className="w-2 h-2 rounded-full bg-[#e7ab2c]" />
                <span>RPG</span>
              </button>
              <button
                onClick={() => setMode('rp')}
                className={`px-2 py-0.5 text-[11px] font-fantasy font-bold rounded-md transition-all flex items-center gap-1 ${
                  mode === 'rp'
                    ? 'bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow-xs'
                    : 'text-[#8e8678] hover:text-purple-200'
                }`}
                title="Modo RP: Exibe apenas crônicas, cenas e narrativa (roxo nobre)"
              >
                <span className="w-2 h-2 rounded-full bg-[#9d4edd]" />
                <span>RP</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="h-7 text-xs text-amber-200/80 hover:text-amber-100 bg-[#141923] border-[#2c3547] hover:border-amber-500/40 px-2.5 gap-1.5 hidden sm:flex"
            >
              <RuneSearchIcon className="h-3 w-3 mode-accent-text" />
              <span>{t('common.searchPlaceholder')}</span>
              <kbd className="text-[9px] font-mono mode-accent-text bg-[#0c0f14] border mode-accent-border px-1 py-0.2 rounded ml-1">
                ⌘K
              </kbd>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className={`h-7 text-xs font-bold gap-1 px-3 border shadow-sm ${
                    mode === 'rp'
                      ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-purple-50 border-purple-300/40 shadow-purple-950'
                      : mode === 'rpg'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 border-amber-300/40 shadow-amber-950'
                        : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 border-amber-400/40 shadow-amber-950'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t('common.create')}</span>
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
                  <FileText className="mr-2 h-3.5 w-3.5 text-amber-400" /> {t('nav.createPage')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCreateNewBoard}
                  className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                >
                  <Kanban className="mr-2 h-3.5 w-3.5 text-amber-400" /> {t('nav.createBoard')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCreateNewDatabase}
                  className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer"
                >
                  <Table className="mr-2 h-3.5 w-3.5 text-amber-400" /> {t('nav.createDatabase')}
                </DropdownMenuItem>
                {mode !== 'rp' && (
                  <DropdownMenuItem
                    onClick={() => navigate('/combat')}
                    className="hover:bg-amber-500/10 focus:bg-amber-500/10 cursor-pointer text-amber-200"
                  >
                    <RuneCombatIcon className="mr-2 h-3.5 w-3.5 text-amber-400" />{' '}
                    {t('nav.tacticalCombat')}
                  </DropdownMenuItem>
                )}
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
            <RuneSearchIcon className="h-4 w-4 mode-accent-text mr-2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
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
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
                  <RuneScrollIcon className="h-3 w-3 mode-accent-text" />
                  <span>Fichas & Crônicas</span>
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
                      <RunicInsignia
                        name={p.icon || 'scroll'}
                        className="w-4 h-4 text-amber-400 mr-2 shrink-0"
                      />
                      <span className="font-medium truncate flex-1">{p.title}</span>
                      {mode === 'geral' && p.target_mode && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono text-amber-200/60 border border-white/10 shrink-0">
                          {p.target_mode}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Murais de Missões */}
            {filteredBoards.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
                  <RuneSwordIcon className="h-3 w-3 mode-accent-text" />
                  <span>Murais de Missões</span>
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
                      <RunicInsignia
                        name={b.icon || 'sword'}
                        className="w-4 h-4 text-amber-400 mr-2 shrink-0"
                      />
                      <span className="font-medium truncate flex-1">{b.name}</span>
                      {mode === 'geral' && b.target_mode && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono text-amber-200/60 border border-white/10 shrink-0">
                          {b.target_mode}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados de Códices */}
            {filteredDatabases.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[10px] font-fantasy uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
                  <RuneTomeIcon className="h-3 w-3 mode-accent-text" />
                  <span>Códices & Bestiários</span>
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
                      <RunicInsignia
                        name={d.icon || 'tome'}
                        className="w-4 h-4 text-amber-400 mr-2 shrink-0"
                      />
                      <span className="font-medium truncate flex-1">{d.name}</span>
                      {mode === 'geral' && d.target_mode && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono text-amber-200/60 border border-white/10 shrink-0">
                          {d.target_mode}
                        </span>
                      )}
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

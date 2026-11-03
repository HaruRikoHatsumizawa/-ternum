import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useAppMode } from '@/contexts/ModeContext'
import { AvatarFrame } from '@/components/rpg/AvatarFrame'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
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
  Sparkles,
  ArrowRight,
  Shield,
  Swords,
  Scroll,
  BookOpen,
  Crown,
  Flame,
  Award,
  Calendar,
  Users,
  Bot,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  RunicCircle,
  DragonSilhouette,
  CrestShield,
  TomeOrnament,
  RunicPawIcon,
} from '@/components/rpg/RpgArtwork'
import {
  RuneCrestIcon,
  RuneScrollIcon,
  RuneSwordIcon,
  RuneTomeIcon,
  RuneAstrolabeIcon,
  RuneHammerIcon,
  RuneOracleIcon,
  RunicInsignia,
} from '@/components/rpg/EternumIcons'
import { RpHomeView } from '@/components/rpg/RpHomeView'

// Amostras de Heróis em Destaque da Campanha (Fichas prontas)
const HIGHLIGHT_HEROES = [
  {
    name: 'Valerius Lâmina Rubra',
    species: 'Raposa-Vermelha',
    classRole: 'Espadachim & Mercenário',
    level: 5,
    hpMax: 48,
    hpCurrent: 44,
    avatar: 'fox',
    xp: 6800,
    xpNext: 7500,
    alignment: 'Caótico e Bom',
    rpNote: 'Mestre em fintas e espreita. Leal a quem honra sua palavra.',
  },
  {
    name: 'Lyra Sombra-Estelar',
    species: 'Loba Cinzenta',
    classRole: 'Arcanista das Brumas',
    level: 4,
    hpMax: 26,
    hpCurrent: 26,
    avatar: 'wolf',
    xp: 3900,
    xpNext: 4500,
    alignment: 'Neutro e Bom',
    rpNote: 'Canaliza constelações veladas; protetora silente de sua matilha.',
  },
  {
    name: 'Ignis Escama-de-Cinza',
    species: 'Dragão Viajante',
    classRole: 'Clérigo da Forja Rúnica',
    level: 4,
    hpMax: 38,
    hpCurrent: 35,
    avatar: 'dragon',
    xp: 4100,
    xpNext: 4500,
    alignment: 'Leal e Neutro',
    rpNote: 'Sábio eremita que forja lâminas sagradas e coleciona crônicas.',
  },
]

export default function Index() {
  const { user } = useAuth()
  const { mode } = useAppMode()
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
      const p = await pagesService.create({ title: 'Nova Ficha / Crônica', icon: 'scroll' })
      navigate(`/pages/${p.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateBoard = async () => {
    try {
      const b = await boardsService.create({ name: 'Novo Mural de Missões', icon: 'sword' })
      navigate(`/boards/${b.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateDatabase = async () => {
    try {
      const d = await databasesService.create({ name: 'Novo Códice Arcano', icon: 'tome' })
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

  // Estatísticas de Missões
  const totalQuests = boards.reduce((acc, b) => acc + (b.cards?.length || 0), 0)
  const completedQuests = boards.reduce(
    (acc, b) => acc + (b.cards?.filter((c) => c.columnId === 'done').length || 0),
    0,
  )
  const questProgress = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

  if (loading) {
    return (
      <EternumLoadingScreen
        message={
          mode === 'rp'
            ? 'Abrindo o Salão de Narrativa de Éternum...'
            : 'Abrindo o Salão Principal de Éternum...'
        }
        submessage={
          mode === 'rp'
            ? 'Preparando crônicas, cenas e a corte aristocrática'
            : 'Invocando pergaminhos, murais e personagens'
        }
        fullScreen={false}
      />
    )
  }

  // Se o modo for RP, entrega a experiência do Salão de Narrativa autêntica
  if (mode === 'rp') {
    return (
      <RpHomeView
        pages={pages}
        onRefreshPages={async () => {
          const p = await pagesService.list().catch(() => [])
          setPages(p)
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-8 space-y-10">
      {/* Banner de Boas-vindas Medieval Dark Fantasy */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#171b26] via-[#131722] to-[#0c0f16] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-32 bg-purple-900/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full mode-accent-bg border mode-accent-border mode-accent-text text-xs font-fantasy tracking-wider uppercase">
              <Crown className="h-3.5 w-3.5 mode-accent-text" />
              <span>Éternum • As Crônicas de Val-Morath (RPG)</span>
            </div>
            <div className="flex items-center gap-4">
              <AvatarFrame frameId={user?.pfp_frame || 'runic-gold'} size="lg">
                <div className="w-full h-full flex items-center justify-center font-fantasy font-bold text-lg mode-accent-bg mode-accent-text">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                </div>
              </AvatarFrame>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-fantasy text-amber-100 flex items-center gap-3">
                  <span>Éternum — {user?.name || 'Mestre da Mesa'}</span>
                  <span className="mode-accent-text inline-flex items-center justify-center p-1 rounded-lg bg-black/30 border mode-accent-border">
                    <RuneSwordIcon className="w-6 h-6 mode-accent-text" />
                  </span>
                </h1>
                <p className="text-xs mode-accent-text font-fantasy">
                  Atmosfera de RPG ativa (Ouro Rúnico Forjado)
                </p>
              </div>
            </div>
            <p className="text-sm text-[#b8b0a0] max-w-2xl leading-relaxed">
              Bem-vindo ao Éternum, seu grimório dark fantasy desenhado tanto para{' '}
              <strong>RPG de mesa</strong> quanto para <strong>RP narrativo</strong>. Gerencie
              sessões e cenas no calendário, mural de contratos, forja de loot, fichas ricas com
              espécies antropomórficas e o Oráculo arcano de IA.
            </p>
          </div>
          {/* Busca rápida temática */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar no grimório..."
              className="pl-9 text-xs h-10 bg-[#090c10]/90 border-[#2b3345] text-amber-100 placeholder:text-amber-200/40 focus-visible:ring-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Personagens em Destaque da Mesa (Fichas Rápidas com HP & XP) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold font-fantasy text-amber-200 tracking-wide">
              Personagens em Destaque (Grupo de Aventureiros)
            </h2>
          </div>
          <span className="text-xs text-amber-300/60 font-fantasy flex items-center gap-1">
            <RunicPawIcon className="w-3.5 h-3.5 text-amber-400" />
            RPG & RP • Tier 1 Heroico
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HIGHLIGHT_HEROES.map((hero) => {
            const hpPercent = Math.round((hero.hpCurrent / hero.hpMax) * 100)
            const xpPercent = Math.round((hero.xp / hero.xpNext) * 100)

            return (
              <div
                key={hero.name}
                className="p-4 rounded-xl border border-amber-500/25 bg-[#121620] hover:border-amber-500/45 transition-all shadow-md group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {hero.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-fantasy text-amber-100 leading-tight">
                        {hero.name}
                      </h3>
                      <p className="text-xs text-amber-300/80 font-medium">
                        {hero.species} • {hero.classRole}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-fantasy font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Nv. {hero.level}
                  </span>
                </div>

                {hero.rpNote && (
                  <p className="text-[11px] text-[#b8b0a0] italic mt-3 pt-2 border-t border-[#222938] line-clamp-1">
                    "{hero.rpNote}"
                  </p>
                )}

                <div className="space-y-2 mt-2 pt-2 border-t border-[#222938]">
                  {/* Barra de Vida (HP) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-rose-400 font-medium flex items-center gap-1">
                        <Flame className="h-3 w-3 text-rose-500 fill-rose-500" />
                        Pontos de Vida (HP)
                      </span>
                      <span className="font-mono text-rose-200">
                        {hero.hpCurrent} / {hero.hpMax}
                      </span>
                    </div>
                    <div className="w-full bg-[#1e2433] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Barra de Experiência (XP) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Award className="h-3 w-3 text-amber-400" />
                        Experiência (XP)
                      </span>
                      <span className="font-mono text-amber-200">
                        {hero.xp} / {hero.xpNext}
                      </span>
                    </div>
                    <div className="w-full bg-[#1e2433] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ações Rápidas de Forja */}
      <div className="space-y-3">
        <h2 className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-400/80">
          Forjar Novo Registro de Aventura
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/sessions"
            className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/25 bg-[#121620] hover:bg-[#161c29] hover:border-amber-500/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneAstrolabeIcon className="h-5 w-5 mode-accent-text" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-amber-100 block">
                Calendário de Sessões
              </span>
              <span className="text-xs text-[#a39b8d] line-clamp-1">
                Agendamento mensal e crônicas da mesa
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400/60 group-hover:text-amber-300 transition-colors" />
          </Link>

          <Link
            to="/loot"
            className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/25 bg-[#121620] hover:bg-[#161c29] hover:border-amber-500/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneHammerIcon className="h-5 w-5 mode-accent-text" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-amber-100 block">
                Forja do Tesouro
              </span>
              <span className="text-xs text-[#a39b8d] line-clamp-1">
                Sorteie loot mágico e salve no códice
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400/60 group-hover:text-amber-300 transition-colors" />
          </Link>

          <Link
            to="/oracle"
            className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/25 bg-[#121620] hover:bg-[#161c29] hover:border-purple-500/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneOracleIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-purple-100 block">
                Oráculo de Éternum
              </span>
              <span className="text-xs text-[#a39b8d] line-clamp-1">
                IA nativa: ganchos, enigmas e ideias
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Resumo da Campanha e Progresso de Missões */}
      <div className="bg-[#121620] border border-amber-500/25 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-fantasy font-bold text-amber-100 uppercase tracking-wider">
              Progresso das Missões da Campanha
            </h3>
            <p className="text-xs text-[#a8a090]">
              {completedQuests} de {totalQuests} missões e contratos completados pelo grupo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40 bg-[#1c2230] rounded-full h-2.5 overflow-hidden border border-[#2b3447]">
            <div
              className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 shadow-sm shadow-amber-500"
              style={{ width: `${questProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-300 font-mono">{questProgress}%</span>
        </div>
      </div>

      {/* Fichas & Crônicas Favoritas */}
      {favoritePages.length > 0 && !search && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-fantasy font-bold text-amber-300 uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Crônicas e Fichas Sagradas (Favoritas)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {favoritePages.map((p) => (
              <Link
                key={p.id}
                to={`/pages/${p.id}`}
                className="p-3.5 rounded-xl border border-amber-500/30 bg-[#131824] hover:bg-[#182030] hover:border-amber-500/50 transition-all flex items-center gap-2.5 shadow-sm group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RunicInsignia name={p.icon || 'scroll'} className="w-4 h-4 mode-accent-text" />
                </div>
                <span className="text-xs font-fantasy font-bold text-amber-100 truncate flex-1">
                  {p.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400/60 group-hover:text-amber-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Seção: Fichas & Crônicas de Campanha */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-amber-200 uppercase tracking-wider">
            <Scroll className="h-4 w-4 text-amber-400" />
            <span>Fichas de Personagem & Crônicas ({filteredPages.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreatePage}
            className="text-xs h-7 text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Nova Ficha
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredPages.map((p) => (
            <Link
              key={p.id}
              to={`/pages/${p.id}`}
              className="p-3.5 rounded-xl border border-[#262e40] bg-[#121620] hover:border-amber-500/40 hover:bg-[#161c29] transition-all flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RunicInsignia name={p.icon || 'scroll'} className="w-4 h-4 mode-accent-text" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                    {p.title || 'Sem título'}
                  </p>
                  <p className="text-[10px] text-[#8e8678]">
                    {p.blocks?.length || 0} anotações arcanas
                  </p>
                </div>
              </div>
              {p.is_favorite && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
            </Link>
          ))}

          {filteredPages.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-[#262e40] rounded-xl text-xs text-[#8e8678]">
              Nenhuma ficha ou crônica encontrada.
            </div>
          )}
        </div>
      </div>

      {/* Seção: Murais de Missões (Quadro de Quests) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-amber-200 uppercase tracking-wider">
            <Kanban className="h-4 w-4 text-amber-400" />
            <span>Murais de Missões & Quests ({filteredBoards.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateBoard}
            className="text-xs h-7 text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Novo Mural
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
                className="p-3.5 rounded-xl border border-[#262e40] bg-[#121620] hover:border-amber-500/40 hover:bg-[#161c29] transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <RunicInsignia
                        name={b.icon || 'sword'}
                        className="w-4 h-4 mode-accent-text"
                      />
                    </div>
                    <span className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/70">
                    {bCards.length} missões
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[#8e8678]">
                    <span>Cumpridas</span>
                    <span className="font-semibold text-amber-300">{bPct}%</span>
                  </div>
                  <div className="w-full bg-[#1c2230] rounded-full h-1.5 overflow-hidden">
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
            <div className="col-span-full py-8 text-center border border-dashed border-[#262e40] rounded-xl text-xs text-[#8e8678]">
              Nenhum mural de missões encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Seção: Códices Arcanos (NPCs, Monstros, Itens) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-amber-200 uppercase tracking-wider">
            <Table className="h-4 w-4 text-amber-400" />
            <span>Códices Arcanos & Bestiários ({filteredDatabases.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateDatabase}
            className="text-xs h-7 text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Novo Códice
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredDatabases.map((d) => (
            <Link
              key={d.id}
              to={`/databases/${d.id}`}
              className="p-3.5 rounded-xl border border-[#262e40] bg-[#121620] hover:border-amber-500/40 hover:bg-[#161c29] transition-all flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RunicInsignia name={d.icon || 'tome'} className="w-4 h-4 mode-accent-text" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                    {d.name}
                  </p>
                  <p className="text-[10px] text-[#8e8678]">
                    {d.rows?.length || 0} criaturas/itens • {d.columns?.length || 0} colunas
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400/60 group-hover:text-amber-300 shrink-0" />
            </Link>
          ))}

          {filteredDatabases.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-[#262e40] rounded-xl text-xs text-[#8e8678]">
              Nenhum códice arcano encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

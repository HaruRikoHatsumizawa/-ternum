import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AvatarFrame } from '@/components/rpg/AvatarFrame'
import { PageRecord, pagesService } from '@/services/pages'
import { SessionRecord, sessionsService } from '@/services/sessions'
import { NpcRecord, npcsService } from '@/services/npcs'
import {
  RuneCrestIcon,
  RuneScrollIcon,
  RuneNpcIcon,
  RuneAstrolabeIcon,
  RuneOracleIcon,
  RuneHammerIcon,
  RunicInsignia,
} from '@/components/rpg/EternumIcons'
import { RunicPawIcon, TomeOrnament } from '@/components/rpg/RpgArtwork'
import {
  Sparkles,
  BookOpen,
  Feather,
  Calendar,
  HeartHandshake,
  ArrowRight,
  Plus,
  Compass,
  Star,
  Quote,
  Clock,
  Search,
  Scroll,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RpHomeViewProps {
  pages: PageRecord[]
  onRefreshPages?: () => void
}

export function RpHomeView({ pages, onRefreshPages }: RpHomeViewProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [npcs, setNpcs] = React.useState<NpcRecord[]>([])
  const [sessions, setSessions] = React.useState<SessionRecord[]>([])
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    async function loadRpData() {
      try {
        const [nList, sList] = await Promise.all([
          npcsService.list().catch(() => []),
          sessionsService.list().catch(() => []),
        ])
        if (mounted) {
          setNpcs(nList)
          setSessions(sList)
        }
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadRpData()
    return () => {
      mounted = false
    }
  }, [])

  const handleCreateNarrativePage = async () => {
    try {
      const p = await pagesService.create({
        title: 'Cena Narrativa — O Encontro nas Brumas',
        icon: 'scroll',
        blocks: [
          {
            id: 'b_' + Date.now(),
            type: 'heading_1',
            content: 'Ato I: Sussurros entre os Salões',
          },
          {
            id: 'b_' + (Date.now() + 1),
            type: 'quote',
            content: 'As tochas veladas lançavam sombras compridas sobre o mármore...',
          },
          {
            id: 'b_' + (Date.now() + 2),
            type: 'callout',
            content: 'Personagens em cena: Vaelen Garras-de-Prata e viajantes do reino.',
          },
        ],
      })
      if (onRefreshPages) onRefreshPages()
      navigate(`/pages/${p.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  // Filtrar páginas e crônicas pelo termo de busca
  const filteredPages = pages.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()),
  )
  const favoritePages = pages.filter((p) => p.is_favorite)

  // Última cena / crônica editada
  const latestPage = pages[0] || null

  // Próxima cena agendada
  const upcomingSession = sessions.find((s) => s.status === 'Agendada') || sessions[0] || null

  // Destaques de personagens com biografia e relações (sem barras de HP/XP)
  const displayNpcs = npcs.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-8 space-y-10 text-purple-100">
      {/* Banner Aristocrático & Eclético: O Salão de Narrativa */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#1c1229] via-[#140d1f] to-[#0c0814] p-6 sm:p-9 shadow-2xl">
        {/* Glows sutis de veludo e ametista */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-96 h-40 bg-fuchsia-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200 text-xs font-fantasy tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span>Éternum • Salão de Narrativa & Interpretação (RP)</span>
              <RunicPawIcon className="w-3.5 h-3.5 text-purple-400 opacity-80" />
            </div>

            <div className="flex items-center gap-4">
              <AvatarFrame frameId={user?.pfp_frame || 'lunar-amethyst'} size="lg">
                <div className="w-full h-full flex items-center justify-center font-fantasy font-bold text-lg bg-purple-900/40 text-purple-200">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RP'}
                </div>
              </AvatarFrame>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-fantasy text-purple-50 flex items-center gap-3">
                  <span>Corte de {user?.name || 'Vossa Graça'}</span>
                  <span className="p-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 shadow-sm">
                    <RuneOracleIcon className="w-6 h-6" />
                  </span>
                </h1>
                <p className="text-xs text-purple-300/80 font-fantasy flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-purple-400" />
                  <span>Teatro das Sombras & Crônicas Aristocráticas</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-[#d4c8e2] max-w-2xl leading-relaxed font-serif">
              Adentre o <em>Salão de Narrativa</em>. Aqui as estatísticas táticas dão lugar à força
              da interpretação: espécies de nobre linhagem, biografias profundas, diálogos gravados
              no tomo, tramas entre aliados e o desdobrar de cada cena interpretada.
            </p>
          </div>

          {/* Busca na biblioteca de cenas */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400/80" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar crônica, cena ou personagem..."
              className="pl-9 text-xs h-10 bg-[#0e0a16]/90 border-purple-500/30 text-purple-100 placeholder:text-purple-300/40 focus-visible:ring-purple-500/50 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Painel de Continuação de Cena & Próximo Encontro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Última Crônica Aberta */}
        <div className="p-5 rounded-2xl border border-purple-500/25 bg-[#140e1f] shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Continuar a Última Cena
              </span>
              <span className="text-[10px] text-purple-300/60 font-mono">Em Andamento</span>
            </div>
            {latestPage ? (
              <>
                <h3 className="text-base sm:text-lg font-bold font-fantasy text-purple-50 flex items-center gap-2">
                  <RunicInsignia
                    name={latestPage.icon || 'scroll'}
                    className="w-5 h-5 text-purple-400 shrink-0"
                  />
                  <span className="truncate">{latestPage.title}</span>
                </h3>
                <p className="text-xs text-purple-200/70 line-clamp-2 font-serif italic">
                  {latestPage.blocks && latestPage.blocks[0]?.content
                    ? `"${latestPage.blocks[0].content}"`
                    : 'Crônica pronta para novos diálogos e desfechos interpretativos.'}
                </p>
              </>
            ) : (
              <p className="text-xs text-purple-300/60 font-serif italic">
                Nenhuma crônica iniciada ainda. Registre o primeiro encontro da corte.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
            {latestPage ? (
              <Link
                to={`/pages/${latestPage.id}`}
                className="text-xs font-fantasy font-bold text-purple-300 hover:text-purple-100 flex items-center gap-1.5 transition-colors"
              >
                <span>Retomar Diálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-xs text-purple-400/60">Tomo em repouso</span>
            )}
            <Button
              size="sm"
              onClick={handleCreateNarrativePage}
              className="text-xs font-fantasy font-bold bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 border border-purple-400/40"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Nova Cena
            </Button>
          </div>
        </div>

        {/* Próxima Cena Agendada (Calendário RP) */}
        <div className="p-5 rounded-2xl border border-purple-500/25 bg-[#140e1f] shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Cena Agendada na Corte
              </span>
              <span className="text-[10px] text-purple-300/60 font-mono">
                {upcomingSession ? upcomingSession.status : 'Nenhuma'}
              </span>
            </div>

            {upcomingSession ? (
              <>
                <h3 className="text-base sm:text-lg font-bold font-fantasy text-purple-50 flex items-center gap-2">
                  <RuneAstrolabeIcon className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="truncate">{upcomingSession.title}</span>
                </h3>
                <p className="text-xs text-purple-200/70 font-serif line-clamp-2">
                  {upcomingSession.notes ||
                    'Encontro marcado com aliados da nobreza e personagens centrais.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-purple-300/70 pt-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    Data:{' '}
                    <strong className="text-purple-200">
                      {new Date(upcomingSession.date).toLocaleDateString('pt-BR')}
                    </strong>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xs text-purple-300/60 font-serif italic">
                Nenhum encontro marcado no astrolábio para os próximos dias.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
            <Link
              to="/sessions"
              className="text-xs font-fantasy font-bold text-purple-300 hover:text-purple-100 flex items-center gap-1.5 transition-colors"
            >
              <span>Ver Calendário de Cenas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/sessions"
              className="text-xs text-purple-400 hover:text-purple-200 font-medium"
            >
              Agendar Encontro
            </Link>
          </div>
        </div>
      </div>

      {/* Personagens Centrais & Relações da Corte (Foco RP sem barras marciais) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold font-fantasy text-purple-100 tracking-wide">
              Personagens em Destaque & Vínculos de RP
            </h2>
          </div>
          <Link
            to="/npcs"
            className="text-xs text-purple-300 hover:text-purple-100 font-fantasy flex items-center gap-1"
          >
            <span>Ver Todos ({npcs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayNpcs.map((npc) => (
            <div
              key={npc.id}
              onClick={() => navigate('/npcs')}
              className="p-4 rounded-2xl border border-purple-500/25 bg-[#140e1f] hover:border-purple-400/50 transition-all shadow-md group cursor-pointer space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <RunicInsignia name={npc.avatar || 'npc'} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold font-fantasy text-purple-100 truncate group-hover:text-purple-50">
                      {npc.name}
                    </h3>
                    <p className="text-xs text-purple-300/80 truncate flex items-center gap-1">
                      <RunicPawIcon className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{npc.species || npc.race || 'Espécie Nobre'}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-fantasy font-bold bg-purple-900/40 text-purple-200 border border-purple-500/30 shrink-0">
                  {npc.occupation || 'Aliado'}
                </span>
              </div>

              {/* Traço de Personalidade / Relação */}
              <div className="p-2.5 rounded-lg bg-[#0e0a16] border border-purple-500/20 text-xs text-purple-200/85 font-serif italic leading-relaxed line-clamp-2">
                "{npc.appearance || npc.personality?.traits || 'Figura enigmática da corte.'}"
              </div>

              {/* Relações & Vínculos (Sem HP nem XP) */}
              <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-purple-300/70 font-fantasy">
                <span>Vínculo: {npc.status || 'Vivo'}</span>
                <span className="text-purple-300 group-hover:text-purple-100 flex items-center gap-1">
                  Abrir Ficha <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {displayNpcs.length === 0 && !loading && (
            <div className="col-span-full py-8 text-center border border-dashed border-purple-500/30 rounded-2xl text-xs text-purple-300/60">
              Nenhum personagem registrado na corte. Acesse "Personagens & Relações" para criar sua
              primeira ficha narrativa.
            </div>
          )}
        </div>
      </div>

      {/* Acesso aos Recursos Narrativos de Éternum */}
      <div className="space-y-3">
        <h2 className="text-xs font-fantasy font-bold uppercase tracking-wider text-purple-400/80">
          Instrumentos da Corte & do Narrador
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/oracle"
            className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/25 bg-[#140e1f] hover:bg-[#1a1229] hover:border-purple-400/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneOracleIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-purple-100 block">
                Oráculo (Narrador IA)
              </span>
              <span className="text-xs text-purple-300/70 line-clamp-1">
                Gere diálogos, cenas e segredos de corte
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          </Link>

          <Link
            to="/loot"
            className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/25 bg-[#140e1f] hover:bg-[#1a1229] hover:border-purple-400/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneHammerIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-purple-100 block">
                Relíquias & Tesouros
              </span>
              <span className="text-xs text-purple-300/70 line-clamp-1">
                Artefatos lendários e presentes nobres
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          </Link>

          <Link
            to="/sessions"
            className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/25 bg-[#140e1f] hover:bg-[#1a1229] hover:border-purple-400/40 transition-all text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneAstrolabeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-fantasy font-bold text-purple-100 block">
                Cenas & Encontros
              </span>
              <span className="text-xs text-purple-300/70 line-clamp-1">
                Datas solenes e crônicas da corte
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Crônicas Sagradas & Diários Favoritos */}
      {favoritePages.length > 0 && !search && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-fantasy font-bold text-purple-300 uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 text-purple-400 fill-purple-400" />
            <span>Crônicas e Diários Consagrados (Favoritos)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {favoritePages.map((p) => (
              <Link
                key={p.id}
                to={`/pages/${p.id}`}
                className="p-3.5 rounded-xl border border-purple-500/30 bg-[#140e1f] hover:bg-[#1a1229] hover:border-purple-400/50 transition-all flex items-center gap-2.5 shadow-sm group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RunicInsignia name={p.icon || 'scroll'} className="w-4 h-4 text-purple-300" />
                </div>
                <span className="text-xs font-fantasy font-bold text-purple-100 truncate flex-1">
                  {p.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-400/60 group-hover:text-purple-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Todas as Crônicas & Diários Registrados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-purple-200 uppercase tracking-wider">
            <Scroll className="h-4 w-4 text-purple-400" />
            <span>Crônicas & Diários de Cena ({filteredPages.length})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNarrativePage}
            className="text-xs h-7 text-purple-300/80 hover:text-purple-100 hover:bg-purple-500/10 font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Nova Crônica
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredPages.map((p) => (
            <Link
              key={p.id}
              to={`/pages/${p.id}`}
              className="p-3.5 rounded-xl border border-purple-500/25 bg-[#140e1f] hover:border-purple-400/40 hover:bg-[#191226] transition-all flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RunicInsignia name={p.icon || 'scroll'} className="w-4 h-4 text-purple-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-fantasy font-bold text-purple-100 truncate group-hover:text-purple-50">
                    {p.title || 'Sem título'}
                  </p>
                  <p className="text-[10px] text-purple-300/60 font-serif">
                    {p.blocks?.length || 0} fragmentos narrativos
                  </p>
                </div>
              </div>
              {p.is_favorite && (
                <Star className="h-3 w-3 text-purple-400 fill-purple-400 shrink-0" />
              )}
            </Link>
          ))}

          {filteredPages.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-purple-500/30 rounded-xl text-xs text-purple-300/60">
              Nenhuma crônica ou diário encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

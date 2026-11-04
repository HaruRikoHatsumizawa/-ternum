import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from '@/i18n/LanguageContext'
import { useAppMode } from '@/contexts/ModeContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import { useToast } from '@/hooks/use-toast'
import { timelineService, CampaignEventRecord, CampaignEventCategory } from '@/services/timeline'
import { sessionsService } from '@/services/sessions'
import {
  RuneTimelineIcon,
  RuneSwordIcon,
  RuneScrollIcon,
  RuneSparkleIcon,
  RuneSkullIcon,
  RuneCrestIcon,
  RuneTomeIcon,
  RuneBondsIcon,
  RuneSearchIcon,
  RunePlusIcon,
  RuneTrashIcon,
} from '@/components/rpg/EternumIcons'
import { RunicCircle } from '@/components/rpg/RpgArtwork'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Filter, Sparkles, RefreshCw, Clock } from 'lucide-react'

export function TimelineView() {
  const { t } = useTranslation()
  const { mode } = useAppMode()
  const { toast } = useToast()
  const confirm = useConfirm()

  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<CampaignEventRecord[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [syncing, setSyncing] = useState(false)

  // Modal de Criar / Editar Evento
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CampaignEventRecord | null>(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventCampaign, setEventCampaign] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventCategory, setEventCategory] = useState<CampaignEventCategory>('marco')
  const [eventDescription, setEventDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const list = await timelineService.list()
      setEvents(list)
    } catch (err: any) {
      toast({
        title: t('common.error'),
        description: err?.message || t('timeline.errorToast'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Lista única de campanhas a partir dos eventos e das sessões cadastradas
  const [knownCampaigns, setKnownCampaigns] = useState<string[]>([])

  useEffect(() => {
    async function fetchCampaigns() {
      const fromEvents = events.map((e) => e.campaign).filter(Boolean)
      try {
        const sessions = await sessionsService.list()
        const fromSessions = sessions.map((s) => s.campaign).filter(Boolean)
        const combined = Array.from(new Set([...fromEvents, ...fromSessions])).sort()
        setKnownCampaigns(combined)
      } catch {
        const combined = Array.from(new Set(fromEvents)).sort()
        setKnownCampaigns(combined)
      }
    }
    fetchCampaigns()
  }, [events])

  // Sincronizar crônicas de sessões
  async function handleSyncSessions() {
    setSyncing(true)
    try {
      const count = await timelineService.syncFromSessions()
      if (count > 0) {
        toast({
          title: t('timeline.syncSessionsButton'),
          description: t('timeline.syncSuccessToast', { count }),
        })
        await loadEvents()
      } else {
        toast({
          title: t('timeline.syncSessionsButton'),
          description: t('timeline.syncZeroToast'),
        })
      }
    } catch (err: any) {
      toast({
        title: t('common.error'),
        description: err?.message || t('timeline.errorToast'),
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
  }

  // Abrir Modal de Criação / Edição
  function handleOpenCreate() {
    setEditingEvent(null)
    setEventTitle('')
    setEventCampaign(
      selectedCampaign !== 'ALL'
        ? selectedCampaign
        : knownCampaigns[0] || (mode === 'rp' ? 'Crônicas do Éternum' : 'Campanha Principal'),
    )
    setEventDate(new Date().toISOString().split('T')[0])
    setEventCategory('marco')
    setEventDescription('')
    setModalOpen(true)
  }

  function handleOpenEdit(event: CampaignEventRecord) {
    setEditingEvent(event)
    setEventTitle(event.title)
    setEventCampaign(event.campaign || '')
    setEventDate(event.date ? event.date.split(' ')[0].split('T')[0] : '')
    setEventCategory(event.category || 'marco')
    setEventDescription(event.description || '')
    setModalOpen(true)
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!eventTitle.trim()) return

    setSaving(true)
    try {
      const target_mode = mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral'
      if (editingEvent) {
        const updated = await timelineService.update(editingEvent.id, {
          title: eventTitle.trim(),
          campaign: eventCampaign.trim() || 'Crônicas do Éternum',
          date: eventDate,
          category: eventCategory,
          description: eventDescription.trim(),
        })
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)))
      } else {
        const created = await timelineService.create({
          title: eventTitle.trim(),
          campaign: eventCampaign.trim() || 'Crônicas do Éternum',
          date: eventDate,
          category: eventCategory,
          description: eventDescription.trim(),
          target_mode,
        })
        setEvents((prev) => [created, ...prev])
      }

      toast({
        title: t('common.saved'),
        description: t('timeline.saveSuccessToast'),
      })
      setModalOpen(false)
    } catch (err: any) {
      toast({
        title: t('common.error'),
        description: err?.message || t('timeline.errorToast'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteEvent(id: string) {
    const ev = events.find((e) => e.id === id)
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.timelineEventDesc'),
      itemName: ev?.title || undefined,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      icon: 'scroll',
    })
    if (!confirmed) return
    try {
      await timelineService.delete(id)
      setEvents((prev) => prev.filter((ev) => ev.id !== id))
      toast({
        title: t('common.deleted'),
        description: t('timeline.deleteSuccessToast'),
      })
    } catch (err: any) {
      toast({
        title: t('common.error'),
        description: err?.message || t('timeline.errorToast'),
        variant: 'destructive',
      })
    }
  }

  // Filtragem dos eventos: Campanha + Categoria + Busca
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        if (selectedCampaign !== 'ALL' && ev.campaign !== selectedCampaign) {
          return false
        }
        if (selectedCategory !== 'ALL' && ev.category !== selectedCategory) {
          return false
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = ev.title.toLowerCase().includes(q)
          const matchDesc = ev.description?.toLowerCase().includes(q)
          const matchCamp = ev.campaign?.toLowerCase().includes(q)
          if (!matchTitle && !matchDesc && !matchCamp) return false
        }
        return true
      })
      .sort((a, b) => {
        // Ordena por data decrescente (mais recente ao topo)
        const dateA = a.date || a.created
        const dateB = b.date || b.created
        return dateB.localeCompare(dateA)
      })
  }, [events, selectedCampaign, selectedCategory, searchQuery])

  // Agrupamento por Campanha se estiver visualizando "Todas as Campanhas"
  const groupedByCampaign = useMemo(() => {
    if (selectedCampaign !== 'ALL') {
      return { [selectedCampaign]: filteredEvents }
    }
    const map: Record<string, CampaignEventRecord[]> = {}
    for (const ev of filteredEvents) {
      const c = ev.campaign || 'Crônicas Gerais'
      if (!map[c]) map[c] = []
      map[c].push(ev)
    }
    return map
  }, [filteredEvents, selectedCampaign])

  const categoryIconMap: Record<CampaignEventCategory, React.ReactNode> = {
    batalha: <RuneSwordIcon className="w-4 h-4 text-red-400" />,
    politica: <RuneScrollIcon className="w-4 h-4 text-amber-400" />,
    descoberta: <RuneSparkleIcon className="w-4 h-4 text-cyan-400" />,
    sessao: <RuneTomeIcon className="w-4 h-4 text-blue-400" />,
    morte: <RuneSkullIcon className="w-4 h-4 text-stone-400" />,
    aliados: <RuneBondsIcon className="w-4 h-4 text-emerald-400" />,
    marco: <RuneCrestIcon className="w-4 h-4 text-purple-400" />,
  }

  const categoryLabelMap: Record<CampaignEventCategory, string> = {
    batalha: t('timeline.catBattle'),
    politica: t('timeline.catPolitics'),
    descoberta: t('timeline.catDiscovery'),
    sessao: t('timeline.catSession'),
    morte: t('timeline.catDeath'),
    aliados: t('timeline.catAllies'),
    marco: t('timeline.catMilestone'),
  }

  if (loading) {
    return <EternumLoadingScreen message={t('loading.loadingChronicles')} />
  }

  const isRp = mode === 'rp'

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Decoração Rúnica de Fundo */}
      <div className="absolute top-0 right-1/4 pointer-events-none opacity-5">
        <RunicCircle className="w-96 h-96 text-amber-400 animate-spin-slow" />
      </div>

      {/* Header da Tela */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232b3a] pb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg border ${
                isRp
                  ? 'bg-purple-950/40 border-purple-800/40 text-purple-400'
                  : 'bg-amber-950/40 border-amber-800/40 text-amber-400'
              }`}
            >
              <RuneTimelineIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-fantasy font-bold tracking-wide text-amber-100 flex items-center gap-2">
                {isRp ? t('timeline.titleRp') : t('timeline.title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#8c8476]">
                {isRp ? t('timeline.subtitleRp') : t('timeline.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncSessions}
            disabled={syncing}
            className="border-[#2d3748] bg-[#121622] text-amber-200 hover:bg-[#1a2030] text-xs font-fantasy gap-1.5"
            title={t('timeline.syncSessionsButton')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? t('timeline.syncingSessions') : t('timeline.syncSessionsButton')}
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className={`font-fantasy text-xs gap-1.5 ${
              isRp
                ? 'bg-purple-800 hover:bg-purple-700 text-purple-50'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold'
            }`}
          >
            <RunePlusIcon className="w-3.5 h-3.5" />
            {t('timeline.newEventButton')}
          </Button>
        </div>
      </div>

      {/* Barra de Filtros e Busca: SEPARAÇÃO POR CAMPANHA */}
      <div className="p-4 rounded-xl bg-[#121622] border border-[#232b3a] space-y-3 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Seletor de Campanhas (Destaque Principal) */}
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-fantasy font-bold text-amber-200 shrink-0">
              {t('timeline.filterByCampaign')}
            </span>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-full sm:w-[260px] bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs">
                <SelectValue placeholder={t('timeline.allCampaigns')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs">
                <SelectItem value="ALL">{t('timeline.allCampaigns')}</SelectItem>
                {knownCampaigns.map((camp) => (
                  <SelectItem key={camp} value={camp}>
                    {camp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoria + Busca */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs">
                <SelectValue placeholder={t('timeline.categoryAll')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs">
                <SelectItem value="ALL">{t('timeline.categoryAll')}</SelectItem>
                <SelectItem value="batalha">{t('timeline.catBattle')}</SelectItem>
                <SelectItem value="politica">{t('timeline.catPolitics')}</SelectItem>
                <SelectItem value="descoberta">{t('timeline.catDiscovery')}</SelectItem>
                <SelectItem value="sessao">{t('timeline.catSession')}</SelectItem>
                <SelectItem value="aliados">{t('timeline.catAllies')}</SelectItem>
                <SelectItem value="morte">{t('timeline.catDeath')}</SelectItem>
                <SelectItem value="marco">{t('timeline.catMilestone')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-64">
              <RuneSearchIcon className="w-3.5 h-3.5 text-[#8c8476] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('timeline.searchPlaceholder')}
                className="pl-8 bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Chips de Campanhas Rápidas */}
        {knownCampaigns.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#1a2130]">
            <button
              type="button"
              onClick={() => setSelectedCampaign('ALL')}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors font-fantasy ${
                selectedCampaign === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-[#8c8476] hover:text-amber-200 hover:bg-[#1a2030]'
              }`}
            >
              {t('timeline.allCampaigns')} ({events.length})
            </button>
            {knownCampaigns.map((camp) => {
              const count = events.filter((e) => e.campaign === camp).length
              const isSelected = selectedCampaign === camp
              return (
                <button
                  key={camp}
                  type="button"
                  onClick={() => setSelectedCampaign(camp)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors font-fantasy flex items-center gap-1 ${
                    isSelected
                      ? isRp
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-600/50 font-bold'
                        : 'bg-amber-600/30 text-amber-200 border border-amber-500/50 font-bold'
                      : 'text-[#8c8476] hover:text-amber-200 hover:bg-[#1a2030]'
                  }`}
                >
                  <span>{camp}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Renderização da Linha do Tempo */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121622]/50 border border-[#232b3a] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1a2030] border border-[#2d3748] flex items-center justify-center text-amber-400">
            <RuneTimelineIcon className="w-8 h-8 opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-fantasy font-bold text-amber-200">
              {t('timeline.emptyEvents')}
            </h3>
            <p className="text-xs text-[#8c8476] max-w-md mx-auto">
              {t('timeline.emptyEventsHint')}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="font-fantasy text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-1.5"
          >
            <RunePlusIcon className="w-3.5 h-3.5" />
            {t('timeline.newEventButton')}
          </Button>
        </div>
      ) : (
        <div className="space-y-10 relative z-10">
          {Object.entries(groupedByCampaign).map(([campaignName, campaignEvents]) => {
            if (campaignEvents.length === 0) return null
            return (
              <div key={campaignName} className="space-y-4">
                {/* Cabeçalho da Campanha */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-px flex-1 ${
                      isRp
                        ? 'bg-gradient-to-r from-transparent to-purple-800/60'
                        : 'bg-gradient-to-r from-transparent to-amber-700/60'
                    }`}
                  />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#151a26] border border-[#2a3448]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-fantasy font-bold text-amber-200 tracking-wider uppercase">
                      {campaignName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-600/40 text-amber-300"
                    >
                      {campaignEvents.length} {campaignEvents.length === 1 ? 'evento' : 'eventos'}
                    </Badge>
                  </div>
                  <div
                    className={`h-px flex-1 ${
                      isRp
                        ? 'bg-gradient-to-l from-transparent to-purple-800/60'
                        : 'bg-gradient-to-l from-transparent to-amber-700/60'
                    }`}
                  />
                </div>

                {/* Eixo Vertical da Timeline */}
                <div className="relative border-l-2 border-[#222c3d] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
                  {campaignEvents.map((event) => {
                    const cat = event.category || 'marco'
                    const dateFormatted = event.date || event.created.split(' ')[0]
                    const hasSessionLink = !!event.session_id

                    return (
                      <div
                        key={event.id}
                        className="group relative transition-all duration-200 hover:translate-x-1"
                      >
                        {/* Marcador do Eixo */}
                        <div
                          className={`absolute -left-[35px] sm:-left-[43px] top-3.5 w-6 h-6 rounded-full border-2 bg-[#0e121a] flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isRp
                              ? 'border-purple-600 group-hover:border-purple-400'
                              : 'border-amber-600 group-hover:border-amber-400'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        </div>

                        {/* Cartão do Evento */}
                        <div className="p-4 sm:p-5 rounded-xl bg-[#121622] border border-[#232b3a] hover:border-[#3b4760] transition-colors shadow-md space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2332] pb-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="p-1.5 rounded-md bg-[#192130] border border-[#2a3448]">
                                {categoryIconMap[cat]}
                              </span>
                              <h4 className="text-sm sm:text-base font-fantasy font-bold text-amber-100 group-hover:text-amber-200">
                                {event.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-[#2e3a4e] text-[#a09a8f]"
                              >
                                {categoryLabelMap[cat]}
                              </Badge>
                              {hasSessionLink && (
                                <Badge className="text-[10px] bg-blue-950/60 border border-blue-700/40 text-blue-300">
                                  {t('timeline.linkedToSession')}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-xs text-[#8c8476] font-mono flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-400/70" />
                                {dateFormatted}
                              </span>

                              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEdit(event)}
                                  className="h-7 px-2 text-xs text-amber-300 hover:text-amber-100 hover:bg-[#1a2130]"
                                >
                                  {t('common.edit')}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                >
                                  <RuneTrashIcon className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {event.description && (
                            <p className="text-xs sm:text-sm text-[#beb6a7] font-serif leading-relaxed whitespace-pre-wrap">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Criação / Edição de Evento */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#121622] border-[#2a3448] text-amber-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-lg text-amber-200 flex items-center gap-2">
              <RuneTimelineIcon className="w-5 h-5 text-amber-400" />
              {editingEvent ? t('timeline.editEventTitle') : t('timeline.createEventTitle')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                {t('timeline.eventTitleLabel')}
              </label>
              <Input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder={t('timeline.eventTitlePlaceholder')}
                required
                className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs font-fantasy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  {t('timeline.campaignLabel')}
                </label>
                <Input
                  value={eventCampaign}
                  onChange={(e) => setEventCampaign(e.target.value)}
                  placeholder={t('timeline.campaignPlaceholder')}
                  required
                  className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  {t('timeline.dateLabel')}
                </label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                {t('timeline.categoryLabel')}
              </label>
              <Select
                value={eventCategory}
                onValueChange={(val) => setEventCategory(val as CampaignEventCategory)}
              >
                <SelectTrigger className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs">
                  <SelectItem value="batalha">{t('timeline.catBattle')}</SelectItem>
                  <SelectItem value="politica">{t('timeline.catPolitics')}</SelectItem>
                  <SelectItem value="descoberta">{t('timeline.catDiscovery')}</SelectItem>
                  <SelectItem value="sessao">{t('timeline.catSession')}</SelectItem>
                  <SelectItem value="aliados">{t('timeline.catAllies')}</SelectItem>
                  <SelectItem value="morte">{t('timeline.catDeath')}</SelectItem>
                  <SelectItem value="marco">{t('timeline.catMilestone')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                {t('timeline.descriptionLabel')}
              </label>
              <Textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder={t('timeline.descriptionPlaceholder')}
                rows={4}
                className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs font-serif leading-relaxed resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs text-[#8c8476] hover:text-amber-200"
              >
                {t('timeline.cancelButton')}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving || !eventTitle.trim()}
                className={`text-xs font-fantasy font-bold ${
                  isRp
                    ? 'bg-purple-800 hover:bg-purple-700 text-purple-50'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                }`}
              >
                {saving ? t('timeline.savingButton') : t('timeline.saveButton')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default TimelineView

import { useState, useEffect } from 'react'
import { useAppMode, isItemVisibleInMode } from '@/contexts/ModeContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { sessionsService, SessionRecord, SessionStatus, TargetMode } from '@/services/sessions'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import { RuneAstrolabeIcon } from '@/components/rpg/EternumIcons'
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Scroll,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { RunicCircle, TomeOrnament } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

const STATUS_COLORS: Record<SessionStatus, { text: string; bg: string; border: string }> = {
  Agendada: {
    text: 'text-amber-300',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/40',
  },
  Realizada: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40',
  },
  Cancelada: {
    text: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-500/40',
  },
}

export default function SessionsCalendar() {
  const { mode } = useAppMode()
  const { t } = useLanguage()
  const confirm = useConfirm()
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<SessionRecord | null>(null)

  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('19:30')
  const [formStatus, setFormStatus] = useState<SessionStatus>('Agendada')
  const [formCampaign, setFormCampaign] = useState('As Crônicas de Val-Morath')
  const [formLocation, setFormLocation] = useState('Taverna do Javali Dourado')
  const [formNotes, setFormNotes] = useState('')
  const [formTargetMode, setFormTargetMode] = useState<TargetMode>('geral')

  const loadSessions = async () => {
    setLoading(true)
    try {
      const list = await sessionsService.list()
      setSessions(list)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao carregar sessões', description: 'Não foi possível ler as crônicas.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const startingDayIndex = firstDayOfMonth.getDay() // 0 = Dom, 1 = Seg...
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const openNewSessionModal = (defaultDateString?: string) => {
    setEditingSession(null)
    setFormTitle('')
    const targetDate = defaultDateString || new Date().toISOString().split('T')[0]
    setFormDate(targetDate)
    setFormTime('19:30')
    setFormStatus('Agendada')
    setFormCampaign('As Crônicas de Val-Morath')
    setFormLocation('Taverna do Javali Dourado')
    setFormNotes('')
    setFormTargetMode(mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral')
    setModalOpen(true)
  }

  const openEditSessionModal = (s: SessionRecord) => {
    setEditingSession(s)
    setFormTitle(s.title)
    const d = new Date(s.date)
    const dateStr = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
    const hours = !isNaN(d.getTime()) ? String(d.getHours()).padStart(2, '0') : '19'
    const minutes = !isNaN(d.getTime()) ? String(d.getMinutes()).padStart(2, '0') : '30'
    setFormDate(dateStr)
    setFormTime(`${hours}:${minutes}`)
    setFormStatus(s.status)
    setFormCampaign(s.campaign || 'As Crônicas de Val-Morath')
    setFormLocation(s.location || '')
    setFormNotes(s.notes || '')
    setFormTargetMode(s.target_mode || 'geral')
    setModalOpen(true)
  }

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const combinedDateTime = new Date(`${formDate}T${formTime || '19:30'}:00.000Z`).toISOString()

    try {
      if (editingSession) {
        await sessionsService.update(editingSession.id, {
          title: formTitle,
          date: combinedDateTime,
          status: formStatus,
          campaign: formCampaign,
          location: formLocation,
          notes: formNotes,
          target_mode: formTargetMode,
        })
        toast({ title: 'Sessão atualizada', description: 'O cronograma foi retificado nos tomos.' })
      } else {
        await sessionsService.create({
          title: formTitle,
          date: combinedDateTime,
          status: formStatus,
          campaign: formCampaign,
          location: formLocation,
          notes: formNotes,
          target_mode: formTargetMode,
        })
        toast({ title: 'Sessão convocada!', description: 'Nova jornada agendada no calendário.' })
      }
      setModalOpen(false)
      loadSessions()
    } catch (err: any) {
      toast({
        title: 'Falha ao salvar sessão',
        description: err?.message || 'Verifique os dados preenchidos.',
      })
    }
  }

  const handleToggleStatus = async (session: SessionRecord) => {
    const nextStatus: SessionStatus =
      session.status === 'Agendada'
        ? 'Realizada'
        : session.status === 'Realizada'
          ? 'Cancelada'
          : 'Agendada'
    try {
      await sessionsService.update(session.id, { status: nextStatus })
      toast({
        title: `Sessão marcada como ${nextStatus}`,
        description: session.title,
      })
      loadSessions()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSession = async (id: string) => {
    const s = sessions.find((x) => x.id === id)
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.sessionDesc'),
      itemName: s?.title || undefined,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      icon: 'trash',
    })
    if (!confirmed) return
    try {
      await sessionsService.delete(id)
      toast({ title: 'Sessão removida do calendário' })
      loadSessions()
    } catch (err) {
      console.error(err)
    }
  }

  // Filtrar sessões de acordo com o modo ativo:
  // Se modo === 'geral': todas
  // Se modo === 'rpg': target_mode 'rpg' ou 'geral'
  // Se modo === 'rp': target_mode 'rp' ou 'geral'
  const visibleSessions = sessions.filter((s) => isItemVisibleInMode(s.target_mode, mode))

  // Filtrar sessões do dia
  const getSessionsForDay = (day: number) => {
    return visibleSessions.filter((s) => {
      const d = new Date(s.date)
      return (
        !isNaN(d.getTime()) &&
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      )
    })
  }

  if (loading) {
    return (
      <EternumLoadingScreen
        message={t('loading.readingConstellations')}
        submessage={t('loading.loadingChronicleDates')}
        fullScreen={false}
      />
    )
  }
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262c3a] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <RuneAstrolabeIcon className="w-6 h-6 mode-accent-text" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              {t('sessions.title')}
            </h1>
          </div>
          <p className="text-xs text-[#a8a090] max-w-xl">{t('sessions.subtitle')}</p>{' '}
        </div>
        <Button
          onClick={() => openNewSessionModal()}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold gap-1.5 border border-amber-300/40 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>{t('sessions.newSession')}</span>
        </Button>{' '}
      </div>

      {/* Grid Calendário + Lista de Próximas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel do Calendário Mensal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#121620] shadow-xl space-y-4">
            {/* Navegador de Mês */}
            <div className="flex items-center justify-between border-b border-[#242b38] pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-fantasy font-bold text-amber-100">
                  {monthNames[month]} de {year}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-7 w-7 border-[#2a3346] hover:bg-amber-500/10 text-amber-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="h-7 text-xs border-[#2a3346] hover:bg-amber-500/10 text-amber-300"
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-7 w-7 border-[#2a3346] hover:bg-amber-500/10 text-amber-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 text-center font-fantasy text-[11px] text-amber-300/70 uppercase tracking-wider py-1">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            {/* Células do Calendário */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Espaços vazios do início */}
              {Array.from({ length: startingDayIndex }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[72px] rounded-lg bg-[#0a0d13]/40 border border-transparent"
                />
              ))}

              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const daySessions = getSessionsForDay(dayNum)
                const isToday =
                  new Date().getDate() === dayNum &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => openNewSessionModal(dateStr)}
                    className={`min-h-[78px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between group ${
                      isToday
                        ? 'border-amber-400 bg-amber-500/10'
                        : daySessions.length > 0
                          ? 'border-amber-500/40 bg-[#151b27] hover:border-amber-400/70'
                          : 'border-[#222938] bg-[#0c1017] hover:border-amber-500/30 hover:bg-[#121722]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isToday ? 'text-amber-300' : 'text-[#8e8678] group-hover:text-amber-200'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {daySessions.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {daySessions.slice(0, 2).map((s) => (
                        <div
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditSessionModal(s)
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium border ${
                            s.status === 'Realizada'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                              : s.status === 'Cancelada'
                                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                          }`}
                          title={`${s.title} (${s.status})`}
                        >
                          {s.title}
                        </div>
                      ))}
                      {daySessions.length > 2 && (
                        <span className="text-[9px] text-amber-300/70 font-mono block text-center">
                          +{daySessions.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#8e8678] border-t border-[#242b38]">
              <span>* Clique em qualquer dia para agendar ou editar</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Agendada
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Realizada
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Cancelada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Sessões e Crônicas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-fantasy font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-2">
              <Scroll className="h-4 w-4 text-amber-400" />
              Próximas & Crônicas ({sessions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {visibleSessions.map((s) => {
              const d = new Date(s.date)
              const formattedDate = !isNaN(d.getTime())
                ? d.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Data a definir'
              const formattedTime = !isNaN(d.getTime())
                ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : ''
              const style = STATUS_COLORS[s.status] || STATUS_COLORS.Agendada

              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-amber-500/25 bg-[#121620] hover:border-amber-500/40 transition-all space-y-2 relative group shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-fantasy font-bold text-amber-100 group-hover:text-amber-200 leading-snug">
                      {s.title}
                    </h3>
                    <button
                      onClick={() => handleToggleStatus(s)}
                      title="Alterar status (Agendada -> Realizada -> Cancelada)"
                      className={`px-2 py-0.5 rounded text-[10px] font-fantasy font-semibold shrink-0 border cursor-pointer ${style.bg} ${style.border} ${style.text}`}
                    >
                      {s.status}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9e9688]">
                    <span className="flex items-center gap-1 text-amber-300/80">
                      <Clock className="h-3 w-3 text-amber-400" />
                      {formattedDate} {formattedTime ? `às ${formattedTime}` : ''}
                    </span>
                    {s.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-400/60" />
                        {s.location}
                      </span>
                    )}
                  </div>

                  {s.notes && (
                    <p className="text-[11px] text-[#a39b8d] italic line-clamp-2 pt-1 border-t border-[#202735]">
                      "{s.notes}"
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-[#202735] text-[10px]">
                    <span className="text-amber-400/60 font-fantasy truncate max-w-[140px]">
                      {s.campaign || 'Val-Morath'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditSessionModal(s)}
                        className="h-6 w-6 text-amber-300/70 hover:text-amber-200"
                        title="Editar Sessão"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSession(s.id)}
                        className="h-6 w-6 text-rose-400/70 hover:text-rose-300"
                        title="Apagar do Tomo"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {sessions.length === 0 && !loading && (
              <div className="p-8 text-center border border-dashed border-[#262c3a] rounded-xl text-xs text-[#8e8678]">
                Nenhuma sessão agendada no momento. Clique em "+ Agendar" para convocar seu grupo!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criar/Editar Sessão */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy font-bold text-amber-100 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-amber-400" />
              {editingSession ? 'Retificar Sessão de Campanha' : 'Agendar Nova Sessão de Jogo'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveSession} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-fantasy font-bold text-amber-200">Título da Sessão *</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Sessão 15 — O Assalto à Torre de Obsidiana"
                className="bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-fantasy font-bold text-amber-200">Data *</label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-[#090c10] border-[#262e40] text-amber-100"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-fantasy font-bold text-amber-200">Horário</label>
                <Input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="bg-[#090c10] border-[#262e40] text-amber-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-fantasy font-bold text-amber-200">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as SessionStatus)}
                  className="w-full h-9 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-fantasy font-bold text-amber-200">Local / Encontro</label>
                <Input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ex: Discord / Sala de RP / Mesa Presencial"
                  className="bg-[#090c10] border-[#262e40] text-amber-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-fantasy font-bold text-amber-200">Campanha</label>
              <Input
                value={formCampaign}
                onChange={(e) => setFormCampaign(e.target.value)}
                placeholder="Ex: As Crônicas de Val-Morath"
                className="bg-[#090c10] border-[#262e40] text-amber-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-fantasy font-bold text-amber-200">Classificação / Modo</label>
              <select
                value={formTargetMode}
                onChange={(e) => setFormTargetMode(e.target.value as TargetMode)}
                className="w-full h-9 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
              >
                <option value="geral">Geral (Visível em RPG e RP)</option>
                <option value="rpg">RPG (Apenas no modo RPG Tático)</option>
                <option value="rp">RP (Apenas no modo RP Narrativo)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-fantasy font-bold text-amber-200">Notas & Resumo</label>
              <Textarea
                rows={3}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Descreva o objetivo da sessão, pistas deixadas ou resumo do que aconteceu..."
                className="bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="text-xs text-[#a39b8d]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold text-xs border border-amber-300/40"
              >
                {editingSession ? 'Salvar Alterações' : 'Confirmar Sessão'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

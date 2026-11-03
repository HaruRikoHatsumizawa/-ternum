import { useState, useEffect } from 'react'
import { useAppMode, isItemVisibleInMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import {
  encountersService,
  EncounterRecord,
  Combatant,
  EncounterStatus,
} from '@/services/encounters'
import { pagesService, PageRecord } from '@/services/pages'
import { npcsService, NpcRecord } from '@/services/npcs'
import { databasesService, DatabaseRecord } from '@/services/databases'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import {
  RuneCombatIcon,
  RuneSwordIcon,
  RuneShieldIcon,
  RuneScrollIcon,
  RuneTomeIcon,
  RunicInsignia,
} from '@/components/rpg/EternumIcons'
import { RunicPawIcon, CrestShield } from '@/components/rpg/RpgArtwork'
import {
  Plus,
  Trash2,
  Play,
  RotateCcw,
  SkipForward,
  ShieldAlert,
  Heart,
  HeartPulse,
  Sparkles,
  ArrowUpDown,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  UserPlus,
  Save,
} from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'

// Condições canônicas sóbrias de RPG/D&D com cores sutis
const AVAILABLE_CONDITIONS: { id: string; label: string; color: string }[] = [
  {
    id: 'abençoado',
    label: 'Abençoado',
    color: 'border-amber-400/40 text-amber-200 bg-amber-950/40',
  },
  {
    id: 'atordoado',
    label: 'Atordoado',
    color: 'border-purple-400/40 text-purple-200 bg-purple-950/40',
  },
  {
    id: 'envenenado',
    label: 'Envenenado',
    color: 'border-emerald-400/40 text-emerald-200 bg-emerald-950/40',
  },
  {
    id: 'amedrontado',
    label: 'Amedrontado',
    color: 'border-indigo-400/40 text-indigo-200 bg-indigo-950/40',
  },
  { id: 'caído', label: 'Caído (0 HP)', color: 'border-rose-500/50 text-rose-300 bg-rose-950/50' },
  {
    id: 'imobilizado',
    label: 'Imobilizado',
    color: 'border-sky-400/40 text-sky-200 bg-sky-950/40',
  },
  { id: 'invisível', label: 'Invisível', color: 'border-cyan-400/40 text-cyan-200 bg-cyan-950/40' },
  {
    id: 'escondido',
    label: 'Em Furtividade',
    color: 'border-stone-400/40 text-stone-200 bg-stone-900/60',
  },
]

// Extrai dados táticos de blocos de uma ficha (PageRecord)
function extractHeroStatsFromPage(page: PageRecord): { hp: number; ac: number; avatar: string } {
  let hp = 30
  let ac = 14
  const text = (page.blocks || []).map((b) => b.content || '').join(' ')

  const hpMatch = text.match(/(?:HP|Pontos de Vida|Vida)[\s:]+(\d+)/i)
  if (hpMatch) hp = parseInt(hpMatch[1], 10) || hp

  const acMatch = text.match(/(?:CA|Classe de Armadura|Armadura)[\s:]+(\d+)/i)
  if (acMatch) ac = parseInt(acMatch[1], 10) || ac

  return { hp, ac, avatar: page.icon || 'sword' }
}

export default function CombatTracker() {
  const { mode } = useAppMode()
  const { t } = useLanguage()
  const [encounters, setEncounters] = useState<EncounterRecord[]>([])
  const [selectedEncounter, setSelectedEncounter] = useState<EncounterRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Diálogo para criar novo combate
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newEncounterName, setNewEncounterName] = useState('')
  const [newEncounterDesc, setNewEncounterDesc] = useState('')

  // Diálogo para adicionar combatente
  const [addCombatantModalOpen, setAddCombatantModalOpen] = useState(false)
  const [combatantSourceTab, setCombatantSourceTab] = useState<
    'herois' | 'npcs' | 'codices' | 'avulso'
  >('herois')

  // Fichas, NPCs e Códices disponíveis para importar
  const [availablePages, setAvailablePages] = useState<PageRecord[]>([])
  const [availableNpcs, setAvailableNpcs] = useState<NpcRecord[]>([])
  const [availableDatabases, setAvailableDatabases] = useState<DatabaseRecord[]>([])

  // Formulário de combatente avulso / edição rápida
  const [manualCombatant, setManualCombatant] = useState({
    name: '',
    type: 'monster' as 'hero' | 'monster' | 'npc',
    initiative: 10,
    hpMax: 20,
    hpCurrent: 20,
    ac: 12,
    notes: '',
  })

  // Dano / Cura rápida para um combatente
  const [quickHpModalOpen, setQuickHpModalOpen] = useState(false)
  const [quickHpCombatant, setQuickHpCombatant] = useState<Combatant | null>(null)
  const [hpDeltaValue, setHpDeltaValue] = useState<number>(5)

  // Condições do combatente
  const [conditionModalOpen, setConditionModalOpen] = useState(false)
  const [conditionCombatant, setConditionCombatant] = useState<Combatant | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [encList, pageList, npcList, dbList] = await Promise.all([
        encountersService.list(),
        pagesService.list().catch(() => []),
        npcsService.list().catch(() => []),
        databasesService.list().catch(() => []),
      ])

      setEncounters(encList)
      setAvailablePages(pageList)
      setAvailableNpcs(npcList)
      setAvailableDatabases(dbList)

      if (encList.length > 0) {
        setSelectedEncounter((prev) => {
          if (!prev) return encList[0]
          return encList.find((e) => e.id === prev.id) || encList[0]
        })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao carregar módulo de combate' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Persiste o combate ativo no PocketBase
  const persistEncounter = async (updated: EncounterRecord) => {
    setSelectedEncounter(updated)
    setEncounters((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    setIsSaving(true)
    try {
      await encountersService.update(updated.id, {
        name: updated.name,
        description: updated.description,
        status: updated.status,
        round: updated.round,
        current_turn_index: updated.current_turn_index,
        combatants: updated.combatants,
      })
    } catch (err: any) {
      toast({ title: 'Falha ao salvar combate', description: err?.message })
    } finally {
      setIsSaving(false)
    }
  }

  // Criação de novo combate
  const handleCreateEncounter = async () => {
    if (!newEncounterName.trim()) {
      toast({ title: 'Informe o título do combate' })
      return
    }

    try {
      const created = await encountersService.create({
        name: newEncounterName.trim(),
        description: newEncounterDesc.trim(),
        status: 'Preparando',
        round: 1,
        current_turn_index: 0,
        combatants: [],
        target_mode: mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral',
      })

      setEncounters([created, ...encounters])
      setSelectedEncounter(created)
      setCreateModalOpen(false)
      setNewEncounterName('')
      setNewEncounterDesc('')
      toast({ title: 'Combate Tático forjado!' })
    } catch (err: any) {
      toast({ title: 'Falha ao criar combate', description: err?.message })
    }
  }

  // Exclusão de combate
  const handleDeleteEncounter = async (id: string, name: string) => {
    if (!confirm(`Deseja remover o combate "${name}"?`)) return
    try {
      await encountersService.delete(id)
      const filtered = encounters.filter((e) => e.id !== id)
      setEncounters(filtered)
      if (selectedEncounter?.id === id) {
        setSelectedEncounter(filtered[0] || null)
      }
      toast({ title: 'Combate removido' })
    } catch (err: any) {
      toast({ title: 'Erro ao remover combate', description: err?.message })
    }
  }

  // Ordena combatentes por iniciativa decrescente
  const sortCombatantsByInitiative = (combatantsList: Combatant[]): Combatant[] => {
    return [...combatantsList].sort((a, b) => {
      if (b.initiative !== a.initiative) return b.initiative - a.initiative
      // Critério de desempate: heróis agem antes de monstros
      if (a.type === 'hero' && b.type !== 'hero') return -1
      if (b.type === 'hero' && a.type !== 'hero') return 1
      return (b.ac || 0) - (a.ac || 0)
    })
  }

  // Adicionar combatente (salva e já ordena)
  const handleAddCombatant = async (cbt: Omit<Combatant, 'id'>) => {
    if (!selectedEncounter) return
    const newCombatant: Combatant = {
      ...cbt,
      id: `cbt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conditions: cbt.conditions || [],
    }

    const updatedCombatants = sortCombatantsByInitiative([
      ...selectedEncounter.combatants,
      newCombatant,
    ])
    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: updatedCombatants,
      status: selectedEncounter.status === 'Preparando' ? 'Em Andamento' : selectedEncounter.status,
    }

    await persistEncounter(updated)
    setAddCombatantModalOpen(false)
    toast({ title: `${newCombatant.name} entrou na iniciativa!` })
  }

  // Importar herói de ficha
  const handleImportHeroFromPage = (p: PageRecord) => {
    const stats = extractHeroStatsFromPage(p)
    handleAddCombatant({
      name: p.title,
      type: 'hero',
      source: 'ficha',
      sourceId: p.id,
      initiative: Math.floor(Math.random() * 20) + 1,
      hpCurrent: stats.hp,
      hpMax: stats.hp,
      ac: stats.ac,
      conditions: [],
      notes: 'Ficha importada das crônicas de Éternum',
      avatar: stats.avatar,
    })
  }

  // Importar NPC
  const handleImportNpc = (npc: NpcRecord) => {
    const isHero = npc.alignment?.toLowerCase().includes('bom') || npc.target_mode === 'rp'
    handleAddCombatant({
      name: npc.name,
      type: isHero ? 'hero' : 'npc',
      source: 'codice',
      sourceId: npc.id,
      initiative: Math.floor(Math.random() * 20) + 1,
      hpCurrent: npc.hp || 25,
      hpMax: npc.hp || 25,
      ac: npc.ac || 12,
      conditions: npc.status === 'Morto' ? ['caído'] : [],
      notes: `${npc.species || npc.race || 'NPC'} • ${npc.occupation || ''}`,
      avatar: npc.avatar || 'npc',
    })
  }

  // Importar linha de monstro do Códice
  const handleImportFromDatabaseRow = (row: any, dbName: string) => {
    const name = row.col_name || row.col_title || 'Criatura do Códice'
    const isBoss =
      (row.col_type || '').includes('Chefe') || (row.col_type || '').includes('Monstro')
    const hp = isBoss ? 55 : 30
    const ac = isBoss ? 15 : 12

    handleAddCombatant({
      name,
      type: 'monster',
      source: 'codice',
      initiative: Math.floor(Math.random() * 20) + 1,
      hpCurrent: hp,
      hpMax: hp,
      ac,
      conditions: [],
      notes: `${dbName} • ${row.col_cr || ''}`,
      avatar: 'dragon',
    })
  }

  // Remover combatente
  const handleRemoveCombatant = async (cbtId: string) => {
    if (!selectedEncounter) return
    const updatedCombatants = selectedEncounter.combatants.filter((c) => c.id !== cbtId)
    let nextIndex = selectedEncounter.current_turn_index
    if (nextIndex >= updatedCombatants.length) {
      nextIndex = 0
    }
    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: updatedCombatants,
      current_turn_index: nextIndex,
    }
    await persistEncounter(updated)
  }

  // Reordenar por iniciativa manualmente
  const handleReorderInitiative = async () => {
    if (!selectedEncounter) return
    const sorted = sortCombatantsByInitiative(selectedEncounter.combatants)
    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: sorted,
      current_turn_index: 0,
    }
    await persistEncounter(updated)
    toast({ title: 'Iniciativa reordenada do maior para o menor' })
  }

  // Próximo turno
  const handleNextTurn = async () => {
    if (!selectedEncounter || selectedEncounter.combatants.length === 0) return

    let nextIndex = selectedEncounter.current_turn_index + 1
    let nextRound = selectedEncounter.round

    if (nextIndex >= selectedEncounter.combatants.length) {
      nextIndex = 0
      nextRound += 1
      toast({ title: `Início da Rodada ${nextRound}!` })
    }

    const updated: EncounterRecord = {
      ...selectedEncounter,
      current_turn_index: nextIndex,
      round: nextRound,
      status: 'Em Andamento',
    }
    await persistEncounter(updated)
  }

  // Turno anterior
  const handlePrevTurn = async () => {
    if (!selectedEncounter || selectedEncounter.combatants.length === 0) return

    let prevIndex = selectedEncounter.current_turn_index - 1
    let prevRound = selectedEncounter.round

    if (prevIndex < 0) {
      if (prevRound > 1) {
        prevRound -= 1
        prevIndex = selectedEncounter.combatants.length - 1
      } else {
        prevIndex = 0
      }
    }

    const updated: EncounterRecord = {
      ...selectedEncounter,
      current_turn_index: prevIndex,
      round: prevRound,
    }
    await persistEncounter(updated)
  }

  // Reiniciar combate (rodada 1, turno 0)
  const handleResetCombat = async () => {
    if (!selectedEncounter) return
    if (!confirm('Deseja reiniciar a contagem de rodadas e turnos deste combate?')) return

    const updated: EncounterRecord = {
      ...selectedEncounter,
      round: 1,
      current_turn_index: 0,
      status: 'Preparando',
    }
    await persistEncounter(updated)
    toast({ title: 'Combate reiniciado na Rodada 1' })
  }

  // Finalizar combate
  const handleFinishCombat = async () => {
    if (!selectedEncounter) return
    const updated: EncounterRecord = {
      ...selectedEncounter,
      status: 'Finalizado',
    }
    await persistEncounter(updated)
    toast({ title: 'Combate marcado como Finalizado!' })
  }

  // Aplicar dano / cura
  const handleApplyDamageOrHeal = async (isDamage: boolean) => {
    if (!selectedEncounter || !quickHpCombatant) return
    const delta = Math.abs(hpDeltaValue)
    const current = quickHpCombatant.hpCurrent
    const max = quickHpCombatant.hpMax

    let nextHp = isDamage ? current - delta : current + delta
    if (nextHp > max) nextHp = max
    if (nextHp < 0) nextHp = 0

    // Se chegou a 0, adiciona condição 'caído'
    let nextConditions = [...quickHpCombatant.conditions]
    if (nextHp === 0 && !nextConditions.includes('caído')) {
      nextConditions.push('caído')
    } else if (nextHp > 0 && nextConditions.includes('caído')) {
      nextConditions = nextConditions.filter((c) => c !== 'caído')
    }

    const updatedCombatants = selectedEncounter.combatants.map((c) => {
      if (c.id === quickHpCombatant.id) {
        return {
          ...c,
          hpCurrent: nextHp,
          conditions: nextConditions,
        }
      }
      return c
    })

    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: updatedCombatants,
    }

    await persistEncounter(updated)
    setQuickHpModalOpen(false)
    setQuickHpCombatant(null)

    if (isDamage) {
      toast({
        title: `${quickHpCombatant.name} sofreu ${delta} de dano!`,
        description:
          nextHp === 0 ? 'O combatente caiu em batalha (0 HP).' : `HP atual: ${nextHp}/${max}`,
      })
    } else {
      toast({
        title: `${quickHpCombatant.name} recuperou ${delta} de vida!`,
        description: `HP atual: ${nextHp}/${max}`,
      })
    }
  }

  // Alternar condição
  const handleToggleCondition = async (conditionId: string) => {
    if (!selectedEncounter || !conditionCombatant) return

    const has = conditionCombatant.conditions.includes(conditionId)
    const nextConditions = has
      ? conditionCombatant.conditions.filter((c) => c !== conditionId)
      : [...conditionCombatant.conditions, conditionId]

    const updatedCombatants = selectedEncounter.combatants.map((c) => {
      if (c.id === conditionCombatant.id) {
        return { ...c, conditions: nextConditions }
      }
      return c
    })

    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: updatedCombatants,
    }

    setConditionCombatant({ ...conditionCombatant, conditions: nextConditions })
    await persistEncounter(updated)
  }

  // Atualizar iniciativa individualmente no card
  const handleUpdateInitiativeValue = async (cbtId: string, value: number) => {
    if (!selectedEncounter) return
    const updatedCombatants = selectedEncounter.combatants.map((c) =>
      c.id === cbtId ? { ...c, initiative: value } : c,
    )
    const updated: EncounterRecord = {
      ...selectedEncounter,
      combatants: updatedCombatants,
    }
    await persistEncounter(updated)
  }

  // Filtra combates pelo modo ativo
  const visibleEncounters = encounters.filter((e) => isItemVisibleInMode(e.target_mode, mode))

  if (loading) {
    return (
      <EternumLoadingScreen
        message={t('loading.forgingInitiative')}
        submessage={t('loading.loadingCombatants')}
        fullScreen={false}
      />
    )
  }
  const currentCombatant = selectedEncounter?.combatants[selectedEncounter.current_turn_index]

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 space-y-8 font-sans">
      {/* Cabeçalho do Módulo de Combate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262c3a] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <RuneCombatIcon className="w-6 h-6 mode-accent-text" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
                {t('combat.title')}
              </h1>
              <span className="text-[11px] font-fantasy text-amber-400/80 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <RunicPawIcon className="w-3.5 h-3.5" />
                {t('combat.subtitle')}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#a8a090] max-w-2xl leading-relaxed">
            Rastreador rúnico para mestrar combates: importe aventureiros das fichas e monstros dos
            códices, controle turnos, aplique dano/cura imediato e acompanhe condições em tempo
            real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-[11px] font-mono text-amber-300/70 flex items-center gap-1 animate-pulse">
              <Save className="w-3 h-3" /> Salvando...
            </span>
          )}
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="font-fantasy font-bold gap-1.5 border shadow-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 border-amber-300/40"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Combate</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Lista de Encontros */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-fantasy font-bold text-amber-300 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <RuneCombatIcon className="w-3.5 h-3.5 text-amber-400" />
              Combates Registrados ({visibleEncounters.length})
            </span>
          </div>

          <div className="space-y-2">
            {visibleEncounters.map((enc) => {
              const isSelected = selectedEncounter?.id === enc.id
              const countHeroes = enc.combatants.filter((c) => c.type === 'hero').length
              const countMonsters = enc.combatants.filter((c) => c.type === 'monster').length

              return (
                <div
                  key={enc.id}
                  onClick={() => setSelectedEncounter(enc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group relative ${
                    isSelected
                      ? 'border-amber-400/80 bg-amber-500/15 shadow-md shadow-amber-950/40'
                      : 'border-[#262e40] bg-[#121620] hover:border-amber-500/40 hover:bg-[#161c29]'
                  }`}
                >
                  <div className="shrink-0 p-2 rounded-lg bg-[#1a2130] border border-[#2b3548] text-amber-300 flex items-center justify-center w-10 h-10">
                    <RuneSwordIcon className="w-5 h-5 mode-accent-text" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                        {enc.name}
                      </h3>
                      <span
                        className={`text-[9px] font-fantasy font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                          enc.status === 'Em Andamento'
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                            : enc.status === 'Finalizado'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                              : 'bg-stone-900 border-stone-700 text-stone-300'
                        }`}
                      >
                        {enc.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#9e9688] truncate mt-0.5">
                      Rodada {enc.round} • {enc.combatants.length} combatentes ({countHeroes}H /{' '}
                      {countMonsters}M)
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEncounter(enc.id, enc.name)
                    }}
                    title="Excluir combate"
                    className="opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}

            {visibleEncounters.length === 0 && (
              <div className="p-8 text-center border border-dashed border-[#262c3a] rounded-xl text-xs text-[#8e8678] space-y-2">
                <p>Nenhum combate registrado neste modo.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCreateModalOpen(true)}
                  className="text-xs border-[#2b3548] text-amber-200 hover:bg-amber-500/10"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Criar Primeiro Combate
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Rastreador de Iniciativa do Combate Ativo */}
        <div className="lg:col-span-8">
          {selectedEncounter ? (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-[#161b26] p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Painel Superior do Combate: Rodada, Status e Controles de Turno */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a3448] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <CrestShield className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-fantasy font-bold text-amber-100">
                      {selectedEncounter.name}
                    </h2>
                  </div>
                  {selectedEncounter.description && (
                    <p className="text-xs text-[#b8b0a0] mt-1 max-w-xl">
                      {selectedEncounter.description}
                    </p>
                  )}
                </div>

                {/* Marcador de Rodada & Botões de Avanço */}
                <div className="flex items-center gap-2 sm:self-center">
                  <div className="px-3 py-1.5 rounded-lg bg-[#0e121a] border border-amber-500/30 flex items-center gap-2">
                    <span className="text-[10px] font-fantasy uppercase text-amber-300/80">
                      Rodada
                    </span>
                    <span className="text-base font-fantasy font-bold text-amber-200">
                      {selectedEncounter.round}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevTurn}
                    title="Turno anterior"
                    disabled={selectedEncounter.combatants.length === 0}
                    className="h-8 text-xs border-[#2a3448] text-amber-300 hover:bg-amber-500/10 px-2.5"
                  >
                    Voltar
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleNextTurn}
                    disabled={selectedEncounter.combatants.length === 0}
                    className="h-8 font-fantasy font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 gap-1.5 shadow-sm"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Próximo Turno</span>
                  </Button>
                </div>
              </div>

              {/* Barra de Ações Rápidas: Adicionar Combatente, Reordenar, Reiniciar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#0e121a]/80 p-3 rounded-xl border border-[#263042]">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setAddCombatantModalOpen(true)}
                    className="h-7 text-xs font-fantasy font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30"
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Adicionar Combatente
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReorderInitiative}
                    title="Ordenar por iniciativa do maior para o menor"
                    className="h-7 text-xs border-[#2a3448] text-amber-300/90 hover:text-amber-100 hover:bg-amber-500/10"
                  >
                    <ArrowUpDown className="w-3 h-3 mr-1" />
                    Ordenar Iniciativa
                  </Button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetCombat}
                    title="Reiniciar rodadas e turnos"
                    className="h-7 text-xs text-[#a39b8d] hover:text-amber-200 hover:bg-amber-500/10"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Reiniciar
                  </Button>
                  {selectedEncounter.status !== 'Finalizado' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFinishCombat}
                      className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Finalizar
                    </Button>
                  ) : (
                    <span className="text-[11px] font-fantasy text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Concluído
                    </span>
                  )}
                </div>
              </div>

              {/* Card Destaque: Turno Atual */}
              {currentCombatant && (
                <div className="p-4 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-500/20 via-amber-950/30 to-[#121620] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-200 shadow-md">
                        <RunicInsignia
                          name={currentCombatant.avatar || 'sword'}
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono bg-amber-400 text-slate-950 shadow-xs">
                        AGORA
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-fantasy uppercase text-amber-300 font-bold tracking-wider">
                          Vez Atual (Turno {(selectedEncounter.current_turn_index || 0) + 1} de{' '}
                          {selectedEncounter.combatants.length})
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] uppercase border-amber-400/40 text-amber-200 font-mono"
                        >
                          {currentCombatant.type === 'hero'
                            ? 'Herói'
                            : currentCombatant.type === 'monster'
                              ? 'Monstro'
                              : 'NPC'}
                        </Badge>
                      </div>
                      <h3 className="text-base font-fantasy font-bold text-amber-100">
                        {currentCombatant.name}
                      </h3>
                      {currentCombatant.notes && (
                        <p className="text-xs text-amber-200/80 italic mt-0.5">
                          {currentCombatant.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:border-l sm:border-amber-500/30 sm:pl-4">
                    <div className="text-center">
                      <span className="text-[10px] uppercase text-amber-300/70 block font-mono">
                        Iniciativa
                      </span>
                      <span className="text-lg font-bold font-mono text-amber-200">
                        {currentCombatant.initiative}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase text-amber-300/70 block font-mono">
                        CA
                      </span>
                      <span className="text-lg font-bold font-mono text-amber-200">
                        {currentCombatant.ac}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase text-rose-300/80 block font-mono">
                        Vida (HP)
                      </span>
                      <span
                        className={`text-lg font-bold font-mono ${currentCombatant.hpCurrent === 0 ? 'text-rose-400' : 'text-emerald-300'}`}
                      >
                        {currentCombatant.hpCurrent}/{currentCombatant.hpMax}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista dos Combatentes Ordenados na Ordem de Iniciativa */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-fantasy font-bold text-amber-300 uppercase tracking-wider px-1">
                  <span>Ordem da Iniciativa ({selectedEncounter.combatants.length})</span>
                  <span className="text-[10px] text-[#9e9688] font-mono">
                    Do maior valor ao menor • Clique em Dano/Cura para atualizar
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedEncounter.combatants.map((cbt, idx) => {
                    const isTurn = idx === selectedEncounter.current_turn_index
                    const isDead = cbt.hpCurrent === 0 || cbt.conditions.includes('caído')
                    const hpPercent = Math.max(
                      0,
                      Math.min(100, Math.round((cbt.hpCurrent / cbt.hpMax) * 100)),
                    )

                    return (
                      <div
                        key={cbt.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isTurn
                            ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-950/30'
                            : isDead
                              ? 'border-rose-950/60 bg-[#101217]/90 opacity-70'
                              : 'border-[#262e40] bg-[#121620] hover:border-amber-500/30'
                        }`}
                      >
                        {/* Identificação e Avatar */}
                        <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                          <div
                            className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                              isTurn
                                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                                : isDead
                                  ? 'bg-rose-950/30 border-rose-900/50 text-rose-400'
                                  : 'bg-[#1a2130] border-[#2b3548] text-amber-300'
                            }`}
                          >
                            <RunicInsignia name={cbt.avatar || 'sword'} className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-fantasy font-bold text-amber-100 truncate">
                                {cbt.name}
                              </span>
                              {isTurn && (
                                <Badge className="text-[9px] font-fantasy font-bold bg-amber-400 text-slate-950 px-1 py-0 h-4">
                                  Vez
                                </Badge>
                              )}
                              {isDead && (
                                <Badge className="text-[9px] font-fantasy font-bold bg-rose-950 text-rose-300 border-rose-700/50 px-1 py-0 h-4">
                                  Caído
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-[#9e9688] truncate">
                              {cbt.type === 'hero'
                                ? 'Herói da Campanha'
                                : cbt.type === 'monster'
                                  ? 'Monstro / Oponente'
                                  : 'NPC da Mesa'}
                              {cbt.notes ? ` • ${cbt.notes}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Estatísticas Numéricas: Iniciativa, CA e Barra de Vida */}
                        <div className="flex items-center gap-4 md:w-1/3 justify-between sm:justify-start">
                          {/* Iniciativa editável */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-amber-300/80 uppercase">
                              Inic:
                            </span>
                            <Input
                              type="number"
                              value={cbt.initiative}
                              onChange={(e) =>
                                handleUpdateInitiativeValue(
                                  cbt.id,
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="w-12 h-7 text-xs font-mono font-bold text-center bg-[#0c1017] border-[#2a3448] text-amber-200 p-0"
                            />
                          </div>

                          {/* Classe de Armadura */}
                          <div className="flex items-center gap-1 shrink-0 text-xs font-mono text-amber-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400/80" />
                            <span>CA {cbt.ac}</span>
                          </div>

                          {/* Barra de Vida */}
                          <div className="flex-1 min-w-[110px] space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-rose-400 flex items-center gap-0.5">
                                <Heart className="w-2.5 h-2.5 fill-rose-500" /> HP
                              </span>
                              <span
                                className={
                                  cbt.hpCurrent === 0
                                    ? 'text-rose-400 font-bold'
                                    : 'text-emerald-300'
                                }
                              >
                                {cbt.hpCurrent}/{cbt.hpMax}
                              </span>
                            </div>
                            <div className="w-full bg-[#1c2230] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  cbt.hpCurrent === 0
                                    ? 'bg-rose-900'
                                    : hpPercent < 30
                                      ? 'bg-rose-500'
                                      : hpPercent < 60
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                }`}
                                style={{ width: `${hpPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Condições & Ações Rápidas (Dano/Cura, Status, Remover) */}
                        <div className="flex items-center gap-2 justify-end md:w-1/3">
                          {/* Etiquetas de condições */}
                          <div className="flex items-center gap-1 flex-wrap max-w-[130px] justify-end">
                            {cbt.conditions.map((cond) => {
                              const found = AVAILABLE_CONDITIONS.find((c) => c.id === cond)
                              return (
                                <span
                                  key={cond}
                                  className={`text-[9px] font-fantasy px-1.5 py-0.2 rounded border truncate ${
                                    found?.color ||
                                    'border-stone-500/40 text-stone-200 bg-stone-900'
                                  }`}
                                >
                                  {found?.label || cond}
                                </span>
                              )
                            })}
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setConditionCombatant(cbt)
                              setConditionModalOpen(true)
                            }}
                            title="Gerenciar condições e status"
                            className="h-7 px-2 text-[11px] border-[#2b3548] text-amber-300 hover:bg-amber-500/10"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Status
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => {
                              setQuickHpCombatant(cbt)
                              setQuickHpModalOpen(true)
                            }}
                            title="Aplicar dano ou cura rápida"
                            className="h-7 px-2.5 text-[11px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30"
                          >
                            <HeartPulse className="w-3 h-3 mr-1 text-rose-400" />
                            HP
                          </Button>

                          <button
                            onClick={() => handleRemoveCombatant(cbt.id)}
                            title="Remover combatente do encontro"
                            className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {selectedEncounter.combatants.length === 0 && (
                    <div className="p-8 text-center border border-dashed border-[#262c3a] rounded-xl text-xs text-[#8e8678] space-y-2">
                      <p>Nenhum combatente adicionado a esta batalha.</p>
                      <Button
                        size="sm"
                        onClick={() => setAddCombatantModalOpen(true)}
                        className="text-xs bg-amber-500 text-slate-950 font-fantasy font-bold"
                      >
                        <UserPlus className="w-3.5 h-3.5 mr-1" />
                        Adicionar Heróis ou Monstros
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-[#262c3a] rounded-2xl text-xs text-[#8e8678] space-y-3">
              <RuneCombatIcon className="w-8 h-8 text-amber-400/50 mx-auto" />
              <p className="text-sm font-fantasy text-amber-200">Nenhum combate selecionado</p>
              <p>
                Escolha um combate ao lado ou forje um novo encontro para iniciar o rastreador de
                iniciativa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DIÁLOGO: Criar Novo Combate */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-lg text-amber-100 flex items-center gap-2">
              <RuneCombatIcon className="w-5 h-5 mode-accent-text" />
              Forjar Novo Combate Tático
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Título do Encontro / Batalha
              </label>
              <Input
                value={newEncounterName}
                onChange={(e) => setNewEncounterName(e.target.value)}
                placeholder="Ex.: Batalha no Salão das Runas Quebradas"
                className="bg-[#0c1017] border-[#2c3548] text-amber-100 font-fantasy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-fantasy font-bold text-amber-200">
                Descrição ou Notas da Arena (Opcional)
              </label>
              <Textarea
                value={newEncounterDesc}
                onChange={(e) => setNewEncounterDesc(e.target.value)}
                placeholder="Descreva a iluminação, obstáculos, armadilhas ou objetivos..."
                className="bg-[#0c1017] border-[#2c3548] text-xs text-[#d1c8b8] h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              className="text-xs text-[#a39b8d]"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleCreateEncounter}
              className="font-fantasy font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              Criar Combate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: Adicionar Combatente (Fichas, NPCs, Códice, Avulso) */}
      <Dialog open={addCombatantModalOpen} onOpenChange={setAddCombatantModalOpen}>
        <DialogContent className="max-w-2xl bg-[#121620] border-[#2c3547] text-[#f1ede3] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-lg text-amber-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 mode-accent-text" />
              Adicionar Combatente ao Encontro
            </DialogTitle>
          </DialogHeader>

          {/* Abas de Origem */}
          <div className="flex rounded-lg bg-[#0c1017] p-1 border border-[#2b3548] gap-1 shrink-0">
            <button
              onClick={() => setCombatantSourceTab('herois')}
              className={`flex-1 py-1.5 px-2 text-xs font-fantasy font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                combatantSourceTab === 'herois'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-[#8e8678] hover:text-amber-100'
              }`}
            >
              <RuneScrollIcon className="w-3.5 h-3.5" />
              Fichas de Heróis ({availablePages.length})
            </button>
            <button
              onClick={() => setCombatantSourceTab('npcs')}
              className={`flex-1 py-1.5 px-2 text-xs font-fantasy font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                combatantSourceTab === 'npcs'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-[#8e8678] hover:text-amber-100'
              }`}
            >
              <RuneSwordIcon className="w-3.5 h-3.5" />
              Fichas de NPCs ({availableNpcs.length})
            </button>
            <button
              onClick={() => setCombatantSourceTab('codices')}
              className={`flex-1 py-1.5 px-2 text-xs font-fantasy font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                combatantSourceTab === 'codices'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-[#8e8678] hover:text-amber-100'
              }`}
            >
              <RuneTomeIcon className="w-3.5 h-3.5" />
              Códices & Bestiários
            </button>
            <button
              onClick={() => setCombatantSourceTab('avulso')}
              className={`flex-1 py-1.5 px-2 text-xs font-fantasy font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                combatantSourceTab === 'avulso'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-[#8e8678] hover:text-amber-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Avulso Rápido
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-3">
            {/* Lista de Heróis (Páginas) */}
            {combatantSourceTab === 'herois' && (
              <div className="space-y-2">
                {availablePages.map((p) => {
                  const stats = extractHeroStatsFromPage(p)
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-[#262e40] bg-[#151a25] hover:border-amber-500/40 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                          <RunicInsignia name={p.icon || 'scroll'} className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-fantasy font-bold text-amber-100">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-[#9e9688]">
                            HP Estimado: {stats.hp} • CA: {stats.ac}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleImportHeroFromPage(p)}
                        className="text-xs font-fantasy font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 h-7"
                      >
                        Importar Herói
                      </Button>
                    </div>
                  )
                })}
                {availablePages.length === 0 && (
                  <p className="text-xs text-stone-400 italic text-center py-6">
                    Nenhuma ficha de herói encontrada nas crônicas.
                  </p>
                )}
              </div>
            )}

            {/* Lista de NPCs */}
            {combatantSourceTab === 'npcs' && (
              <div className="space-y-2">
                {availableNpcs.map((npc) => (
                  <div
                    key={npc.id}
                    className="p-3 rounded-xl border border-[#262e40] bg-[#151a25] hover:border-amber-500/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                        <RunicInsignia name={npc.avatar || 'npc'} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-fantasy font-bold text-amber-100">
                          {npc.name}
                        </h4>
                        <p className="text-[11px] text-[#9e9688]">
                          {npc.species || npc.race} • HP {npc.hp || 20} • CA {npc.ac || 12}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleImportNpc(npc)}
                      className="text-xs font-fantasy font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 h-7"
                    >
                      Importar NPC
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Lista de Códices / Bestiários */}
            {combatantSourceTab === 'codices' && (
              <div className="space-y-4">
                {availableDatabases.map((db) => {
                  const rows = db.rows || []
                  if (rows.length === 0) return null

                  return (
                    <div key={db.id} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-fantasy text-amber-300 font-bold uppercase tracking-wider">
                        <RuneTomeIcon className="w-3.5 h-3.5" />
                        <span>{db.name}</span>
                      </div>
                      <div className="space-y-1.5">
                        {rows.slice(0, 8).map((r, rIdx) => (
                          <div
                            key={r.id || rIdx}
                            className="p-2.5 rounded-lg border border-[#262e40] bg-[#151a25] flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <span className="font-fantasy font-bold text-amber-100 block">
                                {r.col_name || r.col_title || 'Entrada do Códice'}
                              </span>
                              <span className="text-[11px] text-[#9e9688]">
                                {r.col_type || ''} {r.col_cr ? `• ${r.col_cr}` : ''}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleImportFromDatabaseRow(r, db.name)}
                              className="text-xs border-[#2b3548] text-amber-200 hover:bg-amber-500/10 h-7"
                            >
                              Adicionar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Formulário Avulso */}
            {combatantSourceTab === 'avulso' && (
              <div className="space-y-3 p-2 bg-[#0c1017] rounded-xl border border-[#2b3548]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200">
                      Nome do Combatente
                    </label>
                    <Input
                      value={manualCombatant.name}
                      onChange={(e) =>
                        setManualCombatant({ ...manualCombatant, name: e.target.value })
                      }
                      placeholder="Ex.: Lobo da Caverna, Guarda do Portão..."
                      className="bg-[#121620] border-[#2c3548] text-xs text-amber-100 font-fantasy"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200">
                      Categoria
                    </label>
                    <select
                      value={manualCombatant.type}
                      onChange={(e) =>
                        setManualCombatant({
                          ...manualCombatant,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full h-9 rounded-md bg-[#121620] border border-[#2c3548] text-xs text-amber-100 px-2.5 font-fantasy"
                    >
                      <option value="hero">Herói / Aliado</option>
                      <option value="monster">Monstro / Inimigo</option>
                      <option value="npc">NPC Neutro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200">
                      Iniciativa
                    </label>
                    <Input
                      type="number"
                      value={manualCombatant.initiative}
                      onChange={(e) =>
                        setManualCombatant({
                          ...manualCombatant,
                          initiative: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="bg-[#121620] border-[#2c3548] text-xs font-mono text-center text-amber-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200">
                      Vida Máxima (HP)
                    </label>
                    <Input
                      type="number"
                      value={manualCombatant.hpMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1
                        setManualCombatant({
                          ...manualCombatant,
                          hpMax: val,
                          hpCurrent: val,
                        })
                      }}
                      className="bg-[#121620] border-[#2c3548] text-xs font-mono text-center text-amber-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200">
                      Armadura (CA)
                    </label>
                    <Input
                      type="number"
                      value={manualCombatant.ac}
                      onChange={(e) =>
                        setManualCombatant({
                          ...manualCombatant,
                          ac: parseInt(e.target.value, 10) || 10,
                        })
                      }
                      className="bg-[#121620] border-[#2c3548] text-xs font-mono text-center text-amber-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-fantasy font-bold text-amber-200">
                    Notas Táticas / Habilidade
                  </label>
                  <Input
                    value={manualCombatant.notes}
                    onChange={(e) =>
                      setManualCombatant({ ...manualCombatant, notes: e.target.value })
                    }
                    placeholder="Ex.: Ataque duplo com mordida; vulnerabilidade a fogo"
                    className="bg-[#121620] border-[#2c3548] text-xs text-[#d1c8b8]"
                  />
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    if (!manualCombatant.name.trim()) {
                      toast({ title: 'Informe o nome do combatente' })
                      return
                    }
                    handleAddCombatant({
                      name: manualCombatant.name.trim(),
                      type: manualCombatant.type,
                      source: 'avulso',
                      initiative: manualCombatant.initiative,
                      hpCurrent: manualCombatant.hpCurrent,
                      hpMax: manualCombatant.hpMax,
                      ac: manualCombatant.ac,
                      conditions: [],
                      notes: manualCombatant.notes.trim(),
                    })
                    setManualCombatant({
                      name: '',
                      type: 'monster',
                      initiative: 10,
                      hpMax: 20,
                      hpCurrent: 20,
                      ac: 12,
                      notes: '',
                    })
                  }}
                  className="w-full font-fantasy font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 mt-2"
                >
                  Adicionar ao Combate
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: Aplicar Dano ou Cura Rápido */}
      <Dialog open={quickHpModalOpen} onOpenChange={setQuickHpModalOpen}>
        <DialogContent className="max-w-sm bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-base text-amber-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              Dano & Cura: {quickHpCombatant?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-center">
            <div className="p-3 rounded-lg bg-[#0c1017] border border-[#2b3548] flex items-center justify-around">
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-mono">
                  Vida Atual
                </span>
                <span
                  className={`text-xl font-bold font-mono ${quickHpCombatant?.hpCurrent === 0 ? 'text-rose-400' : 'text-emerald-300'}`}
                >
                  {quickHpCombatant?.hpCurrent}
                </span>
              </div>
              <span className="text-stone-600 font-mono">/</span>
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-mono">
                  Vida Máxima
                </span>
                <span className="text-xl font-bold font-mono text-stone-200">
                  {quickHpCombatant?.hpMax}
                </span>
              </div>
            </div>

            {/* Valor Numérico do Impacto */}
            <div className="space-y-2">
              <label className="text-xs font-fantasy text-amber-200">Quantidade de Pontos</label>
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHpDeltaValue(Math.max(1, hpDeltaValue - 5))}
                  className="h-8 w-8 p-0 text-xs border-[#2b3548] text-amber-300"
                >
                  -5
                </Button>
                <Input
                  type="number"
                  value={hpDeltaValue}
                  onChange={(e) => setHpDeltaValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 h-9 text-base font-mono font-bold text-center bg-[#0c1017] border-[#2c3548] text-amber-200"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHpDeltaValue(hpDeltaValue + 5)}
                  className="h-8 w-8 p-0 text-xs border-[#2b3548] text-amber-300"
                >
                  +5
                </Button>
              </div>

              {/* Botões pré-definidos */}
              <div className="flex justify-center gap-1.5 pt-1">
                {[1, 5, 10, 15, 20].map((v) => (
                  <button
                    key={v}
                    onClick={() => setHpDeltaValue(v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      hpDeltaValue === v
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        : 'border-[#263040] text-[#9e9688] hover:text-amber-100'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Ações: Dano ou Cura */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => handleApplyDamageOrHeal(true)}
                className="font-fantasy font-bold text-xs bg-rose-600 hover:bg-rose-500 text-rose-50 border border-rose-400/40"
              >
                Aplicar Dano (-{hpDeltaValue})
              </Button>
              <Button
                onClick={() => handleApplyDamageOrHeal(false)}
                className="font-fantasy font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-emerald-50 border border-emerald-400/40"
              >
                Aplicar Cura (+{hpDeltaValue})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO: Gerenciar Condições / Status */}
      <Dialog open={conditionModalOpen} onOpenChange={setConditionModalOpen}>
        <DialogContent className="max-w-md bg-[#121620] border-[#2c3547] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-base text-amber-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Condições: {conditionCombatant?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-[#a8a090]">
              Selecione as condições ativas sobre o combatente. Elas serão exibidas como insígnias
              sóbrias no card.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_CONDITIONS.map((cond) => {
                const isSelected = conditionCombatant?.conditions.includes(cond.id)
                return (
                  <button
                    key={cond.id}
                    onClick={() => handleToggleCondition(cond.id)}
                    className={`p-2 rounded-lg border text-xs font-fantasy text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? `${cond.color} shadow-xs font-bold`
                        : 'border-[#242b3b] bg-[#0c1017] text-[#9e9688] hover:border-amber-500/30'
                    }`}
                  >
                    <span>{cond.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setConditionModalOpen(false)
                setConditionCombatant(null)
              }}
              className="font-fantasy font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

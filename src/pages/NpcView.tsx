import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppMode, isItemVisibleInMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { npcsService, NpcRecord, NpcStatus } from '@/services/npcs'
import { CHARACTER_TEMPLATES, CharacterTemplate } from '@/services/characterTemplates'
import { RpgInventoryTab } from '@/components/rpg/RpgInventoryTab'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import {
  RuneNpcIcon,
  RunicInsignia,
  RUNIC_INSIGNIA_CATALOG,
  RuneSwordIcon,
  RuneSparklesIcon,
  RuneSkullIcon,
} from '@/components/rpg/EternumIcons'
import {
  Users,
  Plus,
  Shield,
  Heart,
  Skull,
  HelpCircle,
  Eye,
  Key,
  MapPin,
  Sparkles,
  Edit,
  Trash2,
  Save,
  X,
  Swords,
  BookOpen,
  HeartHandshake,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RunicCircle, TomeOrnament, CrestShield, RunicPawIcon } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

function getModifier(score?: number): string {
  if (score === undefined || score === null) return '+0'
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default function NpcView() {
  const navigate = useNavigate()
  const { mode } = useAppMode()
  const { t, language } = useLanguage()
  const [npcs, setNpcs] = useState<NpcRecord[]>([])
  const [selectedNpc, setSelectedNpc] = useState<NpcRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  // Modo de visualização/edição da ficha: inicializado coerentemente com o modo global (rp -> 'rp', rpg -> 'rpg' ou 'hibrido')
  const [sheetTab, setSheetTab] = useState<'hibrido' | 'rp' | 'rpg'>(() =>
    mode === 'rp' ? 'rp' : 'hibrido',
  )

  // Edit form states
  const [formData, setFormData] = useState<Partial<NpcRecord>>({})

  const loadNpcs = async () => {
    setLoading(true)
    try {
      const list = await npcsService.list()
      setNpcs(list)
      if (list.length > 0 && !selectedNpc) {
        setSelectedNpc(list[0])
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao carregar NPCs' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNpcs()
  }, [])

  const handleSelectNpc = (npc: NpcRecord) => {
    setSelectedNpc(npc)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleApplyTemplate = (tpl: CharacterTemplate) => {
    setFormData((prev) => ({
      ...prev,
      ...tpl.initialData,
      personality: {
        ...(prev.personality || {}),
        ...(tpl.initialData.personality || {}),
      },
      target_mode: prev.target_mode || (mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral'),
    }))
    toast({
      title: `Modelo "${language === 'en' ? tpl.titleEn : tpl.title}" aplicado!`,
      description: 'Você pode editar livremente qualquer detalhe da ficha.',
    })
  }

  const handleStartCreate = (presetTemplateKey?: string) => {
    setIsCreating(true)
    setIsEditing(true)
    setSelectedNpc(null)

    if (presetTemplateKey) {
      const found = CHARACTER_TEMPLATES.find((t) => t.key === presetTemplateKey)
      if (found) {
        setFormData({
          ...found.initialData,
          personality: { ...(found.initialData.personality || {}) },
          target_mode: mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral',
        })
        return
      }
    }

    setFormData({
      name: 'Novo Personagem / NPC',
      species: 'Lobo Cinzento Antropomórfico',
      race: 'Canino / Fera Nobre',
      occupation: 'Batedor / Viajante',
      location: 'Vila da Pedra Alta',
      alignment: 'Neutro e Bom',
      status: 'Vivo',
      appearance:
        'Pelagem cinzenta densa, olhos cor de âmbar vigilantes, gibão de couro reforçado e capa de viagem com broche rúnico...',
      bio: 'Biografia de roleplay: origens, acontecimentos que moldaram o personagem e motivações...',
      relationships: 'Vínculos com aliados, facções, rivais ou mentores da campanha...',
      hp: 24,
      ac: 13,
      cr: 'ND 1',
      str: 12,
      dex: 14,
      con: 12,
      int: 10,
      wis: 14,
      cha: 10,
      personality: {
        traits: 'Calmo e observador, confia nos instintos e escuta o vento antes de agir.',
        ideals: 'A lealdade à matilha e a proteção dos que não podem lutar.',
        bonds: 'Guarda uma bússola de prata legada por sua família.',
        flaws: 'Reticente em confiar em estranhos que ocultam o rosto.',
      },
      secrets: 'Segredo oculto deste personagem que os outros podem descobrir durante o jogo...',
      notes: 'Ganchos de cenas narrativas e missões...',
      avatar: 'wolf',
      target_mode: mode === 'rp' ? 'rp' : mode === 'rpg' ? 'rpg' : 'geral',
    })
  }

  const handleStartEdit = () => {
    if (!selectedNpc) return
    setIsEditing(true)
    setIsCreating(false)
    setFormData({
      ...selectedNpc,
      personality: { ...(selectedNpc.personality || {}) },
    })
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast({ title: 'Nome obrigatório' })
      return
    }

    try {
      if (isCreating) {
        const created = await npcsService.create(formData as any)
        toast({ title: 'Personagem Criado com Sucesso!' })
        setIsCreating(false)
        setIsEditing(false)
        await loadNpcs()
        setSelectedNpc(created)
      } else if (selectedNpc) {
        const updated = await npcsService.update(selectedNpc.id, formData)
        toast({ title: 'Ficha Atualizada!' })
        setIsEditing(false)
        await loadNpcs()
        setSelectedNpc(updated)
      }
    } catch (err: any) {
      toast({ title: 'Falha ao salvar personagem', description: err?.message })
    }
  }

  const handleDelete = async () => {
    if (!selectedNpc) return
    if (!confirm(`Deseja apagar a ficha de "${selectedNpc.name}"?`)) return

    try {
      await npcsService.delete(selectedNpc.id)
      toast({ title: 'Personagem removido do códice' })
      const remaining = npcs.filter((n) => n.id !== selectedNpc.id)
      setNpcs(remaining)
      setSelectedNpc(remaining[0] || null)
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  // Filtrar NPCs pelo modo ativo usando isItemVisibleInMode:
  // Geral: todos
  // RPG: apenas 'rpg' ou 'geral'
  // RP: apenas 'rp' ou 'geral'
  const visibleNpcs = npcs.filter((n) => isItemVisibleInMode(n.target_mode, mode))

  const active = isEditing ? (formData as NpcRecord) : selectedNpc

  if (loading) {
    return (
      <EternumLoadingScreen
        message={t('loading.summoningNpcs')}
        submessage={t('loading.loadingBestiaryFactions')}
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
              <RuneNpcIcon className="w-6 h-6 mode-accent-text" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              {mode === 'rp' ? t('npcs.titleRp') : t('npcs.titleRpg')}
            </h1>
          </div>
          <p className="text-xs text-[#a8a090] max-w-2xl leading-relaxed">
            {mode === 'rp' ? t('npcs.subtitleRp') : t('npcs.subtitleRpg')}
          </p>
        </div>

        <Button
          onClick={() => handleStartCreate()}
          className={`font-fantasy font-bold gap-1.5 border shadow-sm ${
            mode === 'rp'
              ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-purple-50 border-purple-300/40'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 border-amber-300/40'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>{t('npcs.createNpc')}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Lista de NPCs */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-fantasy font-bold text-amber-300 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <RunicPawIcon className="w-3.5 h-3.5 text-amber-400" />
              Personagens no Tomo ({visibleNpcs.length})
            </span>
          </div>

          <div className="space-y-2">
            {visibleNpcs.map((npc) => {
              const isSelected = selectedNpc?.id === npc.id && !isCreating
              return (
                <div
                  key={npc.id}
                  onClick={() => handleSelectNpc(npc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${
                    isSelected
                      ? 'border-amber-400/80 bg-amber-500/15 shadow-md shadow-amber-950/40'
                      : 'border-[#262e40] bg-[#121620] hover:border-amber-500/40 hover:bg-[#161c29]'
                  }`}
                >
                  <span className="shrink-0 p-2 rounded-lg bg-[#1a2130] border border-[#2b3548] text-amber-300 flex items-center justify-center w-10 h-10">
                    <RunicInsignia name={npc.avatar || 'npc'} className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                        {npc.name}
                      </h3>
                      {mode === 'geral' && npc.target_mode && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded font-mono text-amber-200/60 border border-white/10 shrink-0">
                          {npc.target_mode}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9e9688] truncate flex items-center gap-1">
                      {npc.species || npc.race} • {npc.occupation}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-fantasy font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                      npc.status === 'Vivo'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : npc.status === 'Morto'
                          ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                          : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {npc.status}
                  </span>
                </div>
              )
            })}

            {npcs.length === 0 && !loading && (
              <div className="p-8 text-center border border-dashed border-[#262c3a] rounded-xl text-xs text-[#8e8678]">
                Nenhum personagem registrado. Clique em "+ Novo Personagem" para forjar sua primeira
                ficha!
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Ficha / Stat Block Híbrido */}
        <div className="lg:col-span-8">
          {active ? (
            <div className="relative rounded-2xl border-2 border-amber-500/40 bg-[#161b26] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Seletor de Modelos Prontos de Ficha (ao criar ou editar) */}
              {isEditing && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#121622] to-purple-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-fantasy font-bold text-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {language === 'en'
                          ? 'Preset Character Templates'
                          : 'Modelos Prontos de Ficha'}
                      </h4>
                      <p className="text-[11px] text-[#a39b8c] mt-0.5">
                        {language === 'en'
                          ? 'Select a ready template to auto-fill the sheet, then customize as you wish.'
                          : 'Escolha um arquétipo balanceado para preencher a ficha instantaneamente e edite por cima.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {CHARACTER_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.key}
                        type="button"
                        onClick={() => handleApplyTemplate(tpl)}
                        className="text-left p-2.5 rounded-lg border border-[#2b3548] bg-[#0d1118]/80 hover:border-amber-400/80 hover:bg-amber-500/10 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-fantasy font-bold text-amber-100 group-hover:text-amber-300 flex items-center gap-1.5">
                              {tpl.key === 'combatente' && (
                                <RuneSwordIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              {tpl.key === 'arcanista' && (
                                <RuneSparklesIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              )}
                              {tpl.key === 'vilao' && (
                                <RuneSkullIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              )}
                              <span>{language === 'en' ? tpl.titleEn : tpl.title}</span>
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {language === 'en' ? tpl.badgeEn : tpl.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#9a9282] leading-tight line-clamp-2">
                            {language === 'en' ? tpl.descriptionEn : tpl.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#1c2433] flex items-center justify-between text-[10px] font-mono text-amber-300/80">
                          <span>
                            HP {tpl.previewStats.hp} • CA {tpl.previewStats.ac}
                          </span>
                          <span className="text-[10px] font-fantasy font-bold text-amber-400 group-hover:underline">
                            {language === 'en' ? 'Use Template →' : 'Usar Modelo →'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de Ação & Abas de Formato (Híbrido / RP / RPG) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a3448] pb-4">
                <div className="flex items-center gap-2">
                  <CrestShield className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300">
                    {isCreating
                      ? 'Forjando Nova Ficha'
                      : isEditing
                        ? 'Editando Ficha de Personagem'
                        : 'Ficha de Campanha & Interpretação'}
                  </span>
                </div>

                {/* Alternador de visualização rápida */}
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-[#0e121a] p-0.5 border border-[#2a3448]">
                    <button
                      onClick={() => setSheetTab('hibrido')}
                      className={`px-2.5 py-1 text-[11px] font-fantasy font-semibold rounded-md transition-colors ${
                        sheetTab === 'hibrido'
                          ? 'mode-accent-bg mode-accent-text border mode-accent-border'
                          : 'text-[#9c9486] hover:text-amber-100'
                      }`}
                      title="Exibir seções narrativas de RP e dados de RPG lado a lado"
                    >
                      Completo
                    </button>
                    <button
                      onClick={() => setSheetTab('rp')}
                      className={`px-2.5 py-1 text-[11px] font-fantasy font-semibold rounded-md transition-colors ${
                        sheetTab === 'rp'
                          ? 'mode-accent-bg mode-accent-text border mode-accent-border'
                          : 'text-[#9c9486] hover:text-amber-100'
                      }`}
                      title="Foco narrativo de RP: espécie, bio, personalidade, relações"
                    >
                      RP Narrativo
                    </button>
                    <button
                      onClick={() => setSheetTab('rpg')}
                      className={`px-2.5 py-1 text-[11px] font-fantasy font-semibold rounded-md transition-colors ${
                        sheetTab === 'rpg'
                          ? 'mode-accent-bg mode-accent-text border mode-accent-border'
                          : 'text-[#9c9486] hover:text-amber-100'
                      }`}
                      title="Foco tático de RPG: CA, HP, atributos e ND"
                    >
                      RPG Tático
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {!isCreating && active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/characters/${active.id}`)}
                        className="text-xs border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 font-fantasy font-bold"
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
                        {t('characterDetail.openSubpageButton') || 'Dossiê do Personagem'}
                      </Button>
                    )}

                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false)
                            setIsCreating(false)
                          }}
                          className="text-xs text-[#a39b8d]"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                        >
                          <Save className="h-3.5 w-3.5 mr-1" /> Salvar Ficha
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleStartEdit}
                          className="text-xs border-[#2a3448] text-amber-300 hover:bg-amber-500/10"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="text-xs text-rose-400 hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cabeçalho do Personagem */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-fantasy font-bold text-amber-200">
                        Nome do Personagem
                      </label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0c1017] border-[#2c3548] text-amber-100 font-fantasy font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy font-bold text-amber-200">
                        Insígnia Rúnica
                      </label>
                      <select
                        value={formData.avatar || 'npc'}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        className="w-full h-9 rounded-md bg-[#0c1017] border border-[#2c3444] px-2 text-xs text-amber-100 font-fantasy"
                      >
                        <option value="npc">Busto Nobre (Padrão)</option>
                        {RUNIC_INSIGNIA_CATALOG.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center w-14 h-14">
                      <RunicInsignia name={active.avatar || 'npc'} className="w-8 h-8" />
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-fantasy font-extrabold text-amber-100">
                        {active.name}
                      </h2>
                      <p className="text-xs text-amber-300/80 italic font-serif flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-amber-200 font-semibold not-italic">
                          <RunicPawIcon className="w-3 h-3 text-amber-400" />
                          {active.species || active.race || 'Espécie não anotada'}
                        </span>
                        <span>•</span>
                        <span>{active.occupation}</span>
                        <span>•</span>
                        <span>{active.alignment}</span>
                      </p>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[11px] font-fantasy text-amber-200 flex items-center gap-1">
                        <RunicPawIcon className="w-3 h-3 text-amber-400" />
                        Espécie Antropomórfica
                      </label>
                      <Input
                        value={formData.species || formData.race || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            species: e.target.value,
                            race: e.target.value,
                          })
                        }
                        placeholder="Ex: Raposa, Lobo, Leopardo, Dragão..."
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy text-amber-200">
                        Ocupação / Classe
                      </label>
                      <Input
                        value={formData.occupation || ''}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy text-amber-200">Alinhamento</label>
                      <Input
                        value={formData.alignment || ''}
                        onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy text-amber-200">Status</label>
                      <select
                        value={formData.status || 'Vivo'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as NpcStatus })
                        }
                        className="w-full h-9 rounded-md bg-[#0c1017] border border-[#2c3548] px-2 text-xs text-amber-100"
                      >
                        <option value="Vivo">Vivo</option>
                        <option value="Desconhecido">Desconhecido</option>
                        <option value="Morto">Morto</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-fantasy text-amber-200">
                        Modo de Destino
                      </label>
                      <select
                        value={formData.target_mode || 'geral'}
                        onChange={(e) =>
                          setFormData({ ...formData, target_mode: e.target.value as any })
                        }
                        className="w-full h-9 rounded-md bg-[#0c1017] border border-[#2c3548] px-2 text-xs text-amber-100"
                      >
                        <option value="geral">Geral (Visível no RPG e RP)</option>
                        <option value="rpg">RPG (Apenas no modo RPG)</option>
                        <option value="rp">RP (Apenas no modo RP)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <TomeOrnament className="w-full h-3 text-amber-500/40" />

              {/* SEÇÃO RP NARRATIVO: Biografia, Relações e Cenas (Exibida em 'hibrido' e 'rp') */}
              {(sheetTab === 'hibrido' || sheetTab === 'rp') && (
                <div className="p-4 rounded-xl bg-[#0f141f] border border-amber-500/25 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#242c3d] pb-2">
                    <span className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Dimensão de RP (Roleplay & Narrativa)
                    </span>
                    <span className="text-[10px] text-amber-300/60 font-fantasy">
                      Espécie:{' '}
                      <strong>{active.species || active.race || 'Definida na ficha'}</strong>
                    </span>
                  </div>

                  {/* Biografia Narrativa */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200 block">
                      Biografia & Origem do Personagem
                    </label>
                    {isEditing ? (
                      <Textarea
                        rows={3}
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Origens, histórico do clã/matilha e o que move o personagem..."
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100 leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-[#c4bcaa] leading-relaxed italic bg-[#0c1017]/60 p-3 rounded-lg border border-[#222a3b]">
                        {active.bio || 'Nenhuma biografia detalhada inscrita ainda.'}
                      </p>
                    )}
                  </div>

                  {/* Vínculos e Relações (RP) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-fantasy font-bold text-amber-200 flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                      Relações & Dinâmica com Outros Personagens
                    </label>
                    {isEditing ? (
                      <Textarea
                        rows={2}
                        value={formData.relationships || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, relationships: e.target.value })
                        }
                        placeholder="Quem são seus aliados, mentores, rivais ou companheiros de bando?"
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                      />
                    ) : (
                      <p className="text-xs text-[#a8a090] bg-[#0c1017]/60 p-2.5 rounded-lg border border-[#222a3b]">
                        {active.relationships || 'Nenhuma relação registrada.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SEÇÃO DE INVENTÁRIO DE RPG (Aparece nos modos Geral e RPG, oculta no RP estrito e no foco narrativo puro) */}
              {mode !== 'rp' &&
                (sheetTab === 'hibrido' || sheetTab === 'rpg') &&
                active &&
                !isEditing && (
                  <div className="pt-2">
                    <RpgInventoryTab characterId={active.id} characterName={active.name} />
                  </div>
                )}

              {/* SEÇÃO RPG CLÁSSICO: CA, HP, ND e Atributos (Exibida em 'hibrido' e 'rpg') */}
              {(sheetTab === 'hibrido' || sheetTab === 'rpg') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#242c3d] pb-2">
                    <span className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-amber-400" />
                      Dimensão de RPG (Métricas de Jogo & Combate)
                    </span>
                    <span className="text-[10px] text-amber-300/60 font-fantasy">
                      Opcional para quem joga puramente RP
                    </span>
                  </div>

                  {/* Métricas de Combate: CA, HP, ND */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0e121a] border border-[#262f42] text-center">
                    <div>
                      <span className="text-[10px] font-fantasy uppercase text-amber-400/80 block">
                        Classe de Armadura (CA)
                      </span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.ac ?? 10}
                          onChange={(e) =>
                            setFormData({ ...formData, ac: parseInt(e.target.value) || 10 })
                          }
                          className="bg-[#121620] border-[#2c3548] text-amber-200 text-center font-mono font-bold mt-1"
                        />
                      ) : (
                        <span className="text-xl font-mono font-bold text-amber-200">
                          {active.ac || 10}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-fantasy uppercase text-rose-400/80 block">
                        Pontos de Vida (HP)
                      </span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.hp ?? 10}
                          onChange={(e) =>
                            setFormData({ ...formData, hp: parseInt(e.target.value) || 10 })
                          }
                          className="bg-[#121620] border-[#2c3548] text-rose-300 text-center font-mono font-bold mt-1"
                        />
                      ) : (
                        <span className="text-xl font-mono font-bold text-rose-300">
                          {active.hp || 10}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-fantasy uppercase text-blue-400/80 block">
                        Nível de Desafio (ND)
                      </span>
                      {isEditing ? (
                        <Input
                          value={formData.cr || 'ND 1'}
                          onChange={(e) => setFormData({ ...formData, cr: e.target.value })}
                          className="bg-[#121620] border-[#2c3548] text-blue-200 text-center font-mono font-bold mt-1"
                        />
                      ) : (
                        <span className="text-xl font-mono font-bold text-blue-200">
                          {active.cr || 'ND 1'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Atributos: FOR, DES, CON, INT, SAB, CAR */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-amber-300/80">
                      Atributos Essenciais
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                      {[
                        { key: 'str', label: 'FOR' },
                        { key: 'dex', label: 'DES' },
                        { key: 'con', label: 'CON' },
                        { key: 'int', label: 'INT' },
                        { key: 'wis', label: 'SAB' },
                        { key: 'cha', label: 'CAR' },
                      ].map(({ key, label }) => {
                        const score = (active as any)[key] ?? 10
                        const mod = getModifier(score)
                        return (
                          <div
                            key={key}
                            className="p-2 rounded-lg bg-[#0e121a] border border-[#262f42] flex flex-col items-center justify-center"
                          >
                            <span className="text-[10px] font-fantasy font-bold text-amber-400">
                              {label}
                            </span>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={score}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [key]: parseInt(e.target.value) || 10,
                                  })
                                }
                                className="h-7 w-14 bg-[#121620] border-[#2c3548] text-center font-mono text-xs text-amber-100 my-0.5 px-0"
                              />
                            ) : (
                              <span className="text-sm font-mono font-bold text-amber-100">
                                {score}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-amber-300/70">({mod})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Aparência & Localização */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-amber-300">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>Aparência Física & Onde Encontrar</span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Local de morada, estalagem ou território..."
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                    />
                    <Textarea
                      rows={2}
                      placeholder="Descrição física, pelagem/escamas/penas, vestes, porte e cicatrizes..."
                      value={formData.appearance || ''}
                      onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                      className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#0e121a] border border-[#222a3b] text-xs text-[#b8b0a0] leading-relaxed">
                    <p className="font-semibold text-amber-200/90 mb-1">
                      Local: {active.location || 'Não especificado'}
                    </p>
                    <p className="italic">
                      "{active.appearance || 'Sem descrição física anotada.'}"
                    </p>
                  </div>
                )}
              </div>

              {/* Personalidade: Traços, Ideais, Vínculos, Defeitos */}
              <div className="space-y-2">
                <span className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-amber-300/80">
                  Psique & Personalidade
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'traits', label: 'Traço Marcante' },
                    { key: 'ideals', label: 'Ideal Maior' },
                    { key: 'bonds', label: 'Vínculo Vital' },
                    { key: 'flaws', label: 'Defeito / Fraqueza' },
                  ].map(({ key, label }) => {
                    const val = (active.personality as any)?.[key] || ''
                    return (
                      <div
                        key={key}
                        className="p-2.5 rounded-lg bg-[#0e121a] border border-[#222a3b] space-y-1"
                      >
                        <span className="text-[10px] font-fantasy font-bold text-amber-400 block">
                          {label}
                        </span>
                        {isEditing ? (
                          <Input
                            value={val}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personality: {
                                  ...(formData.personality || {}),
                                  [key]: e.target.value,
                                },
                              })
                            }
                            className="bg-[#121620] border-[#2c3548] text-xs text-amber-100 h-7"
                          />
                        ) : (
                          <p className="text-[11px] text-[#b8b0a0] italic">{val || '—'}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Segredos & Notas do Mestre */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-fantasy font-bold text-purple-300">
                  <Key className="h-3.5 w-3.5 text-purple-400" />
                  <span>Segredo Oculto (Apenas para Olhos do Mestre)</span>
                </div>
                {isEditing ? (
                  <Textarea
                    rows={2}
                    value={formData.secrets || ''}
                    onChange={(e) => setFormData({ ...formData, secrets: e.target.value })}
                    placeholder="O que este personagem esconde a sete chaves?"
                    className="bg-[#0c1017] border-purple-500/40 text-xs text-purple-200"
                  />
                ) : (
                  <p className="text-xs text-purple-200/90 italic font-serif">
                    {active.secrets || 'Nenhum segredo registrado ainda.'}
                  </p>
                )}
              </div>

              {/* Notas de Enredo / Cenas */}
              <div className="space-y-1 text-xs">
                <span className="font-fantasy font-bold text-amber-300/80">
                  Notas de Trama, Cenas & Relações
                </span>
                {isEditing ? (
                  <Textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Conexão com missões, cenas narrativas, facções ou jogadores..."
                    className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                  />
                ) : (
                  <p className="text-xs text-[#a39b8d]">
                    {active.notes || 'Sem anotações adicionais.'}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-[#262c3a] rounded-2xl text-xs text-[#8e8678]">
              Selecione um personagem na lista à esquerda ou forje um novo para ler sua ficha
              híbrida.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Camera,
  X,
  Check,
  Feather,
  Shield,
  Zap,
  BookOpen,
  Heart,
  Eye,
  Scroll,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { npcsService, NpcRecord } from '@/services/npcs'
import {
  characterDetailsService,
  CharacterDetailRecord,
  CharacterPowerItem,
  CharacterAbilityItem,
  AiCustomSheetData,
} from '@/services/characterDetails'
import { useTranslation } from '@/i18n/LanguageContext'
import { useAppMode } from '@/contexts/ModeContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AvatarFrame } from '@/components/rpg/AvatarFrame'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  RuneCrestIcon,
  RuneScrollIcon,
  RuneSwordIcon,
  RuneTomeIcon,
  RuneOracleIcon,
  RuneFlameIcon,
  RuneSparkleIcon,
  RuneShieldIcon,
  RuneUserIcon,
} from '@/components/rpg/EternumIcons'
import { TomeOrnament, RunicCircle } from '@/components/rpg/RpgArtwork'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'

export function CharacterDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { mode } = useAppMode()
  const { toast } = useToast()

  const [npc, setNpc] = useState<NpcRecord | null>(null)
  const [details, setDetails] = useState<CharacterDetailRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Campos do Dossiê do Personagem
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [sexuality, setSexuality] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [race, setRace] = useState('')
  const [species, setSpecies] = useState('')
  const [backstory, setBackstory] = useState('')
  const [bonds, setBonds] = useState('')

  // Lista de Poderes e Habilidades
  const [powers, setPowers] = useState<CharacterPowerItem[]>([])
  const [abilities, setAbilities] = useState<CharacterAbilityItem[]>([])

  // Novo poder / habilidade em edição rápida
  const [newPowerName, setNewPowerName] = useState('')
  const [newPowerDesc, setNewPowerDesc] = useState('')
  const [newAbilityName, setNewAbilityName] = useState('')
  const [newAbilityDesc, setNewAbilityDesc] = useState('')

  // Foto / PFP do Personagem
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [removePhotoRequested, setRemovePhotoRequested] = useState(false)

  // Resumos por IA (RP / RPG)
  const [rpSummary, setRpSummary] = useState('')
  const [rpgSummary, setRpgSummary] = useState('')
  const [generatingRpSummary, setGeneratingRpSummary] = useState(false)
  const [generatingRpgSummary, setGeneratingRpgSummary] = useState(false)

  // Ficha personalizada ornada por IA
  const [aiCustomSheet, setAiCustomSheet] = useState<AiCustomSheetData | null>(null)
  const [generatingSheet, setGeneratingSheet] = useState(false)
  const [sheetFormatToGenerate, setSheetFormatToGenerate] = useState<'rp' | 'rpg'>('rp')

  // Lista de todos os outros NPCs para escolha no vínculo
  const [availableTargets, setAvailableTargets] = useState<NpcRecord[]>([])
  // Vínculos estruturados do personagem
  const [characterBondsList, setCharacterBondsList] = useState<BondWithTarget[]>([])
  const [bondsLoading, setBondsLoading] = useState(false)
  // Modal de Adicionar / Editar Vínculo
  const [bondModalOpen, setBondModalOpen] = useState(false)
  const [editingBond, setEditingBond] = useState<CharacterBondRecord | null>(null)
  const [selectedTargetId, setSelectedTargetId] = useState('')
  const [bondRelationType, setBondRelationType] = useState('')
  const [bondDesc, setBondDesc] = useState('')
  const [savingBond, setSavingBond] = useState(false)

  // Aba ativa na subpágina
  const [activeTab, setActiveTab] = useState<
    'perfil' | 'poderes' | 'vinculos' | 'resumos' | 'ficha'
  >('perfil')

  useEffect(() => {
    if (!id) return
    loadData(id)
  }, [id])

  async function loadData(characterId: string) {
    setLoading(true)
    try {
      const npcData = await npcsService.getById(characterId)
      if (!npcData) {
        toast({
          title: t('characterDetail.notFoundTitle'),
          description: t('characterDetail.notFoundDesc'),
          variant: 'destructive',
        })
        navigate('/npcs')
        return
      }
      setNpc(npcData)

      const detailsData = await characterDetailsService.getByCharacterId(characterId)
      if (detailsData) {
        setDetails(detailsData)
        setName(detailsData.name || npcData.name || '')
        setAge(detailsData.age || '')
        setSexuality(detailsData.sexuality || '')
        setPronouns(detailsData.pronouns || '')
        setRace(detailsData.race || npcData.race || '')
        setSpecies(detailsData.species || npcData.species || '')
        setBackstory(detailsData.backstory || npcData.bio || '')
        setBonds(detailsData.bonds || npcData.relationships || '')
        setPowers(detailsData.powers || [])
        setAbilities(detailsData.abilities || [])
        setRpSummary(detailsData.rp_summary || '')
        setRpgSummary(detailsData.rpg_summary || '')
        setAiCustomSheet(detailsData.ai_custom_sheet || null)
      } else {
        // Inicializa a partir dos dados do NPC
        setName(npcData.name || '')
        setRace(npcData.race || '')
        setSpecies(npcData.species || '')
        setBackstory(npcData.bio || '')
        setBonds(npcData.relationships || '')
        setPowers([
          {
            id: 'pow-1',
            name: 'Aura Primordial',
            description: 'Canaliza a energia espiritual ancestral do reino.',
          },
        ])
        setAbilities([
          {
            id: 'abi-1',
            name: 'Passo Silencioso',
            description: 'Move-se sem emitir som sobre superfícies de pedra ou mata.',
          },
        ])
      }
    } catch (err: any) {
      toast({
        title: t('characterDetail.loadErrorTitle'),
        description: err?.message || t('characterDetail.loadErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Obter URL da foto salva no PocketBase
  const existingPhotoUrl =
    !removePhotoRequested && details?.photo
      ? pb.files.getUrl(details, details.photo, { thumb: '256x256' })
      : null

  // Salvar Dossiê
  async function handleSave() {
    if (!id || !name.trim()) {
      toast({
        title: t('characterDetail.nameRequiredTitle'),
        description: t('characterDetail.nameRequiredDesc'),
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const saved = await characterDetailsService.upsert({
        character_id: id,
        name: name.trim(),
        age: age.trim(),
        sexuality: sexuality.trim(),
        pronouns: pronouns.trim(),
        race: race.trim(),
        species: species.trim(),
        backstory: backstory.trim(),
        bonds: bonds.trim(),
        powers,
        abilities,
        photo: photoFile,
        removePhoto: removePhotoRequested,
        rp_summary: rpSummary,
        rpg_summary: rpgSummary,
        ai_custom_sheet: aiCustomSheet,
      })

      setDetails(saved)
      setPhotoFile(null)
      setPhotoPreview(null)
      setRemovePhotoRequested(false)

      // Atualiza também o nome/raça no registro do NPC se tiver mudado
      if (npc && (npc.name !== name || npc.race !== race || npc.species !== species)) {
        await npcsService.update(npc.id, {
          name,
          race,
          species,
          bio: backstory,
          relationships: bonds,
        })
      }

      toast({
        title: t('characterDetail.savedSuccessTitle'),
        description: t('characterDetail.savedSuccessDesc'),
      })
    } catch (err: any) {
      toast({
        title: t('characterDetail.saveErrorTitle'),
        description: err?.message || t('characterDetail.saveErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Manipulação de Poderes
  function handleAddPower() {
    if (!newPowerName.trim()) return
    const newPower: CharacterPowerItem = {
      id: `pow-${Date.now()}`,
      name: newPowerName.trim(),
      description: newPowerDesc.trim(),
    }
    setPowers([...powers, newPower])
    setNewPowerName('')
    setNewPowerDesc('')
  }

  function handleRemovePower(powerId: string) {
    setPowers(powers.filter((p) => p.id !== powerId))
  }

  // Manipulação de Habilidades
  function handleAddAbility() {
    if (!newAbilityName.trim()) return
    const newAbi: CharacterAbilityItem = {
      id: `abi-${Date.now()}`,
      name: newAbilityName.trim(),
      description: newAbilityDesc.trim(),
    }
    setAbilities([...abilities, newAbi])
    setNewAbilityName('')
    setNewAbilityDesc('')
  }

  function handleRemoveAbility(abilityId: string) {
    setAbilities(abilities.filter((a) => a.id !== abilityId))
  }

  // Monta objeto consolidado para enviar ao Oráculo
  function buildCharacterPayload() {
    return {
      name,
      age,
      sexuality,
      pronouns,
      race: race || species,
      species,
      backstory,
      bonds,
      occupation: npc?.occupation || '',
      alignment: npc?.alignment || '',
      hp: npc?.hp,
      ac: npc?.ac,
      cr: npc?.cr,
      powers,
      abilities,
    }
  }

  // Geração de Resumo RP pela IA
  async function handleGenerateRpSummary() {
    setGeneratingRpSummary(true)
    try {
      const res = await characterDetailsService.generateWithOracle({
        type: 'rp_summary',
        character: buildCharacterPayload(),
        locale: locale as 'pt-BR' | 'en',
      })
      setRpSummary(res.content)
      toast({
        title: t('characterDetail.rpSummaryGeneratedTitle'),
        description: t('characterDetail.rpSummaryGeneratedDesc'),
      })
    } catch (err: any) {
      toast({
        title: t('characterDetail.aiErrorTitle'),
        description: err?.message || t('characterDetail.aiErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setGeneratingRpSummary(false)
    }
  }

  // Geração de Resumo RPG pela IA
  async function handleGenerateRpgSummary() {
    setGeneratingRpgSummary(true)
    try {
      const res = await characterDetailsService.generateWithOracle({
        type: 'rpg_summary',
        character: buildCharacterPayload(),
        locale: locale as 'pt-BR' | 'en',
      })
      setRpgSummary(res.content)
      toast({
        title: t('characterDetail.rpgSummaryGeneratedTitle'),
        description: t('characterDetail.rpgSummaryGeneratedDesc'),
      })
    } catch (err: any) {
      toast({
        title: t('characterDetail.aiErrorTitle'),
        description: err?.message || t('characterDetail.aiErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setGeneratingRpgSummary(false)
    }
  }

  // Geração de Ficha Personalizada Ornada pela IA
  async function handleGenerateCustomSheet() {
    setGeneratingSheet(true)
    try {
      const res = await characterDetailsService.generateWithOracle({
        type: 'custom_sheet',
        sheet_format: sheetFormatToGenerate,
        character: buildCharacterPayload(),
        locale: locale as 'pt-BR' | 'en',
      })

      const sheetData: AiCustomSheetData = {
        format: sheetFormatToGenerate,
        title:
          sheetFormatToGenerate === 'rp'
            ? t('characterDetail.sheetTitleRp', { name })
            : t('characterDetail.sheetTitleRpg', { name }),
        content: res.content,
        generated_at: new Date().toISOString(),
        runic_theme: sheetFormatToGenerate === 'rp' ? 'astral-purple' : 'runic-gold',
      }

      setAiCustomSheet(sheetData)
      setActiveTab('ficha')
      toast({
        title: t('characterDetail.sheetGeneratedTitle'),
        description: t('characterDetail.sheetGeneratedDesc'),
      })
    } catch (err: any) {
      toast({
        title: t('characterDetail.aiErrorTitle'),
        description: err?.message || t('characterDetail.aiErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setGeneratingSheet(false)
    }
  }

  if (loading) {
    return <EternumLoadingScreen message={t('characterDetail.loadingMessage')} />
  }

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Barra de Topo / Navegação de Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283244] pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/npcs')}
            className="border-[#2b3548] text-amber-300 hover:bg-amber-500/10 font-fantasy text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            {t('characterDetail.backToNpcs')}
          </Button>
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <RuneScrollIcon className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-widest font-fantasy text-amber-300/80">
              {t('characterDetail.subpageBadge')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/40"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? t('common.saving') : t('characterDetail.saveButton')}
          </Button>
        </div>
      </div>

      {/* Cartão de Herói / Cabeçalho do Personagem */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-[#121622] via-[#161c2b] to-[#0e121a] p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 pointer-events-none opacity-20 text-amber-400">
          <RunicCircle />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Foto com Moldura Rúnica */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <AvatarFrame
              frameId={details?.ai_custom_sheet?.format === 'rp' ? 'amethyst' : 'runic-gold'}
              size="lg"
            >
              <Avatar className="h-full w-full rounded-full">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt={name} />
                ) : existingPhotoUrl ? (
                  <AvatarImage src={existingPhotoUrl} alt={name} />
                ) : null}
                <AvatarFallback className="text-2xl font-fantasy font-bold bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  {name ? name.slice(0, 2).toUpperCase() : <RuneUserIcon className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
            </AvatarFrame>

            <div className="flex items-center gap-1.5 mt-1">
              <label className="cursor-pointer text-[11px] font-fantasy font-semibold px-2 py-1 rounded bg-[#1e2636] hover:bg-[#283348] border border-[#2e3b52] text-amber-300 transition-colors inline-flex items-center gap-1">
                <Camera className="w-3 h-3" />
                {t('characterDetail.changePhoto')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0]
                      setPhotoFile(file)
                      setPhotoPreview(URL.createObjectURL(file))
                      setRemovePhotoRequested(false)
                    }
                  }}
                />
              </label>

              {(existingPhotoUrl || photoPreview) && !removePhotoRequested && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null)
                    setPhotoPreview(null)
                    setRemovePhotoRequested(true)
                  }}
                  className="text-[11px] font-fantasy px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 transition-colors"
                  title={t('characterDetail.removePhotoTooltip')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {removePhotoRequested && (
              <span className="text-[10px] text-rose-400 italic">
                {t('characterDetail.photoWillBeRemoved')}
              </span>
            )}
          </div>

          {/* Dados Principais do Cabeçalho */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge
                variant="outline"
                className="bg-amber-500/10 border-amber-500/30 text-amber-300 font-fantasy text-[11px]"
              >
                {t('characterDetail.dossierBadge')}
              </Badge>
              {race && (
                <Badge
                  variant="outline"
                  className="bg-[#1c2333] border-[#2e3b52] text-amber-200/90 font-fantasy text-[11px]"
                >
                  {race}
                </Badge>
              )}
              {age && (
                <Badge
                  variant="outline"
                  className="bg-[#1c2333] border-[#2e3b52] text-amber-200/80 font-mono text-[11px]"
                >
                  {age} {t('characterDetail.yearsLabel')}
                </Badge>
              )}
              {sexuality && (
                <Badge
                  variant="outline"
                  className="bg-[#241a33] border-purple-500/30 text-purple-200 font-fantasy text-[11px]"
                >
                  {sexuality}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-fantasy font-black text-amber-100 tracking-wide">
              {name || t('characterDetail.untitledCharacter')}
            </h1>

            <p className="text-xs sm:text-sm text-[#a8a090] font-serif max-w-2xl line-clamp-2">
              {backstory || t('characterDetail.emptyBackstoryHint')}
            </p>

            {/* Ações de IA rápidas */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateRpSummary}
                disabled={generatingRpSummary}
                className="text-xs border-purple-500/40 bg-purple-950/20 text-purple-200 hover:bg-purple-900/40 font-fantasy"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                {generatingRpSummary
                  ? t('characterDetail.generatingRp')
                  : t('characterDetail.btnGenerateRpSummary')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateRpgSummary}
                disabled={generatingRpgSummary}
                className="text-xs border-amber-500/40 bg-amber-950/20 text-amber-200 hover:bg-amber-900/40 font-fantasy"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                {generatingRpgSummary
                  ? t('characterDetail.generatingRpg')
                  : t('characterDetail.btnGenerateRpgSummary')}
              </Button>

              <div className="flex items-center gap-1 bg-[#101520] p-0.5 rounded-lg border border-[#2b3548]">
                <button
                  type="button"
                  onClick={() => setSheetFormatToGenerate('rp')}
                  className={`text-[10px] font-fantasy px-2 py-1 rounded transition-colors ${
                    sheetFormatToGenerate === 'rp'
                      ? 'bg-purple-600 text-white'
                      : 'text-[#9c9486] hover:text-amber-100'
                  }`}
                >
                  {t('characterDetail.sheetOptRp')}
                </button>
                <button
                  type="button"
                  onClick={() => setSheetFormatToGenerate('rpg')}
                  className={`text-[10px] font-fantasy px-2 py-1 rounded transition-colors ${
                    sheetFormatToGenerate === 'rpg'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-[#9c9486] hover:text-amber-100'
                  }`}
                >
                  {t('characterDetail.sheetOptRpg')}
                </button>
                <Button
                  size="sm"
                  onClick={handleGenerateCustomSheet}
                  disabled={generatingSheet}
                  className="text-xs font-fantasy font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:brightness-110 ml-1 h-7 px-2.5"
                >
                  <RuneOracleIcon className="w-3.5 h-3.5 mr-1" />
                  {generatingSheet
                    ? t('characterDetail.generatingSheet')
                    : t('characterDetail.btnGenerateCustomSheet')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação de Abas do Dossiê */}
      <div className="flex items-center gap-1 border-b border-[#283244] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-fantasy font-bold transition-colors whitespace-nowrap ${
            activeTab === 'perfil'
              ? 'bg-amber-500/15 border border-amber-500/50 text-amber-200'
              : 'text-[#9c9486] hover:text-amber-100 hover:bg-[#151a26]'
          }`}
        >
          <RuneScrollIcon className="w-4 h-4 text-amber-400" />
          {t('characterDetail.tabProfile')}
        </button>

        <button
          onClick={() => setActiveTab('poderes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-fantasy font-bold transition-colors whitespace-nowrap ${
            activeTab === 'poderes'
              ? 'bg-amber-500/15 border border-amber-500/50 text-amber-200'
              : 'text-[#9c9486] hover:text-amber-100 hover:bg-[#151a26]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          {t('characterDetail.tabPowers')} ({powers.length + abilities.length})
        </button>

        <button
          onClick={() => setActiveTab('resumos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-fantasy font-bold transition-colors whitespace-nowrap ${
            activeTab === 'resumos'
              ? 'bg-amber-500/15 border border-amber-500/50 text-amber-200'
              : 'text-[#9c9486] hover:text-amber-100 hover:bg-[#151a26]'
          }`}
        >
          <Feather className="w-4 h-4 text-amber-400" />
          {t('characterDetail.tabSummaries')}
        </button>

        <button
          onClick={() => setActiveTab('ficha')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-fantasy font-bold transition-colors whitespace-nowrap ${
            activeTab === 'ficha'
              ? 'bg-amber-500/15 border border-amber-500/50 text-amber-200'
              : 'text-[#9c9486] hover:text-amber-100 hover:bg-[#151a26]'
          }`}
        >
          <RuneCrestIcon className="w-4 h-4 text-amber-400" />
          {t('characterDetail.tabSheet')}
          {aiCustomSheet && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </button>
      </div>

      {/* CONTEÚDO DA ABA: PERFIL & DADOS BIOGRÁFICOS */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#121622] border-[#283244] shadow-xl">
            <CardHeader className="pb-3 border-b border-[#20293a]">
              <CardTitle className="text-sm font-fantasy font-bold text-amber-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {t('characterDetail.identitySectionTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  {t('characterDetail.fieldName')}
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('characterDetail.fieldNamePlaceholder')}
                  className="bg-[#0b0e14] border-[#2a3448] text-amber-100 font-fantasy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-fantasy font-bold text-amber-200">
                    {t('characterDetail.fieldRace')}
                  </label>
                  <Input
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                    placeholder={t('characterDetail.fieldRacePlaceholder')}
                    className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-fantasy font-bold text-amber-200">
                    {t('characterDetail.fieldAge')}
                  </label>
                  <Input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t('characterDetail.fieldAgePlaceholder')}
                    className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-fantasy font-bold text-amber-200">
                    {t('characterDetail.fieldSexuality')}
                  </label>
                  <Input
                    value={sexuality}
                    onChange={(e) => setSexuality(e.target.value)}
                    placeholder={t('characterDetail.fieldSexualityPlaceholder')}
                    className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-fantasy font-bold text-amber-200">
                    {t('characterDetail.fieldPronouns')}
                  </label>
                  <Input
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder={t('characterDetail.fieldPronounsPlaceholder')}
                    className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  {t('characterDetail.fieldBonds')}
                </label>
                <Textarea
                  value={bonds}
                  onChange={(e) => setBonds(e.target.value)}
                  placeholder={t('characterDetail.fieldBondsPlaceholder')}
                  rows={3}
                  className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#121622] border-[#283244] shadow-xl">
            <CardHeader className="pb-3 border-b border-[#20293a]">
              <CardTitle className="text-sm font-fantasy font-bold text-amber-200 flex items-center gap-2">
                <RuneScrollIcon className="w-4 h-4 text-amber-400" />
                {t('characterDetail.backstorySectionTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-fantasy font-bold text-amber-200">
                  {t('characterDetail.fieldBackstory')}
                </label>
                <Textarea
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  placeholder={t('characterDetail.fieldBackstoryPlaceholder')}
                  rows={10}
                  className="bg-[#0b0e14] border-[#2a3448] text-amber-100 text-xs font-serif leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#0e121a] border border-[#232b3a] flex items-center justify-between text-xs text-[#8c8476]">
                <span>{t('characterDetail.backstoryTip')}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="text-xs text-amber-300 hover:text-amber-100"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> {t('common.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONTEÚDO DA ABA: PODERES & HABILIDADES */}
      {activeTab === 'poderes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seção de Poderes */}
          <Card className="bg-[#121622] border-[#283244] shadow-xl">
            <CardHeader className="pb-3 border-b border-[#20293a] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-fantasy font-bold text-amber-200 flex items-center gap-2">
                <RuneFlameIcon className="w-4 h-4 text-amber-400" />
                {t('characterDetail.powersSectionTitle')}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs font-mono text-amber-300 border-amber-500/30"
              >
                {powers.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Formulário para adicionar Poder */}
              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#242d3e] space-y-2">
                <p className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-amber-300">
                  {t('characterDetail.addPowerTitle')}
                </p>
                <Input
                  value={newPowerName}
                  onChange={(e) => setNewPowerName(e.target.value)}
                  placeholder={t('characterDetail.powerNamePlaceholder')}
                  className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs font-fantasy font-bold"
                />
                <Textarea
                  value={newPowerDesc}
                  onChange={(e) => setNewPowerDesc(e.target.value)}
                  placeholder={t('characterDetail.powerDescPlaceholder')}
                  rows={2}
                  className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs resize-none"
                />
                <Button
                  onClick={handleAddPower}
                  size="sm"
                  className="w-full text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> {t('characterDetail.btnAddPower')}
                </Button>
              </div>

              {/* Lista de Poderes Registrados */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {powers.map((pow) => (
                  <div
                    key={pow.id}
                    className="p-3 rounded-xl bg-[#161c2a] border border-[#283246] hover:border-amber-500/40 transition-colors group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-amber-500/10 text-amber-300">
                          <Zap className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="text-xs font-fantasy font-bold text-amber-100">
                          {pow.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleRemovePower(pow.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-200 p-1"
                        title={t('characterDetail.removePowerTooltip')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {pow.description && (
                      <p className="text-xs text-[#a29a8a] mt-1 font-serif leading-relaxed">
                        {pow.description}
                      </p>
                    )}
                  </div>
                ))}

                {powers.length === 0 && (
                  <div className="p-6 text-center border border-dashed border-[#242d3e] rounded-xl text-xs text-[#8c8476]">
                    {t('characterDetail.noPowersYet')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seção de Habilidades */}
          <Card className="bg-[#121622] border-[#283244] shadow-xl">
            <CardHeader className="pb-3 border-b border-[#20293a] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-fantasy font-bold text-amber-200 flex items-center gap-2">
                <RuneShieldIcon className="w-4 h-4 text-amber-400" />
                {t('characterDetail.abilitiesSectionTitle')}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs font-mono text-amber-300 border-amber-500/30"
              >
                {abilities.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Formulário para adicionar Habilidade */}
              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#242d3e] space-y-2">
                <p className="text-[11px] font-fantasy font-bold uppercase tracking-wider text-amber-300">
                  {t('characterDetail.addAbilityTitle')}
                </p>
                <Input
                  value={newAbilityName}
                  onChange={(e) => setNewAbilityName(e.target.value)}
                  placeholder={t('characterDetail.abilityNamePlaceholder')}
                  className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs font-fantasy font-bold"
                />
                <Textarea
                  value={newAbilityDesc}
                  onChange={(e) => setNewAbilityDesc(e.target.value)}
                  placeholder={t('characterDetail.abilityDescPlaceholder')}
                  rows={2}
                  className="bg-[#121622] border-[#2a3448] text-amber-100 text-xs resize-none"
                />
                <Button
                  onClick={handleAddAbility}
                  size="sm"
                  className="w-full text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> {t('characterDetail.btnAddAbility')}
                </Button>
              </div>

              {/* Lista de Habilidades Registradas */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {abilities.map((abi) => (
                  <div
                    key={abi.id}
                    className="p-3 rounded-xl bg-[#161c2a] border border-[#283246] hover:border-amber-500/40 transition-colors group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-amber-500/10 text-amber-300">
                          <Feather className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="text-xs font-fantasy font-bold text-amber-100">
                          {abi.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleRemoveAbility(abi.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-200 p-1"
                        title={t('characterDetail.removeAbilityTooltip')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {abi.description && (
                      <p className="text-xs text-[#a29a8a] mt-1 font-serif leading-relaxed">
                        {abi.description}
                      </p>
                    )}
                  </div>
                ))}

                {abilities.length === 0 && (
                  <div className="p-6 text-center border border-dashed border-[#242d3e] rounded-xl text-xs text-[#8c8476]">
                    {t('characterDetail.noAbilitiesYet')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONTEÚDO DA ABA: RESUMOS POR IA (RP E RPG) */}
      {activeTab === 'resumos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo de RP (Narrativa / Interpretação) */}
            <Card className="bg-[#121622] border-purple-500/30 shadow-xl">
              <CardHeader className="pb-3 border-b border-[#241a33] flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-fantasy font-bold text-purple-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {t('characterDetail.rpSummaryCardTitle')}
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateRpSummary}
                  disabled={generatingRpSummary}
                  className="text-xs border-purple-500/40 text-purple-200 hover:bg-purple-900/40 font-fantasy"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 mr-1 ${generatingRpSummary ? 'animate-spin' : ''}`}
                  />
                  {generatingRpSummary
                    ? t('common.generating')
                    : t('characterDetail.btnRegenerate')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <p className="text-xs text-[#9a9082]">{t('characterDetail.rpSummaryDesc')}</p>
                <Textarea
                  value={rpSummary}
                  onChange={(e) => setRpSummary(e.target.value)}
                  placeholder={t('characterDetail.rpSummaryPlaceholder')}
                  rows={10}
                  className="bg-[#0b0e14] border-[#2c2040] text-purple-100 text-xs font-serif leading-relaxed"
                />
              </CardContent>
            </Card>

            {/* Resumo de RPG (Tática / Combate / Regras) */}
            <Card className="bg-[#121622] border-amber-500/30 shadow-xl">
              <CardHeader className="pb-3 border-b border-[#2e2618] flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-fantasy font-bold text-amber-200 flex items-center gap-2">
                  <RuneSwordIcon className="w-4 h-4 text-amber-400" />
                  {t('characterDetail.rpgSummaryCardTitle')}
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateRpgSummary}
                  disabled={generatingRpgSummary}
                  className="text-xs border-amber-500/40 text-amber-200 hover:bg-amber-900/40 font-fantasy"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 mr-1 ${generatingRpgSummary ? 'animate-spin' : ''}`}
                  />
                  {generatingRpgSummary
                    ? t('common.generating')
                    : t('characterDetail.btnRegenerate')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <p className="text-xs text-[#9a9082]">{t('characterDetail.rpgSummaryDesc')}</p>
                <Textarea
                  value={rpgSummary}
                  onChange={(e) => setRpgSummary(e.target.value)}
                  placeholder={t('characterDetail.rpgSummaryPlaceholder')}
                  rows={10}
                  className="bg-[#0b0e14] border-[#382d1c] text-amber-100 text-xs font-serif leading-relaxed"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {t('characterDetail.saveSummariesButton')}
            </Button>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA: FICHA PERSONALIZADA ORNADA POR IA */}
      {activeTab === 'ficha' && (
        <div className="space-y-6">
          {/* Seletor de Formato & Botão de Geração */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121622] border border-[#2a3448]">
            <div className="space-y-0.5">
              <h3 className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300">
                {t('characterDetail.customSheetGeneratorTitle')}
              </h3>
              <p className="text-xs text-[#9c9486]">
                {t('characterDetail.customSheetGeneratorDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-[#0c1017] p-0.5 border border-[#2b3548]">
                <button
                  type="button"
                  onClick={() => setSheetFormatToGenerate('rp')}
                  className={`px-3 py-1.5 text-xs font-fantasy font-semibold rounded-md transition-colors ${
                    sheetFormatToGenerate === 'rp'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-[#9c9486] hover:text-amber-100'
                  }`}
                >
                  {t('characterDetail.sheetOptRpFull')}
                </button>
                <button
                  type="button"
                  onClick={() => setSheetFormatToGenerate('rpg')}
                  className={`px-3 py-1.5 text-xs font-fantasy font-semibold rounded-md transition-colors ${
                    sheetFormatToGenerate === 'rpg'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-[#9c9486] hover:text-amber-100'
                  }`}
                >
                  {t('characterDetail.sheetOptRpgFull')}
                </button>
              </div>

              <Button
                onClick={handleGenerateCustomSheet}
                disabled={generatingSheet}
                className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {generatingSheet
                  ? t('characterDetail.generatingSheet')
                  : aiCustomSheet
                    ? t('characterDetail.btnRegenerateSheet')
                    : t('characterDetail.btnGenerateFirstSheet')}
              </Button>
            </div>
          </div>

          {/* Exibição da Ficha Ornada */}
          {aiCustomSheet ? (
            <div
              className={`relative rounded-2xl border-2 p-6 sm:p-10 shadow-2xl space-y-6 ${
                aiCustomSheet.format === 'rp'
                  ? 'border-purple-500/50 bg-gradient-to-b from-[#141224] via-[#100e1c] to-[#0a0812]'
                  : 'border-amber-500/50 bg-gradient-to-b from-[#1c1610] via-[#14110d] to-[#0a0806]'
              }`}
            >
              {/* Ornamentação Rúnica Superior */}
              <div className="flex items-center justify-center gap-3 text-amber-400/80">
                <TomeOrnament className="w-16 h-4 opacity-70" />
                <RuneCrestIcon className="w-5 h-5 text-amber-300" />
                <TomeOrnament className="w-16 h-4 opacity-70 rotate-180" />
              </div>

              {/* Título & Metadados da Ficha */}
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <Badge
                  variant="outline"
                  className={`font-fantasy text-xs px-3 py-0.5 ${
                    aiCustomSheet.format === 'rp'
                      ? 'border-purple-500/40 bg-purple-950/40 text-purple-200'
                      : 'border-amber-500/40 bg-amber-950/40 text-amber-200'
                  }`}
                >
                  {aiCustomSheet.format === 'rp'
                    ? t('characterDetail.sheetBadgeRp')
                    : t('characterDetail.sheetBadgeRpg')}
                </Badge>

                <h2 className="text-2xl sm:text-3xl font-fantasy font-black tracking-wider text-amber-100">
                  {aiCustomSheet.title || name}
                </h2>

                <p className="text-[11px] text-[#8e8678] font-mono">
                  {t('characterDetail.sheetGeneratedAt', {
                    date: new Date(aiCustomSheet.generated_at).toLocaleString(locale),
                  })}
                </p>
              </div>

              {/* Corpo da Ficha Ornada */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm font-serif leading-relaxed space-y-4 whitespace-pre-wrap text-amber-100/90 selection:bg-amber-500/30">
                {aiCustomSheet.content}
              </div>

              {/* Ornamentação Rúnica Inferior */}
              <div className="flex items-center justify-center gap-3 text-amber-400/80 pt-6 border-t border-white/10">
                <TomeOrnament className="w-16 h-4 opacity-70" />
                <RuneOracleIcon className="w-5 h-5 text-amber-300" />
                <TomeOrnament className="w-16 h-4 opacity-70 rotate-180" />
              </div>

              {/* Rodapé com botão de salvar ficha */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {t('characterDetail.saveCustomSheetButton')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-[#2b3548] rounded-2xl bg-[#10141e]/50 space-y-3">
              <RuneScrollIcon className="w-12 h-12 text-amber-400/50 mx-auto" />
              <h3 className="text-sm font-fantasy font-bold text-amber-200">
                {t('characterDetail.emptySheetTitle')}
              </h3>
              <p className="text-xs text-[#8c8476] max-w-md mx-auto">
                {t('characterDetail.emptySheetDesc')}
              </p>
              <Button
                onClick={handleGenerateCustomSheet}
                disabled={generatingSheet}
                className="text-xs font-fantasy font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {t('characterDetail.btnGenerateFirstSheet')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default CharacterDetailView

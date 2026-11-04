import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLanguage, useTranslation } from '@/i18n/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import {
  compendiumService,
  CompendiumEntryRecord,
  CompendiumUniverse,
  CompendiumEntryType,
  COMPENDIUM_UNIVERSES,
  COMPENDIUM_ENTRY_TYPES,
} from '@/services/compendium'
import { COMPENDIUM_SEED_ENTRIES, CompendiumSeedEntry } from '@/i18n/compendiumSeed'
import {
  RuneCompendiumIcon,
  RuneSearchIcon,
  RuneScrollIcon,
  RuneSwordIcon,
  RuneDragonIcon,
  RuneFlameIcon,
  RuneSparkleIcon,
  RuneGemIcon,
} from '@/components/rpg/EternumIcons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import { Plus, Pencil, Trash2, ArrowUpDown, Filter } from 'lucide-react'

// Item exibido (unificado entre semente e banco do usuário)
export interface DisplayCompendiumEntry {
  id: string
  isCustom: boolean
  universe: CompendiumUniverse
  entry_type: CompendiumEntryType
  name: string
  short_description: string
  traits: string[]
  rawRecord?: CompendiumEntryRecord
}

function normalizeSearch(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function CompendiumView() {
  const { locale, t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const confirm = useConfirm()

  const [customEntries, setCustomEntries] = useState<CompendiumEntryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUniverse, setSelectedUniverse] = useState<CompendiumUniverse | 'all'>('all')
  const [selectedType, setSelectedType] = useState<CompendiumEntryType | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Diálogo de criação/edição
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<CompendiumEntryRecord | null>(null)
  const [formName, setFormName] = useState('')
  const [formUniverse, setFormUniverse] = useState<CompendiumUniverse>('dnd')
  const [formType, setFormType] = useState<CompendiumEntryType>('race')
  const [formDescription, setFormDescription] = useState('')
  const [formTraitsText, setFormTraitsText] = useState('')
  const [saving, setSaving] = useState(false)

  // Carregar verbetes customizados do PocketBase
  const loadCustomEntries = useCallback(async () => {
    if (!user) {
      setCustomEntries([])
      setLoading(false)
      return
    }
    try {
      const records = await compendiumService.list()
      setCustomEntries(records)
    } catch (err) {
      console.error('Falha ao carregar compêndio:', err)
      toast({
        title: t('compendium.loadErrorToast'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [user, t, toast])

  useEffect(() => {
    loadCustomEntries()
  }, [loadCustomEntries])

  // Universo label & icon
  const getUniverseLabel = (u: CompendiumUniverse): string => {
    switch (u) {
      case 'dnd':
        return t('compendium.universeDnd')
      case 'bleach':
        return t('compendium.universeBleach')
      case 'dragonball':
        return t('compendium.universeDragonball')
      case 'anime':
        return t('compendium.universeAnime')
      case 'games':
        return t('compendium.universeGames')
      case 'outro':
        return t('compendium.universeOther')
      default:
        return u
    }
  }

  const getTypeLabel = (entryType: CompendiumEntryType): string => {
    return entryType === 'race' ? t('compendium.typeRace') : t('compendium.typePower')
  }

  const getUniverseIcon = (u: CompendiumUniverse) => {
    switch (u) {
      case 'dnd':
        return <RuneDragonIcon className="w-3.5 h-3.5 text-amber-400" />
      case 'bleach':
        return <RuneSwordIcon className="w-3.5 h-3.5 text-cyan-400" />
      case 'dragonball':
        return <RuneFlameIcon className="w-3.5 h-3.5 text-orange-400" />
      case 'anime':
        return <RuneSparkleIcon className="w-3.5 h-3.5 text-fuchsia-400" />
      case 'games':
        return <RuneGemIcon className="w-3.5 h-3.5 text-emerald-400" />
      case 'outro':
      default:
        return <RuneScrollIcon className="w-3.5 h-3.5 text-amber-300" />
    }
  }

  // Lista unificada
  const allEntries: DisplayCompendiumEntry[] = useMemo(() => {
    const list: DisplayCompendiumEntry[] = []

    const curLoc = locale === 'en' ? 'en' : 'pt-BR'

    // Sementes bilíngues
    COMPENDIUM_SEED_ENTRIES.forEach((s: CompendiumSeedEntry) => {
      list.push({
        id: `seed_${s.id}`,
        isCustom: false,
        universe: s.universe,
        entry_type: s.entry_type,
        name: s.name[curLoc] || s.name['pt-BR'],
        short_description: s.short_description[curLoc] || s.short_description['pt-BR'],
        traits: s.traits[curLoc] || s.traits['pt-BR'] || [],
      })
    })

    // Customizados do usuário
    customEntries.forEach((rec) => {
      list.push({
        id: rec.id,
        isCustom: true,
        universe: rec.universe,
        entry_type: rec.entry_type,
        name: rec.name,
        short_description: rec.short_description,
        traits: Array.isArray(rec.traits) ? rec.traits : [],
        rawRecord: rec,
      })
    })

    return list
  }, [locale, customEntries])

  // Filtragem e busca
  const filteredEntries = useMemo(() => {
    const term = normalizeSearch(search.trim())

    return allEntries
      .filter((item) => {
        const matchesUniverse = selectedUniverse === 'all' || item.universe === selectedUniverse
        const matchesType = selectedType === 'all' || item.entry_type === selectedType
        if (!matchesUniverse || !matchesType) return false

        if (!term) return true
        const inName = normalizeSearch(item.name).includes(term)
        const inDesc = normalizeSearch(item.short_description).includes(term)
        const inTraits = item.traits.some((tr) => normalizeSearch(tr).includes(term))
        return inName || inDesc || inTraits
      })
      .sort((a, b) => {
        const cmp = a.name.localeCompare(b.name, locale === 'en' ? 'en' : 'pt-BR', {
          sensitivity: 'base',
        })
        return sortOrder === 'asc' ? cmp : -cmp
      })
  }, [allEntries, search, selectedUniverse, selectedType, sortOrder, locale])

  // Abrir criação
  const handleOpenCreate = () => {
    setEditingEntry(null)
    setFormName('')
    setFormUniverse('dnd')
    setFormType('race')
    setFormDescription('')
    setFormTraitsText('')
    setDialogOpen(true)
  }

  // Abrir edição
  const handleOpenEdit = (rec: CompendiumEntryRecord) => {
    setEditingEntry(rec)
    setFormName(rec.name)
    setFormUniverse(rec.universe)
    setFormType(rec.entry_type)
    setFormDescription(rec.short_description)
    setFormTraitsText(Array.isArray(rec.traits) ? rec.traits.join('\n') : '')
    setDialogOpen(true)
  }

  // Salvar
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formDescription.trim()) return

    setSaving(true)
    const traits = formTraitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      if (editingEntry) {
        await compendiumService.update(editingEntry.id, {
          name: formName.trim(),
          universe: formUniverse,
          entry_type: formType,
          short_description: formDescription.trim(),
          traits,
        })
        toast({ title: t('compendium.updatedToast') })
      } else {
        await compendiumService.create({
          name: formName.trim(),
          universe: formUniverse,
          entry_type: formType,
          short_description: formDescription.trim(),
          traits,
        })
        toast({ title: t('compendium.createdToast') })
      }
      setDialogOpen(false)
      loadCustomEntries()
    } catch (err) {
      console.error('Erro ao gravar verbete do compêndio:', err)
      toast({
        title: t('compendium.errorToast'),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // Excluir com diálogo temático
  const handleDeleteEntry = async (entry: CompendiumEntryRecord) => {
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.compendiumEntryDesc'),
      itemName: entry.name,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      dangerous: true,
      icon: 'compendium',
    })
    if (!confirmed) return

    try {
      await compendiumService.delete(entry.id)
      toast({ title: t('compendium.deletedToast') })
      loadCustomEntries()
    } catch (err) {
      console.error('Erro ao banir verbete:', err)
      toast({
        title: t('compendium.errorToast'),
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <EternumLoadingScreen message={t('loading.pages')} />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-amber-900/20 border border-amber-500/30 text-amber-400">
              <RuneCompendiumIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-amber-100">
                {t('compendium.title')}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/60 mt-0.5">
                {t('compendium.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-medium border border-amber-400/40 shadow-md shadow-amber-950/40 gap-2 font-cinzel text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            {t('compendium.newEntry')}
          </Button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-stone-950/60 p-4 rounded-xl border border-amber-500/20 backdrop-blur-sm">
        {/* Campo de Busca */}
        <div className="relative md:col-span-5">
          <RuneSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('compendium.searchPlaceholder')}
            className="pl-9 bg-stone-900/80 border-amber-500/30 text-amber-100 placeholder:text-stone-500 text-sm focus-visible:ring-amber-500/40"
          />
        </div>

        {/* Filtro por Universo */}
        <div className="md:col-span-3 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          <select
            value={selectedUniverse}
            onChange={(e) => setSelectedUniverse(e.target.value as CompendiumUniverse | 'all')}
            className="w-full bg-stone-900/80 border border-amber-500/30 text-amber-100 rounded-md px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            aria-label={t('compendium.universeLabel')}
          >
            <option value="all">{t('compendium.filterAllUniverses')}</option>
            {COMPENDIUM_UNIVERSES.map((u) => (
              <option key={u} value={u}>
                {getUniverseLabel(u)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo (Raça / Poder) */}
        <div className="md:col-span-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CompendiumEntryType | 'all')}
            className="w-full bg-stone-900/80 border border-amber-500/30 text-amber-100 rounded-md px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            aria-label={t('compendium.typeLabel')}
          >
            <option value="all">{t('compendium.filterAllTypes')}</option>
            {COMPENDIUM_ENTRY_TYPES.map((et) => (
              <option key={et} value={et}>
                {getTypeLabel(et)}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação A-Z / Z-A */}
        <div className="md:col-span-2 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="w-full bg-stone-900/80 border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-amber-100 text-xs gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>{sortOrder === 'asc' ? t('compendium.sortAz') : t('compendium.sortZa')}</span>
          </Button>
        </div>
      </div>

      {/* Contagem de verbetes */}
      <div className="flex items-center justify-between text-xs text-amber-300/60 px-1 font-cinzel">
        <span>
          {t('compendium.filteredCount')
            .replace('{count}', String(filteredEntries.length))
            .replace('{total}', String(allEntries.length))}
        </span>
        <span className="hidden sm:inline">{t('compendium.customNote')}</span>
      </div>

      {/* Lista de Verbetes */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 px-4 bg-stone-950/40 rounded-xl border border-amber-500/15 space-y-3">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RuneCompendiumIcon className="w-6 h-6" />
          </div>
          <h2 className="font-cinzel text-lg text-amber-200 font-semibold">
            {t('compendium.emptyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
            {t('compendium.emptyDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between bg-stone-950/70 hover:bg-stone-900/80 rounded-xl p-4 sm:p-5 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm hover:shadow-md hover:shadow-amber-950/30"
            >
              <div>
                {/* Badges superiores: Universo e Tipo */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 border border-amber-500/25 text-amber-200">
                      {getUniverseIcon(item.universe)}
                      <span>{getUniverseLabel(item.universe)}</span>
                    </span>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        item.entry_type === 'race'
                          ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                          : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                      }`}
                    >
                      {getTypeLabel(item.entry_type)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.isCustom ? (
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 border-purple-400/40 text-purple-300 text-[10px] font-cinzel"
                      >
                        {t('compendium.customBadge')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 border-amber-500/30 text-amber-300/80 text-[10px] font-cinzel"
                      >
                        {t('compendium.seedBadge')}
                      </Badge>
                    )}

                    {/* Ações (apenas itens criados pelo usuário) */}
                    {item.isCustom && item.rawRecord && (
                      <div className="flex items-center gap-1 ml-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item.rawRecord!)}
                          aria-label={t('compendium.editEntry')}
                          className="p-1 rounded text-stone-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(item.rawRecord!)}
                          aria-label={t('compendium.deleteEntry')}
                          className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nome do verbete */}
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 tracking-wide mb-1.5">
                  {item.name}
                </h3>

                {/* Descrição curta */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-3">
                  {item.short_description}
                </p>

                {/* Traços / Características */}
                {item.traits.length > 0 && (
                  <div className="mt-2 pt-2.5 border-t border-amber-500/10 space-y-1">
                    <span className="text-[11px] font-cinzel text-amber-400/75 uppercase tracking-wider block">
                      {t('compendium.traitsLabel')}
                    </span>
                    <ul className="space-y-1">
                      {item.traits.map((trait, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-stone-300/90 flex items-start gap-1.5 leading-snug"
                        >
                          <span className="text-amber-400/80 text-[10px] mt-0.5">◆</span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diálogo de Criação/Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-stone-950 border-amber-500/30 text-amber-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-lg text-amber-100">
              {editingEntry ? t('compendium.editEntry') : t('compendium.newEntry')}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              {t('compendium.dialogDesc')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-cinzel text-amber-300 block mb-1">
                {t('compendium.nameLabel')}
              </label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t('compendium.namePlaceholder')}
                className="bg-stone-900 border-amber-500/30 text-amber-100 text-sm focus-visible:ring-amber-500/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('compendium.universeLabel')}
                </label>
                <select
                  value={formUniverse}
                  onChange={(e) => setFormUniverse(e.target.value as CompendiumUniverse)}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-100 rounded-md px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                >
                  {COMPENDIUM_UNIVERSES.map((u) => (
                    <option key={u} value={u}>
                      {getUniverseLabel(u)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('compendium.typeLabel')}
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as CompendiumEntryType)}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-100 rounded-md px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                >
                  {COMPENDIUM_ENTRY_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {getTypeLabel(et)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-cinzel text-amber-300 block mb-1">
                {t('compendium.descriptionLabel')}
              </label>
              <Textarea
                required
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={t('compendium.descriptionPlaceholder')}
                className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm focus-visible:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="text-xs font-cinzel text-amber-300 block mb-1">
                {t('compendium.traitsLabel')} ({t('compendium.traitsHint')})
              </label>
              <Textarea
                rows={3}
                value={formTraitsText}
                onChange={(e) => setFormTraitsText(e.target.value)}
                placeholder={t('compendium.traitsPlaceholder')}
                className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm font-mono focus-visible:ring-amber-500/40"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-stone-700 text-stone-300 hover:bg-stone-800 text-xs"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-medium text-xs font-cinzel"
              >
                {saving ? t('compendium.saving') : t('compendium.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

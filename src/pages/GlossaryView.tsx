import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/i18n/LanguageContext'
import {
  glossaryTermsService,
  GlossaryTermRecord,
  GlossaryCategoryId,
  GLOSSARY_CATEGORY_IDS,
} from '@/services/glossary'
import { GLOSSARY_SEED_TERMS } from '@/i18n/glossarySeed'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import {
  RuneLexiconIcon,
  RuneSwordIcon,
  RuneScrollIcon,
  RuneTomeIcon,
  RuneSearchIcon,
  RuneCombatIcon,
  RuneUserIcon,
  RuneNerdIcon,
} from '@/components/rpg/EternumIcons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, ArrowUpDown, Filter, Sparkles, BookOpen } from 'lucide-react'

// Representação unificada para exibição
export interface DisplayGlossaryTerm {
  id: string
  term: string
  category: GlossaryCategoryId
  definition: string
  isCustom: boolean
  record?: GlossaryTermRecord
}

export default function GlossaryView() {
  const { user } = useAuth()
  const { t, locale } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [customTerms, setCustomTerms] = useState<GlossaryTermRecord[]>([])

  const [searchParams, setSearchParams] = useSearchParams()

  // Filtros, busca e ordenação
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategoryId | 'all'>(() => {
    const cat = searchParams.get('categoria')
    if (
      cat === 'nerd' ||
      cat === 'combate' ||
      cat === 'personagem' ||
      cat === 'regras' ||
      cat === 'dados' ||
      cat === 'mesa'
    ) {
      return cat
    }
    return 'all'
  })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const cat = searchParams.get('categoria')
    if (
      cat === 'nerd' ||
      cat === 'combate' ||
      cat === 'personagem' ||
      cat === 'regras' ||
      cat === 'dados' ||
      cat === 'mesa'
    ) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  // Modais de Criação/Edição e Exclusão
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<GlossaryTermRecord | null>(null)
  const [formTerm, setFormTerm] = useState('')
  const [formCategory, setFormCategory] = useState<GlossaryCategoryId>('combate')
  const [formDefinition, setFormDefinition] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [termToDelete, setTermToDelete] = useState<GlossaryTermRecord | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Carrega termos customizados salvos no PocketBase
  const loadCustomTerms = async () => {
    if (!user) return
    try {
      const records = await glossaryTermsService.list()
      setCustomTerms(records)
    } catch (err: any) {
      console.error(err)
      toast({
        title: t('glossary.loadErrorToast'),
        description: err?.message || '',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomTerms()
  }, [user])

  // Obtém o nome localizado da categoria
  const getCategoryLabel = (cat: GlossaryCategoryId) => {
    switch (cat) {
      case 'combate':
        return t('glossary.categoryCombat')
      case 'personagem':
        return t('glossary.categoryCharacter')
      case 'regras':
        return t('glossary.categoryRules')
      case 'dados':
        return t('glossary.categoryDice')
      case 'mesa':
        return t('glossary.categoryTable')
      case 'nerd':
        return t('glossary.categoryNerd')
      default:
        return cat
    }
  }

  // Ícone característico para cada categoria
  const getCategoryIcon = (cat: GlossaryCategoryId) => {
    switch (cat) {
      case 'combate':
        return <RuneCombatIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      case 'personagem':
        return <RuneUserIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      case 'regras':
        return <RuneTomeIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      case 'dados':
        return <RuneSwordIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      case 'mesa':
        return <RuneScrollIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
      case 'nerd':
        return <RuneNerdIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
    }
  }

  // Cor temática para os badges de categoria
  const getCategoryBadgeClass = (cat: GlossaryCategoryId) => {
    switch (cat) {
      case 'combate':
        return 'border-amber-500/40 text-amber-300 bg-amber-950/40'
      case 'personagem':
        return 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
      case 'regras':
        return 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
      case 'dados':
        return 'border-amber-400/40 text-amber-200 bg-amber-900/30'
      case 'mesa':
        return 'border-purple-500/40 text-purple-300 bg-purple-950/40'
      case 'nerd':
        return 'border-pink-500/40 text-pink-300 bg-pink-950/40'
    }
  }

  // Unifica termos da semente bilíngue (traduzidos de acordo com locale) e termos próprios do usuário
  const allTerms: DisplayGlossaryTerm[] = useMemo(() => {
    const list: DisplayGlossaryTerm[] = []
    const currentLoc = locale === 'en' ? 'en' : 'pt-BR'

    // Termos de semente
    GLOSSARY_CATEGORY_IDS.forEach((cat) => {
      const items = GLOSSARY_SEED_TERMS[cat] || []
      items.forEach((item, index) => {
        list.push({
          id: `seed_${cat}_${index}`,
          term: item.term[currentLoc] || item.term['pt-BR'],
          category: cat,
          definition: item.definition[currentLoc] || item.definition['pt-BR'],
          isCustom: false,
        })
      })
    })

    // Termos customizados do usuário (mantidos como ele escreveu)
    customTerms.forEach((rec) => {
      list.push({
        id: rec.id,
        term: rec.term,
        category: rec.category,
        definition: rec.definition,
        isCustom: true,
        record: rec,
      })
    })

    return list
  }, [locale, customTerms])

  // Filtragem e Ordenação
  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allTerms
      .filter((tItem) => {
        const matchesCategory = selectedCategory === 'all' || tItem.category === selectedCategory
        if (!matchesCategory) return false

        if (!q) return true
        const matchName = tItem.term.toLowerCase().includes(q)
        const matchDef = tItem.definition.toLowerCase().includes(q)
        return matchName || matchDef
      })
      .sort((a, b) => {
        const comp = a.term.localeCompare(b.term, locale === 'en' ? 'en' : 'pt-BR', {
          sensitivity: 'base',
        })
        return sortOrder === 'asc' ? comp : -comp
      })
  }, [allTerms, searchQuery, selectedCategory, sortOrder, locale])

  // Handlers para Abertura de Modais
  const handleOpenCreateModal = () => {
    setEditingTerm(null)
    setFormTerm('')
    setFormCategory('combate')
    setFormDefinition('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (rec: GlossaryTermRecord) => {
    setEditingTerm(rec)
    setFormTerm(rec.term)
    setFormCategory(rec.category)
    setFormDefinition(rec.definition)
    setModalOpen(true)
  }

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTerm.trim() || !formDefinition.trim()) return

    setSaving(true)
    try {
      if (editingTerm) {
        const updated = await glossaryTermsService.update(editingTerm.id, {
          term: formTerm.trim(),
          category: formCategory,
          definition: formDefinition.trim(),
        })
        setCustomTerms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        toast({
          title: t('glossary.updatedToast'),
          description: `"${updated.term}" salvo no tomo.`,
        })
      } else {
        const created = await glossaryTermsService.create({
          term: formTerm.trim(),
          category: formCategory,
          definition: formDefinition.trim(),
        })
        setCustomTerms((prev) => [...prev, created])
        toast({
          title: t('glossary.createdToast'),
          description: `"${created.term}" gravado no tomo.`,
        })
      }
      setModalOpen(false)
    } catch (err: any) {
      console.error(err)
      toast({
        title: t('glossary.errorToast'),
        description: err?.message || '',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!termToDelete) return
    setDeleting(true)
    try {
      await glossaryTermsService.delete(termToDelete.id)
      setCustomTerms((prev) => prev.filter((t) => t.id !== termToDelete.id))
      toast({
        title: t('glossary.deletedToast'),
        description: `"${termToDelete.term}" banido do glossário.`,
      })
      setDeleteConfirmOpen(false)
      setTermToDelete(null)
    } catch (err: any) {
      console.error(err)
      toast({
        title: t('glossary.errorToast'),
        description: err?.message || '',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <EternumLoadingScreen
        message={t('loading.consultingLexicon')}
        submessage={t('loading.aligningLexiconTerms')}
      />
    )
  }

  return (
    <div className="min-h-full bg-[#0a0d14] text-[#f1ede3] p-4 md:p-8">
      {/* Cabeçalho do Glossário */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#242b3b] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <RuneLexiconIcon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-fantasy font-bold tracking-wide text-amber-200">
                  {t('glossary.title')}
                </h1>
                <p className="text-xs md:text-sm text-[#b8b09e]">{t('glossary.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenCreateModal}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold gap-2 border border-amber-400/50 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('glossary.newTerm')}</span>
            </Button>
          </div>
        </div>

        {/* Barra de Filtros, Busca e Ordenação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 bg-[#111622] p-3.5 rounded-lg border border-[#232b3d]">
          {/* Busca por termo e definição */}
          <div className="lg:col-span-6 relative">
            <RuneSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('glossary.searchPlaceholder')}
              className="pl-9 bg-[#182030] border-[#2c364c] text-sm text-[#f1ede3] placeholder:text-[#8d8575] focus-visible:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400/70 hover:text-amber-300"
              >
                ×
              </button>
            )}
          </div>

          {/* Filtro por Categoria */}
          <div className="lg:col-span-4">
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val as GlossaryCategoryId | 'all')}
            >
              <SelectTrigger className="bg-[#182030] border-[#2c364c] text-sm text-[#f1ede3] focus:ring-amber-500">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                  <SelectValue placeholder={t('glossary.filterAll')} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#141a27] border-[#2c364c] text-[#f1ede3]">
                <SelectItem value="all">{t('glossary.filterAll')}</SelectItem>
                {GLOSSARY_CATEGORY_IDS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat)}
                      <span>{getCategoryLabel(cat)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenação A-Z / Z-A */}
          <div className="lg:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="w-full bg-[#182030] border-[#2c364c] hover:bg-[#202b40] text-[#f1ede3] text-sm flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-[#a8a090]">{t('glossary.sortLabel')}:</span>
              </div>
              <span className="font-semibold text-amber-300 text-xs">
                {sortOrder === 'asc' ? t('glossary.sortAz') : t('glossary.sortZa')}
              </span>
            </Button>
          </div>
        </div>

        {/* Resumo de Contagem */}
        <div className="flex items-center justify-between text-xs text-[#a39c8c] px-1">
          <div>
            {t('glossary.filteredCount')
              .replace('{count}', String(filteredTerms.length))
              .replace('{total}', String(allTerms.length))}
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400/70" />
              <span>{t('glossary.seedBadge')}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
              <span>
                {t('glossary.customBadge')} ({customTerms.length})
              </span>
            </span>
          </div>
        </div>

        {/* Grade de Verbetes */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#111622] rounded-lg border border-[#232b3d] space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-fantasy font-semibold text-amber-200">
              {t('glossary.emptyTitle')}
            </h3>
            <p className="text-xs md:text-sm text-[#9c9382] max-w-md mx-auto">
              {t('glossary.emptyDesc')}
            </p>
            <Button
              onClick={handleOpenCreateModal}
              variant="outline"
              className="mt-2 border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {t('glossary.newTerm')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map((tItem) => (
              <Card
                key={tItem.id}
                className="bg-[#121724] border-[#222a3b] hover:border-amber-500/40 transition-colors shadow-sm flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-base font-fantasy font-bold text-amber-100 tracking-wide flex items-center gap-2">
                          <span>{tItem.term}</span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {tItem.isCustom ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-mono px-1.5 py-0 border-emerald-500/40 text-emerald-300 bg-emerald-950/40"
                          >
                            {t('glossary.customBadge')}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-mono px-1.5 py-0 border-amber-500/30 text-amber-300/80 bg-amber-950/30"
                          >
                            {t('glossary.seedBadge')}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-mono px-2 py-0 flex items-center gap-1 ${getCategoryBadgeClass(
                            tItem.category,
                          )}`}
                        >
                          {getCategoryIcon(tItem.category)}
                          <span>{getCategoryLabel(tItem.category)}</span>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-[#c8c1b2] leading-relaxed pt-1">
                      {tItem.definition}
                    </p>
                  </div>

                  {/* Ações para termos próprios do usuário */}
                  {tItem.isCustom && tItem.record && (
                    <div className="pt-3 border-t border-[#1e2535] flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditModal(tItem.record!)}
                        className="h-7 px-2 text-xs text-amber-300/90 hover:text-amber-200 hover:bg-amber-500/10 gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>{t('glossary.editTerm')}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTermToDelete(tItem.record!)
                          setDeleteConfirmOpen(true)
                        }}
                        className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t('glossary.deleteTerm')}</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Nota de rodapé sobre isolamento dos termos do usuário */}
        <div className="p-3 bg-[#0d121c] rounded-md border border-[#1b2230] text-center text-[11px] text-[#8e8777]">
          {t('glossary.customNote')}
        </div>
      </div>

      {/* Modal de Criar / Editar Termo */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg bg-[#121724] border-[#293246] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-lg text-amber-200 flex items-center gap-2">
              <RuneLexiconIcon className="w-5 h-5 text-amber-400" />
              <span>{editingTerm ? t('glossary.editTerm') : t('glossary.newTerm')}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTerm} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-300">
                {t('glossary.termLabel')}
              </label>
              <Input
                value={formTerm}
                onChange={(e) => setFormTerm(e.target.value)}
                placeholder={t('glossary.termPlaceholder')}
                required
                className="bg-[#182030] border-[#2c364c] text-sm text-[#f1ede3] focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-300">
                {t('glossary.categoryLabel')}
              </label>
              <Select
                value={formCategory}
                onValueChange={(val) => setFormCategory(val as GlossaryCategoryId)}
              >
                <SelectTrigger className="bg-[#182030] border-[#2c364c] text-sm text-[#f1ede3] focus:ring-amber-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141a27] border-[#2c364c] text-[#f1ede3]">
                  {GLOSSARY_CATEGORY_IDS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat)}
                        <span>{getCategoryLabel(cat)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-300">
                {t('glossary.definitionLabel')}
              </label>
              <Textarea
                value={formDefinition}
                onChange={(e) => setFormDefinition(e.target.value)}
                placeholder={t('glossary.definitionPlaceholder')}
                required
                rows={4}
                className="bg-[#182030] border-[#2c364c] text-sm text-[#f1ede3] focus-visible:ring-amber-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="text-xs text-[#a09888] hover:text-[#f1ede3]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs border border-amber-400/50"
              >
                {saving ? t('glossary.savingTerm') : t('glossary.saveTerm')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-[#121724] border-[#293246] text-[#f1ede3]">
          <DialogHeader>
            <DialogTitle className="font-fantasy text-base text-red-300">
              {t('glossary.deleteTitle')}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#a8a191] pt-2">
              {termToDelete
                ? t('glossary.deleteDescription').replace('{term}', termToDelete.term)
                : ''}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="text-xs text-[#a09888]"
            >
              {t('glossary.deleteCancel')}
            </Button>
            <Button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="bg-red-700 hover:bg-red-600 text-white font-semibold text-xs border border-red-500/50"
            >
              {t('glossary.deleteConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

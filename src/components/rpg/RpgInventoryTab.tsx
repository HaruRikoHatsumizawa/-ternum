import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from '@/i18n/LanguageContext'
import { useConfirm } from '@/contexts/ConfirmDialogContext'
import {
  inventoryService,
  InventoryItemRecord,
  InventoryCategory,
  InventoryRarity,
  INVENTORY_CATEGORIES,
  INVENTORY_RARITIES,
} from '@/services/inventory'
import {
  RuneBackpackIcon,
  RuneSwordIcon,
  RuneShieldIcon,
  RunePotionIcon,
  RuneGemIcon,
  RuneScrollIcon,
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
import { Plus, Pencil, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react'

export interface RpgInventoryTabProps {
  characterId: string
  characterName: string
}

export function RpgInventoryTab({ characterId, characterName }: RpgInventoryTabProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const confirm = useConfirm()

  const [items, setItems] = useState<InventoryItemRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'all'>('all')

  // Diálogo de adicionar/editar item
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItemRecord | null>(null)
  const [formName, setFormName] = useState('')
  const [formQuantity, setFormQuantity] = useState(1)
  const [formCategory, setFormCategory] = useState<InventoryCategory>('weapon')
  const [formEquipped, setFormEquipped] = useState(false)
  const [formValueGold, setFormValueGold] = useState<number | ''>('')
  const [formRarity, setFormRarity] = useState<InventoryRarity | ''>('')
  const [formWeight, setFormWeight] = useState<number | ''>('')
  const [formNotes, setFormNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const loadItems = useCallback(async () => {
    if (!characterId) return
    try {
      const records = await inventoryService.listByCharacter(characterId)
      setItems(records)
    } catch (err) {
      console.error('Falha ao carregar inventário do personagem:', err)
      toast({
        title: t('inventory.loadError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [characterId, t, toast])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Categoria label & icon
  const getCategoryLabel = (cat: InventoryCategory): string => {
    switch (cat) {
      case 'weapon':
        return t('inventory.catWeapon')
      case 'armor':
        return t('inventory.catArmor')
      case 'consumable':
        return t('inventory.catConsumable')
      case 'treasure':
        return t('inventory.catTreasure')
      case 'adventure':
        return t('inventory.catAdventure')
      default:
        return cat
    }
  }

  const getCategoryIcon = (cat: InventoryCategory) => {
    switch (cat) {
      case 'weapon':
        return <RuneSwordIcon className="w-3.5 h-3.5 text-amber-400" />
      case 'armor':
        return <RuneShieldIcon className="w-3.5 h-3.5 text-blue-400" />
      case 'consumable':
        return <RunePotionIcon className="w-3.5 h-3.5 text-emerald-400" />
      case 'treasure':
        return <RuneGemIcon className="w-3.5 h-3.5 text-yellow-300" />
      case 'adventure':
      default:
        return <RuneScrollIcon className="w-3.5 h-3.5 text-stone-300" />
    }
  }

  // Resumo de peso e valor total
  const totals = useMemo(() => {
    let totalWeight = 0
    let totalGold = 0
    let equippedCount = 0

    items.forEach((it) => {
      const q = it.quantity || 1
      if (it.weight) totalWeight += it.weight * q
      if (it.value_gold) totalGold += it.value_gold * q
      if (it.is_equipped) equippedCount += 1
    })

    return {
      weight: Math.round(totalWeight * 10) / 10,
      gold: totalGold,
      equippedCount,
      totalCount: items.length,
    }
  }, [items])

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return items
    return items.filter((it) => it.category === categoryFilter)
  }, [items, categoryFilter])

  // Abrir criação
  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormName('')
    setFormQuantity(1)
    setFormCategory('weapon')
    setFormEquipped(false)
    setFormValueGold('')
    setFormRarity('')
    setFormWeight('')
    setFormNotes('')
    setDialogOpen(true)
  }

  // Abrir edição
  const handleOpenEdit = (it: InventoryItemRecord) => {
    setEditingItem(it)
    setFormName(it.name)
    setFormQuantity(it.quantity || 1)
    setFormCategory(it.category)
    setFormEquipped(Boolean(it.is_equipped))
    setFormValueGold(typeof it.value_gold === 'number' ? it.value_gold : '')
    setFormRarity(it.rarity || '')
    setFormWeight(typeof it.weight === 'number' ? it.weight : '')
    setFormNotes(it.notes || '')
    setDialogOpen(true)
  }

  // Alternar equipado rápido
  const handleToggleEquipped = async (it: InventoryItemRecord) => {
    try {
      const nextEquipped = !it.is_equipped
      await inventoryService.update(it.id, { is_equipped: nextEquipped })
      setItems((prev) =>
        prev.map((item) => (item.id === it.id ? { ...item, is_equipped: nextEquipped } : item)),
      )
      toast({
        title: nextEquipped ? t('inventory.equippedToast') : t('inventory.unequippedToast'),
      })
    } catch (err) {
      console.error('Erro ao alternar equipamento:', err)
      toast({ title: t('inventory.errorToast'), variant: 'destructive' })
    }
  }

  // Ajustar quantidade
  const handleAdjustQuantity = async (it: InventoryItemRecord, delta: number) => {
    const nextQ = Math.max(1, (it.quantity || 1) + delta)
    if (nextQ === it.quantity) return

    try {
      await inventoryService.update(it.id, { quantity: nextQ })
      setItems((prev) =>
        prev.map((item) => (item.id === it.id ? { ...item, quantity: nextQ } : item)),
      )
    } catch (err) {
      console.error('Erro ao ajustar quantidade:', err)
    }
  }

  // Salvar
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    setSaving(true)
    try {
      if (editingItem) {
        await inventoryService.update(editingItem.id, {
          name: formName.trim(),
          quantity: Math.max(1, Number(formQuantity) || 1),
          category: formCategory,
          is_equipped: formEquipped,
          value_gold: formValueGold === '' ? 0 : Number(formValueGold),
          rarity: (formRarity as InventoryRarity) || null,
          weight: formWeight === '' ? 0 : Number(formWeight),
          notes: formNotes.trim(),
          character_name: characterName,
        })
        toast({ title: t('inventory.updatedToast') })
      } else {
        await inventoryService.create({
          character_id: characterId,
          character_name: characterName,
          name: formName.trim(),
          quantity: Math.max(1, Number(formQuantity) || 1),
          category: formCategory,
          is_equipped: formEquipped,
          value_gold: formValueGold === '' ? 0 : Number(formValueGold),
          rarity: (formRarity as InventoryRarity) || null,
          weight: formWeight === '' ? 0 : Number(formWeight),
          notes: formNotes.trim(),
        })
        toast({ title: t('inventory.createdToast') })
      }
      setDialogOpen(false)
      loadItems()
    } catch (err) {
      console.error('Erro ao gravar item de inventário:', err)
      toast({ title: t('inventory.errorToast'), variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // Excluir com diálogo temático
  const handleDeleteItem = async (item: InventoryItemRecord) => {
    const confirmed = await confirm({
      title: t('confirm.deleteTitle'),
      description: t('confirm.inventoryItemDesc'),
      itemName: item.name,
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      dangerous: true,
      icon: 'blade',
    })
    if (!confirmed) return

    try {
      await inventoryService.delete(item.id)
      toast({ title: t('inventory.deletedToast') })
      loadItems()
    } catch (err) {
      console.error('Erro ao excluir item:', err)
      toast({ title: t('inventory.errorToast'), variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Barra de resumo e ações do inventário */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-stone-950/70 border border-amber-500/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <RuneBackpackIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-sm font-bold text-amber-100">
                {t('inventory.title')}
              </span>
              <Badge
                variant="outline"
                className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-[10px]"
              >
                {totals.totalCount} {t('inventory.itemsCount')}
              </Badge>
            </div>
            {/* Resumo discreto de peso, valor e equipados */}
            <div className="flex items-center gap-3 text-xs text-amber-300/70 mt-0.5">
              <span>
                {t('inventory.goldSummary')}:{' '}
                <strong className="text-amber-200">{totals.gold} PO</strong>
              </span>
              <span>•</span>
              <span>
                {t('inventory.weightSummary')}:{' '}
                <strong className="text-amber-200">{totals.weight} kg</strong>
              </span>
              <span>•</span>
              <span>
                {t('inventory.equippedSummary')}:{' '}
                <strong className="text-amber-200">{totals.equippedCount}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as InventoryCategory | 'all')}
            className="bg-stone-900 border border-amber-500/30 text-amber-100 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            aria-label={t('inventory.categoryFilter')}
          >
            <option value="all">{t('inventory.filterAll')}</option>
            {INVENTORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {getCategoryLabel(c)}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-medium text-xs font-cinzel gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('inventory.addItem')}</span>
          </Button>
        </div>
      </div>

      {/* Lista de itens */}
      {loading ? (
        <div className="py-8 text-center text-xs text-stone-400 font-cinzel">
          {t('inventory.loading')}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center bg-stone-950/40 border border-amber-500/10 rounded-xl space-y-2">
          <RuneBackpackIcon className="w-6 h-6 mx-auto text-amber-400/50" />
          <p className="text-xs text-stone-400 max-w-sm mx-auto">{t('inventory.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                item.is_equipped
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-950/20'
                  : 'bg-stone-950/60 border-stone-800/80 hover:border-amber-500/25'
              }`}
            >
              {/* Esquerda: Ícone de categoria + Nome + Badges */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="p-1.5 rounded bg-stone-900 border border-stone-800 shrink-0">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-cinzel text-xs sm:text-sm font-semibold text-amber-100 truncate">
                      {item.name}
                    </span>

                    {item.rarity && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/40 border border-purple-500/30 text-purple-200">
                        {item.rarity}
                      </span>
                    )}

                    {item.is_equipped && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/20 border-amber-400/50 text-amber-200 text-[10px] gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {t('inventory.equippedBadge')}
                      </Badge>
                    )}
                  </div>

                  {/* Detalhes: Categoria, PO, Peso, Notas */}
                  <div className="flex items-center gap-2.5 text-[11px] text-stone-400 mt-0.5 flex-wrap">
                    <span>{getCategoryLabel(item.category)}</span>
                    {typeof item.value_gold === 'number' && item.value_gold > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-300/80">{item.value_gold} PO</span>
                      </>
                    )}
                    {typeof item.weight === 'number' && item.weight > 0 && (
                      <>
                        <span>•</span>
                        <span>{item.weight} kg</span>
                      </>
                    )}
                    {item.notes && (
                      <>
                        <span>•</span>
                        <span className="italic text-stone-400 truncate max-w-xs">
                          {item.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Direita: Quantidade com botões +/- e Ações */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Quantidade */}
                <div className="flex items-center bg-stone-900 border border-stone-800 rounded px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => handleAdjustQuantity(item, -1)}
                    className="w-5 h-5 flex items-center justify-center text-xs text-stone-400 hover:text-amber-200 hover:bg-stone-800 rounded"
                    title="-1"
                  >
                    -
                  </button>
                  <span className="px-1.5 text-xs font-mono font-medium text-amber-200 min-w-[1.2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustQuantity(item, 1)}
                    className="w-5 h-5 flex items-center justify-center text-xs text-stone-400 hover:text-amber-200 hover:bg-stone-800 rounded"
                    title="+1"
                  >
                    +
                  </button>
                </div>

                {/* Botão de Equipar (relevante para arma/armadura) */}
                {(item.category === 'weapon' || item.category === 'armor') && (
                  <button
                    type="button"
                    onClick={() => handleToggleEquipped(item)}
                    className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                      item.is_equipped
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-stone-900 text-stone-400 hover:text-amber-200 border border-stone-800'
                    }`}
                    title={
                      item.is_equipped ? t('inventory.unequipAction') : t('inventory.equipAction')
                    }
                  >
                    {item.is_equipped ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Editar */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded text-stone-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  aria-label={t('inventory.editItem')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Excluir */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  className="p-1.5 rounded text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label={t('inventory.deleteItem')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diálogo de Criação/Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-stone-950 border-amber-500/30 text-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-lg text-amber-100">
              {editingItem ? t('inventory.editItem') : t('inventory.addItem')}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              {t('inventory.dialogDesc')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-cinzel text-amber-300 block mb-1">
                {t('inventory.nameLabel')}
              </label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t('inventory.namePlaceholder')}
                className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm focus-visible:ring-amber-500/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('inventory.categoryLabel')}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as InventoryCategory)}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-100 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                >
                  {INVENTORY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {getCategoryLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('inventory.quantityLabel')}
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm focus-visible:ring-amber-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('inventory.valueGoldLabel')}
                </label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={formValueGold}
                  onChange={(e) =>
                    setFormValueGold(
                      e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0),
                    )
                  }
                  placeholder="0 PO"
                  className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm focus-visible:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('inventory.weightLabel')}
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={formWeight}
                  onChange={(e) =>
                    setFormWeight(
                      e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0),
                    )
                  }
                  placeholder="0.0 kg"
                  className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs sm:text-sm focus-visible:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-cinzel text-amber-300 block mb-1">
                  {t('inventory.rarityLabel')}
                </label>
                <select
                  value={formRarity}
                  onChange={(e) => setFormRarity(e.target.value as InventoryRarity | '')}
                  className="w-full bg-stone-900 border border-amber-500/30 text-amber-100 rounded-md px-1.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                >
                  <option value="">{t('inventory.noRarity')}</option>
                  {INVENTORY_RARITIES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(formCategory === 'weapon' || formCategory === 'armor') && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="equipped_check"
                  checked={formEquipped}
                  onChange={(e) => setFormEquipped(e.target.checked)}
                  className="rounded border-amber-500/40 text-amber-500 focus:ring-amber-500/40 bg-stone-900"
                />
                <label
                  htmlFor="equipped_check"
                  className="text-xs text-amber-200 cursor-pointer select-none"
                >
                  {t('inventory.equippedCheckbox')}
                </label>
              </div>
            )}

            <div>
              <label className="text-xs font-cinzel text-amber-300 block mb-1">
                {t('inventory.notesLabel')}
              </label>
              <Textarea
                rows={2}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder={t('inventory.notesPlaceholder')}
                className="bg-stone-900 border-amber-500/30 text-amber-100 text-xs focus-visible:ring-amber-500/40"
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
                {saving ? t('inventory.saving') : t('inventory.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

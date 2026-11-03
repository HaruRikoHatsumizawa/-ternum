import { useState } from 'react'
import { useAppMode } from '@/contexts/ModeContext'
import { useLanguage } from '@/i18n/LanguageContext'
import {
  generateLoot,
  LootItem,
  LootRarity,
  LootType,
  getRarityStyle,
} from '@/services/lootGenerator'
import { databasesService } from '@/services/databases'
import {
  Sparkles,
  Dices,
  BookPlus,
  Coins,
  Shield,
  Swords,
  Scroll,
  History,
  Check,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { RuneHammerIcon, RuneScrollIcon, RunicInsignia } from '@/components/rpg/EternumIcons'
import { Button } from '@/components/ui/button'
import { RunicCircle, DragonSilhouette, TomeOrnament } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

export default function LootForge() {
  const { mode, setMode } = useAppMode()
  const { t } = useLanguage()
  const [currentItem, setCurrentItem] = useState<LootItem>(() => generateLoot())
  const [history, setHistory] = useState<LootItem[]>([])
  const [selectedRarity, setSelectedRarity] = useState<LootRarity | 'Qualquer'>('Qualquer')
  const [selectedType, setSelectedType] = useState<LootType | 'Qualquer'>('Qualquer')
  const [isRolling, setIsRolling] = useState(false)
  const [savingToCodex, setSavingToCodex] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleRoll = () => {
    setIsRolling(true)
    setSavedSuccess(false)
    setTimeout(() => {
      const rarity = selectedRarity === 'Qualquer' ? undefined : selectedRarity
      const type = selectedType === 'Qualquer' ? undefined : selectedType
      const newItem = generateLoot(rarity, type)

      setHistory((prev) => [currentItem, ...prev.slice(0, 19)])
      setCurrentItem(newItem)
      setIsRolling(false)
    }, 250)
  }

  const handleSaveToCodex = async () => {
    setSavingToCodex(true)
    try {
      // Procurar primeiro banco com Códice ou criar se não houver
      const dbs = await databasesService.list()
      let targetDb = dbs.find(
        (d) => d.name.toLowerCase().includes('códice') || d.name.toLowerCase().includes('itens'),
      )

      if (!targetDb && dbs.length > 0) {
        targetDb = dbs[0]
      }

      if (!targetDb) {
        targetDb = await databasesService.create({
          name: 'Códice Arcano: Tesouros & Relíquias',
          icon: 'gem',
          description: 'Registro de tesouros forjados e relíquias sorteadas',
          columns: [
            { id: 'col_name', name: 'Nome do Item', type: 'text' },
            {
              id: 'col_type',
              name: 'Categoria',
              type: 'select',
              values: ['Arma', 'Armadura', 'Consumível', 'Relíquia', 'Curiosidade'],
            },
            {
              id: 'col_rarity',
              name: 'Raridade',
              type: 'select',
              values: ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'],
            },
            { id: 'col_val', name: 'Valor (PO)', type: 'number' },
            { id: 'col_desc', name: 'Propriedades / Sabor', type: 'text' },
          ],
        })
      }

      // Adicionar nova linha no banco existente
      const newRow = {
        id: `row_${Date.now()}`,
        col_name: currentItem.name,
        col_type: currentItem.type,
        col_rarity: currentItem.rarity,
        col_cr: `${currentItem.rarity} (${currentItem.valueGold} PO)`,
        col_status: 'Em Posse do Grupo',
        col_loc: 'Forja do Tesouro',
        col_val: currentItem.valueGold,
        col_desc: `${currentItem.description} [${currentItem.effects.join('; ')}]`,
      }

      const existingRows = targetDb.rows || []
      await databasesService.update(targetDb.id, {
        rows: [newRow, ...existingRows],
      })

      setSavedSuccess(true)
      toast({
        title: 'Item Guardado no Códice!',
        description: `"${currentItem.name}" agora faz parte de suas tabelas arcanas.`,
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Falha ao guardar no Códice',
        description: err?.message || 'Tente novamente.',
      })
    } finally {
      setSavingToCodex(false)
    }
  }

  // Se o usuário tentar acessar a Forja do Tesouro no modo RP (exclusivo de RPG e Geral),
  // exibe uma tela elegante convidando a mudar o modo para RPG/Geral ou retornar ao Salão de Narrativa.
  if (mode === 'rp') {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <RuneHammerIcon className="w-8 h-8 opacity-70" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-fantasy uppercase tracking-wider">
            {t('loot.rpNotice.badge')}
          </span>
          <h1 className="text-2xl font-fantasy font-bold text-amber-100">
            {t('loot.rpNotice.heading')}
          </h1>
          <p className="text-sm text-[#a8a090] max-w-lg mx-auto leading-relaxed">
            {t('loot.rpNotice.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-[#141a24] hover:bg-[#1a2230] border border-[#2b3548] text-xs font-fantasy text-amber-200 transition-colors flex items-center gap-2"
          >
            <RuneScrollIcon className="w-4 h-4 text-purple-400" />
            <span>{t('loot.rpNotice.backToRp')}</span>
          </Link>
          <Button
            onClick={() => setMode('rpg')}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-fantasy font-bold text-xs"
          >
            <RuneHammerIcon className="w-4 h-4 mr-1.5" />
            {t('loot.rpNotice.enableRpg')}
          </Button>
          <Button
            onClick={() => setMode('geral')}
            variant="outline"
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-fantasy text-xs"
          >
            {t('loot.rpNotice.enableGeneral')}
          </Button>
        </div>
      </div>
    )
  }

  const rarityStyle = getRarityStyle(currentItem.rarity)

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262c3a] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <RuneHammerIcon className="w-6 h-6 mode-accent-text" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              {t('loot.title')}
            </h1>
          </div>
          <p className="text-xs text-[#a8a090] max-w-xl">{t('loot.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRoll}
            disabled={isRolling}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold gap-2 border border-amber-300/40 shadow-md shadow-amber-950/40"
          >
            <Dices className={`h-4 w-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? t('loot.rollingButton') : t('loot.rollButton')}</span>
          </Button>
        </div>
      </div>

      {/* Controles de Filtro de Sorteio */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-[#121620] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-300">{t('loot.targetRarity')}</span>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as any)}
              className="h-8 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
            >
              <option value="Qualquer">{t('loot.anyRarity')}</option>
              <option value="Comum">{t('loot.rarities.common')}</option>
              <option value="Incomum">{t('loot.rarities.uncommon')}</option>
              <option value="Raro">{t('loot.rarities.rare')}</option>
              <option value="Épico">{t('loot.rarities.epic')}</option>
              <option value="Lendário">{t('loot.rarities.legendary')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-300">{t('loot.gearType')}</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="h-8 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
            >
              <option value="Qualquer">{t('loot.anyType')}</option>
              <option value="Arma">{t('loot.types.weapon')}</option>
              <option value="Armadura">{t('loot.types.armor')}</option>
              <option value="Consumível">{t('loot.types.consumable')}</option>
              <option value="Relíquia">{t('loot.types.relic')}</option>
              <option value="Curiosidade">{t('loot.types.curiosity')}</option>
            </select>
          </div>
        </div>

        <span className="text-[11px] text-[#8e8678] italic">{t('loot.stochasticNote')}</span>
      </div>

      {/* Cartão de Exibição Principal do Item */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 shadow-2xl bg-[#0f131a] ${rarityStyle.border}`}
        style={{
          boxShadow: `0 0 35px -5px ${rarityStyle.glow}, inset 0 0 20px -5px ${rarityStyle.glow}`,
        }}
      >
        {/* Marca d'água arcana decorativa */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-amber-400">
          <DragonSilhouette className="w-64 h-64" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl border flex items-center justify-center shadow-inner ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.text}`}
              >
                <RunicInsignia name={currentItem.icon} className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-fantasy font-bold uppercase tracking-wider border ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.text}`}
                  >
                    {currentItem.rarity}
                  </span>
                  <span className="text-xs text-[#a39b8d] font-fantasy">• {currentItem.type}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-fantasy font-extrabold text-amber-100 tracking-wide">
                  {currentItem.name}
                </h2>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 bg-[#151a24] p-3 rounded-xl border border-[#2b3345]">
              <span className="text-[10px] uppercase font-fantasy text-amber-300/70">
                {t('loot.estimatedValue')}
              </span>
              <span className="text-xl font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Coins className="h-5 w-5 text-amber-400" />
                {currentItem.valueGold.toLocaleString('pt-BR')} {t('common.gold')}
              </span>
            </div>
          </div>

          <TomeOrnament className="w-full h-3 text-amber-500/30" />

          {/* Sabor e Descrição */}
          <div className="p-4 rounded-xl bg-[#0a0d13]/80 border border-[#202735] text-sm text-amber-100/90 italic font-serif leading-relaxed">
            "{currentItem.description}"
          </div>

          {/* Propriedades Mágicas */}
          <div className="space-y-2">
            <h3 className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {t('loot.effectsHeader')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentItem.effects.map((eff, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-[#141924] border border-[#232b3b] text-amber-200/90 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{eff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações para o item sorteado */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#222938]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRoll}
              className="text-xs border-[#2b3447] text-amber-300 hover:text-amber-100 hover:bg-amber-500/10"
            >
              <Dices className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              {t('loot.rollAgain')}
            </Button>

            <Button
              size="sm"
              onClick={handleSaveToCodex}
              disabled={savingToCodex || savedSuccess}
              className={`text-xs font-fantasy font-bold border ${
                savedSuccess
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  {t('loot.savedToCodex')}
                </>
              ) : (
                <>
                  <BookPlus className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                  {savingToCodex ? t('loot.savingToCodex') : t('loot.saveToCodex')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Histórico da Sessão */}
      {history.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#262c3a]">
          <div className="flex items-center gap-2 text-sm font-fantasy font-bold text-amber-200">
            <History className="h-4 w-4 text-amber-400" />
            <span>{t('loot.sessionHistory', { count: history.length })}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((item) => {
              const style = getRarityStyle(item.rarity)
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentItem(item)}
                  className="p-3 rounded-xl border border-[#232b3b] bg-[#121620] hover:border-amber-500/40 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`p-1 rounded bg-[#1a2130] border border-[#2b3548] flex items-center justify-center ${style.text}`}
                    >
                      <RunicInsignia name={item.icon} className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-[10px] font-fantasy font-bold px-1.5 py-0.2 rounded border ${style.bg} ${style.border} ${style.text}`}
                    >
                      {item.rarity}
                    </span>
                  </div>
                  <h4 className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#8e8678]">
                    <span>{item.type}</span>
                    <span className="font-mono text-amber-300/80">{item.valueGold} PO</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

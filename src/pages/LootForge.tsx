import { useState } from 'react'
import { useAppMode } from '@/contexts/ModeContext'
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
import { RuneHammerIcon } from '@/components/rpg/EternumIcons'
import { Button } from '@/components/ui/button'
import { RunicCircle, DragonSilhouette, TomeOrnament } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

export default function LootForge() {
  const { mode } = useAppMode()
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
          icon: '💎',
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
              Forja do Tesouro & Gerador de Loot
            </h1>
          </div>
          <p className="text-xs text-[#a8a090] max-w-xl">
            Sorteie armas, armaduras, elixires e relíquias rúnicas 100% locais com descrições de
            sabor, valores em peças de ouro e efeitos mágicos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRoll}
            disabled={isRolling}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold gap-2 border border-amber-300/40 shadow-md shadow-amber-950/40"
          >
            <Dices className={`h-4 w-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Forjando nas Chamas...' : 'Sortear Novo Item'}</span>
          </Button>
        </div>
      </div>

      {/* Controles de Filtro de Sorteio */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-[#121620] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-300">Raridade Alvo:</span>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as any)}
              className="h-8 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
            >
              <option value="Qualquer">Qualquer Raridade</option>
              <option value="Comum">Comum</option>
              <option value="Incomum">Incomum</option>
              <option value="Raro">Raro</option>
              <option value="Épico">Épico</option>
              <option value="Lendário">Lendário</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-300">Tipo de Equipamento:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="h-8 rounded-md bg-[#090c10] border border-[#262e40] px-2.5 text-xs text-amber-100 focus:outline-hidden"
            >
              <option value="Qualquer">Qualquer Tipo</option>
              <option value="Arma">Arma</option>
              <option value="Armadura">Armadura</option>
              <option value="Consumível">Consumível</option>
              <option value="Relíquia">Relíquia</option>
              <option value="Curiosidade">Curiosidade</option>
            </select>
          </div>
        </div>

        <span className="text-[11px] text-[#8e8678] italic">
          * Combinação estocástica por prefixos e afixos rúnicos
        </span>
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
                className={`w-16 h-16 rounded-xl border flex items-center justify-center text-3xl shadow-inner ${rarityStyle.bg} ${rarityStyle.border}`}
              >
                {currentItem.icon}
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
                Valor Estimado
              </span>
              <span className="text-xl font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Coins className="h-5 w-5 text-amber-400" />
                {currentItem.valueGold.toLocaleString('pt-BR')} PO
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
              Efeitos & Encantamentos
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
              Rolar Novamente
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
                  Guardado no Códice!
                </>
              ) : (
                <>
                  <BookPlus className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                  {savingToCodex ? 'Inscrevendo no Tomo...' : 'Guardar no Códice'}
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
            <span>Itens Forjados Anteriormente nesta Sessão ({history.length})</span>
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
                    <span className="text-xl">{item.icon}</span>
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

import { useState, useEffect } from 'react'
import { npcsService, NpcRecord, NpcStatus } from '@/services/npcs'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RunicCircle, TomeOrnament, CrestShield } from '@/components/rpg/RpgArtwork'
import { toast } from '@/hooks/use-toast'

function getModifier(score?: number): string {
  if (score === undefined || score === null) return '+0'
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default function NpcView() {
  const [npcs, setNpcs] = useState<NpcRecord[]>([])
  const [selectedNpc, setSelectedNpc] = useState<NpcRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

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

  const handleStartCreate = () => {
    setIsCreating(true)
    setIsEditing(true)
    setSelectedNpc(null)
    setFormData({
      name: 'Novo Personagem Não Jogável',
      race: 'Humano',
      occupation: 'Cidadão / Mercador',
      location: 'Vila da Pedra Alta',
      alignment: 'Neutro e Bom',
      status: 'Vivo',
      appearance: 'Aparência, vestes e traços marcantes...',
      hp: 20,
      ac: 12,
      cr: 'ND 1',
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
      personality: {
        traits: 'Traço de personalidade...',
        ideals: 'Ideal ou crença...',
        bonds: 'Vínculo importante...',
        flaws: 'Defeito ou fraqueza...',
      },
      secrets: 'Segredo oculto deste NPC que o grupo pode descobrir...',
      notes: 'Relações com a trama da campanha...',
      avatar: '👤',
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
        toast({ title: 'NPC Criado com Sucesso!' })
        setIsCreating(false)
        setIsEditing(false)
        await loadNpcs()
        setSelectedNpc(created)
      } else if (selectedNpc) {
        const updated = await npcsService.update(selectedNpc.id, formData)
        toast({ title: 'Ficha de NPC Atualizada!' })
        setIsEditing(false)
        await loadNpcs()
        setSelectedNpc(updated)
      }
    } catch (err: any) {
      toast({ title: 'Falha ao salvar NPC', description: err?.message })
    }
  }

  const handleDelete = async () => {
    if (!selectedNpc) return
    if (!confirm(`Deseja apagar a ficha de "${selectedNpc.name}"?`)) return

    try {
      await npcsService.delete(selectedNpc.id)
      toast({ title: 'NPC removido do códice' })
      const remaining = npcs.filter((n) => n.id !== selectedNpc.id)
      setNpcs(remaining)
      setSelectedNpc(remaining[0] || null)
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  const active = isEditing ? (formData as NpcRecord) : selectedNpc

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262c3a] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-fantasy font-bold text-amber-100 flex items-center gap-2">
              Fichas de NPCs & Personagens Notáveis
            </h1>
          </div>
          <p className="text-xs text-[#a8a090] max-w-xl">
            Stat blocks ricos e detalhados com layout de pergaminho antigo: atributos, personalidade
            (ideais, vínculos e defeitos), segredos e conexões de enredo.
          </p>
        </div>

        <Button
          onClick={handleStartCreate}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold gap-1.5 border border-amber-300/40 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Novo NPC</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Lista de NPCs */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-fantasy font-bold text-amber-300 uppercase tracking-wider px-1">
            <span>Personagens no Tomo ({npcs.length})</span>
          </div>

          <div className="space-y-2">
            {npcs.map((npc) => {
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
                  <span className="text-2xl shrink-0 p-1.5 rounded-lg bg-[#1a2130] border border-[#2b3548]">
                    {npc.avatar || '👤'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-fantasy font-bold text-amber-100 truncate group-hover:text-amber-200">
                      {npc.name}
                    </h3>
                    <p className="text-[11px] text-[#9e9688] truncate">
                      {npc.occupation || npc.race}
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
                Nenhum NPC registrado. Clique em "+ Novo NPC" para forjar sua primeira ficha!
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Stat Block em Pergaminho */}
        <div className="lg:col-span-8">
          {active ? (
            <div className="relative rounded-2xl border-2 border-amber-500/40 bg-[#161b26] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Botões de Ação da Ficha */}
              <div className="flex items-center justify-between border-b border-[#2a3448] pb-4">
                <div className="flex items-center gap-2">
                  <CrestShield className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-300">
                    {isCreating
                      ? 'Forjando Nova Ficha'
                      : isEditing
                        ? 'Editando Stat Block'
                        : 'Stat Block Oficial de Campanha'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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

              {/* Cabeçalho do Personagem */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-fantasy font-bold text-amber-200">
                        Nome do NPC
                      </label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0c1017] border-[#2c3548] text-amber-100 font-fantasy font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy font-bold text-amber-200">
                        Ícone / Avatar
                      </label>
                      <Input
                        value={formData.avatar || ''}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="Ex: 🧙‍♂️, 🎴, 🛡️"
                        className="bg-[#0c1017] border-[#2c3548] text-amber-100 text-center"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      {active.avatar || '👤'}
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-fantasy font-extrabold text-amber-100">
                        {active.name}
                      </h2>
                      <p className="text-xs text-amber-300/80 italic font-serif">
                        {active.race} • {active.occupation} • {active.alignment}
                      </p>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy text-amber-200">Raça</label>
                      <Input
                        value={formData.race || ''}
                        onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                        className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-fantasy text-amber-200">Ocupação</label>
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
                  </div>
                )}
              </div>

              <TomeOrnament className="w-full h-3 text-amber-500/40" />

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

              {/* Aparência & Localização */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-amber-300">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>Aparência & Onde Encontrar</span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Local de morada ou estadia..."
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-[#0c1017] border-[#2c3548] text-xs text-amber-100"
                    />
                    <Textarea
                      rows={2}
                      placeholder="Descrição física, vestes, cicatrizes..."
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
                    placeholder="O que este NPC esconde a sete chaves?"
                    className="bg-[#0c1017] border-purple-500/40 text-xs text-purple-200"
                  />
                ) : (
                  <p className="text-xs text-purple-200/90 italic font-serif">
                    {active.secrets || 'Nenhum segredo registrado ainda.'}
                  </p>
                )}
              </div>

              {/* Notas de Enredo */}
              <div className="space-y-1 text-xs">
                <span className="font-fantasy font-bold text-amber-300/80">
                  Notas de Trama & Relações
                </span>
                {isEditing ? (
                  <Textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Conexão com missões, facções ou jogadores..."
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
              Selecione um NPC na lista à esquerda ou forje um novo para ler seu Stat Block.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

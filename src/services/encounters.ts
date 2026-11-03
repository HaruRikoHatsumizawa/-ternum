import pb from '@/lib/pocketbase/client'

export type TargetMode = 'geral' | 'rpg' | 'rp'

export type CombatantType = 'hero' | 'monster' | 'npc'
export type CombatantSource = 'ficha' | 'codice' | 'avulso'

export interface Combatant {
  id: string
  name: string
  type: CombatantType
  source: CombatantSource
  sourceId?: string
  initiative: number
  hpCurrent: number
  hpMax: number
  tempHp?: number
  ac: number
  conditions: string[]
  notes?: string
  avatar?: string
}

export type EncounterStatus = 'Preparando' | 'Em Andamento' | 'Finalizado'

export interface EncounterRecord {
  id: string
  user: string
  name: string
  description?: string
  status: EncounterStatus
  round: number
  current_turn_index: number
  combatants: Combatant[]
  target_mode?: TargetMode
  created: string
  updated: string
}

export interface CreateEncounterData {
  name: string
  description?: string
  status?: EncounterStatus
  round?: number
  current_turn_index?: number
  combatants?: Combatant[]
  target_mode?: TargetMode
}

export const encountersService = {
  async list(): Promise<EncounterRecord[]> {
    return pb.collection('encounters').getFullList<EncounterRecord>({
      sort: '-updated',
    })
  },

  async getById(id: string): Promise<EncounterRecord> {
    return pb.collection('encounters').getOne<EncounterRecord>(id)
  },

  async create(data: CreateEncounterData): Promise<EncounterRecord> {
    const user = pb.authStore.record
    if (!user) throw new Error('Usuário não autenticado')

    return pb.collection('encounters').create<EncounterRecord>({
      user: user.id,
      name: data.name,
      description: data.description || '',
      status: data.status || 'Preparando',
      round: data.round !== undefined ? data.round : 1,
      current_turn_index: data.current_turn_index !== undefined ? data.current_turn_index : 0,
      combatants: data.combatants || [],
      target_mode: data.target_mode || 'rpg',
    })
  },

  async update(id: string, data: Partial<EncounterRecord>): Promise<EncounterRecord> {
    return pb.collection('encounters').update<EncounterRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('encounters').delete(id)
  },
}

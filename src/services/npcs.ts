import pb from '@/lib/pocketbase/client'

export type NpcStatus = 'Vivo' | 'Desconhecido' | 'Morto'
export type TargetMode = 'geral' | 'rpg' | 'rp'

export interface NpcPersonality {
  traits?: string
  ideals?: string
  bonds?: string
  flaws?: string
}

export interface NpcRecord {
  id: string
  user: string
  name: string
  species?: string // Espécie Antropomórfica (Furry sofisticado)
  race?: string
  occupation?: string
  location?: string
  alignment?: string
  status: NpcStatus
  appearance?: string
  bio?: string // Biografia narrativa (RP)
  relationships?: string // Relações com outros personagens/facções (RP)
  hp?: number
  ac?: number
  cr?: string
  str?: number
  dex?: number
  con?: number
  int?: number
  wis?: number
  cha?: number
  personality?: NpcPersonality
  secrets?: string
  notes?: string
  avatar?: string
  target_mode?: TargetMode
  created: string
  updated: string
}

export interface CreateNpcData {
  name: string
  species?: string
  race?: string
  occupation?: string
  location?: string
  alignment?: string
  status?: NpcStatus
  appearance?: string
  bio?: string
  relationships?: string
  hp?: number
  ac?: number
  cr?: string
  str?: number
  dex?: number
  con?: number
  int?: number
  wis?: number
  cha?: number
  personality?: NpcPersonality
  secrets?: string
  notes?: string
  avatar?: string
  target_mode?: TargetMode
}

export const npcsService = {
  async list(): Promise<NpcRecord[]> {
    return pb.collection('npcs').getFullList<NpcRecord>({
      sort: 'name',
    })
  },

  async getById(id: string): Promise<NpcRecord> {
    return pb.collection('npcs').getOne<NpcRecord>(id)
  },

  async create(data: CreateNpcData): Promise<NpcRecord> {
    const userId = pb.authStore.record?.id
    if (!userId) throw new Error('Usuário não autenticado')

    return pb.collection('npcs').create<NpcRecord>({
      user: userId,
      status: data.status || 'Vivo',
      target_mode: data.target_mode || 'geral',
      ...data,
    })
  },

  async update(id: string, data: Partial<NpcRecord>): Promise<NpcRecord> {
    return pb.collection('npcs').update<NpcRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('npcs').delete(id)
  },
}

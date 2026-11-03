import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export type InventoryCategory = 'weapon' | 'armor' | 'consumable' | 'treasure' | 'adventure'
export type InventoryRarity = 'Comum' | 'Incomum' | 'Raro' | 'Muito Raro' | 'Lendário' | 'Artefato'

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  'weapon',
  'armor',
  'consumable',
  'treasure',
  'adventure',
]

export const INVENTORY_RARITIES: InventoryRarity[] = [
  'Comum',
  'Incomum',
  'Raro',
  'Muito Raro',
  'Lendário',
  'Artefato',
]

export interface InventoryItemRecord extends RecordModel {
  user: string
  character_id: string
  character_name?: string
  name: string
  quantity: number
  category: InventoryCategory
  is_equipped?: boolean
  value_gold?: number
  rarity?: InventoryRarity | null
  weight?: number
  notes?: string
}

export const inventoryService = {
  async listByCharacter(characterId: string): Promise<InventoryItemRecord[]> {
    return await pb.collection('inventory_items').getFullList<InventoryItemRecord>({
      filter: `character_id = "${characterId}"`,
      sort: '-is_equipped,name',
    })
  },

  async listAll(): Promise<InventoryItemRecord[]> {
    return await pb.collection('inventory_items').getFullList<InventoryItemRecord>({
      sort: 'character_id,name',
    })
  },

  async create(data: {
    character_id: string
    character_name?: string
    name: string
    quantity: number
    category: InventoryCategory
    is_equipped?: boolean
    value_gold?: number
    rarity?: InventoryRarity | null
    weight?: number
    notes?: string
  }): Promise<InventoryItemRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    return await pb.collection('inventory_items').create<InventoryItemRecord>({
      user,
      character_id: data.character_id,
      character_name: data.character_name || '',
      name: data.name,
      quantity: Number(data.quantity) || 1,
      category: data.category,
      is_equipped: Boolean(data.is_equipped),
      value_gold: data.value_gold ? Number(data.value_gold) : 0,
      rarity: data.rarity || null,
      weight: data.weight ? Number(data.weight) : 0,
      notes: data.notes || '',
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      quantity?: number
      category?: InventoryCategory
      is_equipped?: boolean
      value_gold?: number
      rarity?: InventoryRarity | null
      weight?: number
      notes?: string
      character_name?: string
    },
  ): Promise<InventoryItemRecord> {
    return await pb.collection('inventory_items').update<InventoryItemRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('inventory_items').delete(id)
  },
}

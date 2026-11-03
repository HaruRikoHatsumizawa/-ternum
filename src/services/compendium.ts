import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export type CompendiumUniverse = 'dnd' | 'bleach' | 'dragonball' | 'anime' | 'games' | 'outro'
export type CompendiumEntryType = 'race' | 'power'

export const COMPENDIUM_UNIVERSES: CompendiumUniverse[] = [
  'dnd',
  'bleach',
  'dragonball',
  'anime',
  'games',
  'outro',
]

export const COMPENDIUM_ENTRY_TYPES: CompendiumEntryType[] = ['race', 'power']

export interface CompendiumEntryRecord extends RecordModel {
  user: string
  name: string
  universe: CompendiumUniverse
  entry_type: CompendiumEntryType
  short_description: string
  traits?: string[] | null
}

export const compendiumService = {
  async list(): Promise<CompendiumEntryRecord[]> {
    return await pb.collection('compendium_entries').getFullList<CompendiumEntryRecord>({
      sort: 'name',
    })
  },

  async create(data: {
    name: string
    universe: CompendiumUniverse
    entry_type: CompendiumEntryType
    short_description: string
    traits?: string[]
  }): Promise<CompendiumEntryRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    return await pb.collection('compendium_entries').create<CompendiumEntryRecord>({
      user,
      name: data.name,
      universe: data.universe,
      entry_type: data.entry_type,
      short_description: data.short_description,
      traits: data.traits || [],
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      universe?: CompendiumUniverse
      entry_type?: CompendiumEntryType
      short_description?: string
      traits?: string[]
    },
  ): Promise<CompendiumEntryRecord> {
    return await pb.collection('compendium_entries').update<CompendiumEntryRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('compendium_entries').delete(id)
  },
}

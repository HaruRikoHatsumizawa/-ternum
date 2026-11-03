import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export type ColumnType = 'text' | 'number' | 'select' | 'checkbox' | 'date'

export interface DatabaseColumn {
  id: string
  name: string
  type: ColumnType
  values?: string[] // para select
}

export interface DatabaseRow {
  id: string
  [columnId: string]: any
}

export interface DatabaseRecord extends RecordModel {
  user: string
  name: string
  description?: string
  icon?: string
  columns: DatabaseColumn[]
  rows: DatabaseRow[]
}

export const databasesService = {
  async list(): Promise<DatabaseRecord[]> {
    return await pb.collection('databases').getFullList<DatabaseRecord>({
      sort: '-updated',
    })
  },

  async getById(id: string): Promise<DatabaseRecord> {
    return await pb.collection('databases').getOne<DatabaseRecord>(id)
  },

  async create(data: {
    name: string
    description?: string
    icon?: string
    columns?: DatabaseColumn[]
    rows?: DatabaseRow[]
  }): Promise<DatabaseRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    const defaultColumns: DatabaseColumn[] = [
      { id: 'col_name', name: 'Nome / Identificação', type: 'text' },
      {
        id: 'col_type',
        name: 'Categoria',
        type: 'select',
        values: [
          'NPC Aliado',
          'Inimigo / Chefe',
          'Monstro Bestial',
          'Item Mágico',
          'Artefato Lendário',
        ],
      },
      {
        id: 'col_cr',
        name: 'Nível / ND',
        type: 'text',
      },
      {
        id: 'col_status',
        name: 'Estado no Jogo',
        type: 'select',
        values: ['Ativo / Vivo', 'Derrotado', 'Em Posse', 'Desaparecido'],
      },
    ]

    return await pb.collection('databases').create<DatabaseRecord>({
      user,
      name: data.name || 'Novo Códice Arcano',
      description: data.description || 'Registro de monstros, NPCs e tesouros da mesa',
      icon: data.icon || 'tome',
      columns: data.columns || defaultColumns,
      rows: data.rows || [],
    })
  },

  async update(id: string, data: Partial<DatabaseRecord>): Promise<DatabaseRecord> {
    return await pb.collection('databases').update<DatabaseRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('databases').delete(id)
  },
}

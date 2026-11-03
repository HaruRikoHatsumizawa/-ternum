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
      { id: 'col_name', name: 'Nome', type: 'text' },
      {
        id: 'col_status',
        name: 'Status',
        type: 'select',
        values: ['Pendente', 'Em andamento', 'Concluído'],
      },
      {
        id: 'col_priority',
        name: 'Prioridade',
        type: 'select',
        values: ['Baixa', 'Média', 'Alta'],
      },
      { id: 'col_date', name: 'Prazo', type: 'date' },
    ]

    return await pb.collection('databases').create<DatabaseRecord>({
      user,
      name: data.name || 'Nova Tabela de Dados',
      description: data.description || '',
      icon: data.icon || '📊',
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

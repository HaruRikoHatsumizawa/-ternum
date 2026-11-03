import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export interface BoardCard {
  id: string
  columnId: string
  title: string
  description?: string
  priority?: 'baixa' | 'media' | 'alta'
  dueDate?: string
}

export interface BoardColumn {
  id: string
  title: string
  color?: string
}

export interface BoardRecord extends RecordModel {
  user: string
  name: string
  description?: string
  icon?: string
  columns: BoardColumn[]
  cards: BoardCard[]
}

export const boardsService = {
  async list(): Promise<BoardRecord[]> {
    return await pb.collection('boards').getFullList<BoardRecord>({
      sort: '-updated',
    })
  },

  async getById(id: string): Promise<BoardRecord> {
    return await pb.collection('boards').getOne<BoardRecord>(id)
  },

  async create(data: {
    name: string
    description?: string
    icon?: string
    columns?: BoardColumn[]
    cards?: BoardCard[]
  }): Promise<BoardRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    const defaultColumns: BoardColumn[] = [
      { id: 'todo', title: 'A fazer', color: 'bg-slate-100 text-slate-700' },
      { id: 'in_progress', title: 'Fazendo', color: 'bg-blue-50 text-blue-700' },
      { id: 'done', title: 'Feito', color: 'bg-emerald-50 text-emerald-700' },
    ]

    return await pb.collection('boards').create<BoardRecord>({
      user,
      name: data.name || 'Novo Quadro de Tarefas',
      description: data.description || '',
      icon: data.icon || '📌',
      columns: data.columns || defaultColumns,
      cards: data.cards || [],
    })
  },

  async update(id: string, data: Partial<BoardRecord>): Promise<BoardRecord> {
    return await pb.collection('boards').update<BoardRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('boards').delete(id)
  },
}

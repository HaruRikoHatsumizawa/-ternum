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
      {
        id: 'todo',
        title: 'Disponível',
        color: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
      },
      {
        id: 'in_progress',
        title: 'Em andamento',
        color: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
      },
      {
        id: 'done',
        title: 'Concluída',
        color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
      },
    ]

    return await pb.collection('boards').create<BoardRecord>({
      user,
      name: data.name || 'Novo Mural de Missões',
      description: data.description || 'Quadro de aventuras e contratos da mesa',
      icon: data.icon || 'sword',
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

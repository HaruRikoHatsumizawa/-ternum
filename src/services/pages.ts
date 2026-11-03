import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export interface PageBlock {
  id: string
  type: 'text' | 'heading_1' | 'heading_2' | 'heading_3' | 'bullet' | 'todo' | 'quote' | 'callout'
  content: string
  checked?: boolean
}

export interface PageRecord extends RecordModel {
  user: string
  title: string
  icon?: string
  cover?: string
  blocks?: PageBlock[]
  is_favorite?: boolean
}

export const pagesService = {
  async list(): Promise<PageRecord[]> {
    return await pb.collection('pages').getFullList<PageRecord>({
      sort: '-updated',
    })
  },

  async getById(id: string): Promise<PageRecord> {
    return await pb.collection('pages').getOne<PageRecord>(id)
  },

  async create(data: {
    title: string
    icon?: string
    cover?: string
    blocks?: PageBlock[]
    is_favorite?: boolean
  }): Promise<PageRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    return await pb.collection('pages').create<PageRecord>({
      user,
      title: data.title || 'Sem título',
      icon: data.icon || '📄',
      cover: data.cover || '',
      blocks: data.blocks || [{ id: 'b_' + Date.now(), type: 'text', content: '' }],
      is_favorite: data.is_favorite || false,
    })
  },

  async update(id: string, data: Partial<PageRecord>): Promise<PageRecord> {
    return await pb.collection('pages').update<PageRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('pages').delete(id)
  },

  async toggleFavorite(id: string, current: boolean): Promise<PageRecord> {
    return await pb.collection('pages').update<PageRecord>(id, {
      is_favorite: !current,
    })
  },
}

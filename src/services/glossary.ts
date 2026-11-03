import pb from '@/lib/pocketbase/client'
import { RecordModel } from 'pocketbase'

export type GlossaryCategoryId = 'combate' | 'personagem' | 'regras' | 'dados' | 'mesa'

export const GLOSSARY_CATEGORY_IDS: GlossaryCategoryId[] = [
  'combate',
  'personagem',
  'regras',
  'dados',
  'mesa',
]

export interface GlossaryTermRecord extends RecordModel {
  user: string
  term: string
  category: GlossaryCategoryId
  definition: string
}

export const glossaryTermsService = {
  async list(): Promise<GlossaryTermRecord[]> {
    return await pb.collection('glossary_terms').getFullList<GlossaryTermRecord>({
      sort: 'term',
    })
  },

  async create(data: {
    term: string
    category: GlossaryCategoryId
    definition: string
  }): Promise<GlossaryTermRecord> {
    const user = pb.authStore.record?.id
    if (!user) throw new Error('Usuário não autenticado')

    return await pb.collection('glossary_terms').create<GlossaryTermRecord>({
      user,
      term: data.term,
      category: data.category,
      definition: data.definition,
    })
  },

  async update(
    id: string,
    data: {
      term?: string
      category?: GlossaryCategoryId
      definition?: string
    },
  ): Promise<GlossaryTermRecord> {
    return await pb.collection('glossary_terms').update<GlossaryTermRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await pb.collection('glossary_terms').delete(id)
  },
}

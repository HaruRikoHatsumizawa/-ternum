import pb from '@/lib/pocketbase/client'

export type SessionStatus = 'Agendada' | 'Realizada' | 'Cancelada'

export interface SessionRecord {
  id: string
  user: string
  title: string
  date: string // ISO date string
  status: SessionStatus
  campaign?: string
  notes?: string
  location?: string
  created: string
  updated: string
}

export interface CreateSessionData {
  title: string
  date: string
  status?: SessionStatus
  campaign?: string
  notes?: string
  location?: string
}

export const sessionsService = {
  async list(): Promise<SessionRecord[]> {
    return pb.collection('sessions').getFullList<SessionRecord>({
      sort: 'date',
    })
  },

  async getById(id: string): Promise<SessionRecord> {
    return pb.collection('sessions').getOne<SessionRecord>(id)
  },

  async create(data: CreateSessionData): Promise<SessionRecord> {
    const userId = pb.authStore.record?.id
    if (!userId) throw new Error('Usuário não autenticado')

    return pb.collection('sessions').create<SessionRecord>({
      user: userId,
      status: data.status || 'Agendada',
      campaign: data.campaign || 'As Crônicas de Val-Morath',
      ...data,
    })
  },

  async update(id: string, data: Partial<SessionRecord>): Promise<SessionRecord> {
    return pb.collection('sessions').update<SessionRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('sessions').delete(id)
  },
}

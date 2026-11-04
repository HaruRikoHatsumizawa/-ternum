import pb from '@/lib/pocketbase/client'

export type CampaignEventCategory =
  | 'batalha'
  | 'politica'
  | 'descoberta'
  | 'sessao'
  | 'morte'
  | 'aliados'
  | 'marco'

export type TargetMode = 'geral' | 'rpg' | 'rp'

export interface CampaignEventRecord {
  id: string
  user: string
  title: string
  campaign: string
  date: string
  description?: string
  category?: CampaignEventCategory
  session_id?: string
  target_mode?: TargetMode
  created: string
  updated: string
}

export interface CreateCampaignEventData {
  title: string
  campaign: string
  date: string
  description?: string
  category?: CampaignEventCategory
  session_id?: string
  target_mode?: TargetMode
}

export const timelineService = {
  async list(campaign?: string): Promise<CampaignEventRecord[]> {
    const options: Record<string, any> = {
      sort: '-date,-created',
    }

    if (campaign && campaign !== 'ALL') {
      // Escape de aspas simples
      const safeCampaign = campaign.replace(/'/g, "\\'")
      options.filter = `campaign = '${safeCampaign}'`
    }

    try {
      const records = await pb
        .collection('campaign_events')
        .getFullList<CampaignEventRecord>(options)
      return records
    } catch (err) {
      console.warn('Falha ao listar eventos da timeline:', err)
      return []
    }
  },

  async create(data: CreateCampaignEventData): Promise<CampaignEventRecord> {
    const userId = pb.authStore.record?.id
    if (!userId) throw new Error('Usuário não autenticado')

    return pb.collection('campaign_events').create<CampaignEventRecord>({
      ...data,
      user: userId,
      target_mode: data.target_mode || 'geral',
      category: data.category || 'marco',
    })
  },

  async update(id: string, data: Partial<CreateCampaignEventData>): Promise<CampaignEventRecord> {
    return pb.collection('campaign_events').update<CampaignEventRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('campaign_events').delete(id)
  },

  /**
   * Sincroniza crônicas/notas das sessões já existentes como eventos de timeline (idempotente)
   */
  async syncFromSessions(): Promise<number> {
    const userId = pb.authStore.record?.id
    if (!userId) return 0

    try {
      // Busca todas as sessões do usuário que possuem título e anotações/resumo
      const sessions = await pb.collection('sessions').getFullList<{
        id: string
        title: string
        campaign: string
        date: string
        notes?: string
        target_mode?: TargetMode
      }>()

      // Busca eventos existentes já vinculados a sessões
      const existingEvents = await pb
        .collection('campaign_events')
        .getFullList<CampaignEventRecord>({
          filter: 'session_id != ""',
        })
      const linkedSessionIds = new Set(existingEvents.map((e) => e.session_id))

      let createdCount = 0
      for (const s of sessions) {
        if (!linkedSessionIds.has(s.id) && (s.notes || s.title)) {
          const dateStr = s.date
            ? s.date.split(' ')[0].split('T')[0]
            : new Date().toISOString().split('T')[0]
          await pb.collection('campaign_events').create({
            user: userId,
            title: s.title,
            campaign: s.campaign || 'Crônicas do Éternum',
            date: dateStr,
            description: s.notes || 'Crônica da sessão de jogo.',
            category: 'sessao',
            session_id: s.id,
            target_mode: s.target_mode || 'geral',
          })
          createdCount++
        }
      }
      return createdCount
    } catch (err) {
      console.warn('Erro ao sincronizar eventos das sessões:', err)
      return 0
    }
  },
}

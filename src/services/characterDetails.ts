import pb from '@/lib/pocketbase/client'

export interface CharacterPowerItem {
  id: string
  name: string
  description: string
  type?: string
}

export interface CharacterAbilityItem {
  id: string
  name: string
  description: string
  category?: string
}

export interface AiCustomSheetData {
  format: 'rp' | 'rpg'
  title: string
  content: string
  generated_at: string
  runic_theme?: string
}

export interface CharacterDetailRecord {
  id: string
  user: string
  character_id: string
  name: string
  age?: string
  sexuality?: string
  pronouns?: string
  race?: string
  species?: string
  backstory?: string
  photo?: string
  powers?: CharacterPowerItem[]
  abilities?: CharacterAbilityItem[]
  bonds?: string
  rp_summary?: string
  rpg_summary?: string
  ai_custom_sheet?: AiCustomSheetData | null
  created: string
  updated: string
}

export interface UpsertCharacterDetailData {
  character_id: string
  name: string
  age?: string
  sexuality?: string
  pronouns?: string
  race?: string
  species?: string
  backstory?: string
  photo?: File | null
  removePhoto?: boolean
  powers?: CharacterPowerItem[]
  abilities?: CharacterAbilityItem[]
  bonds?: string
  rp_summary?: string
  rpg_summary?: string
  ai_custom_sheet?: AiCustomSheetData | null
}

export const characterDetailsService = {
  /**
   * Obtém os detalhes específicos de um personagem pelo character_id (ID da coleção npcs)
   */
  async getByCharacterId(characterId: string): Promise<CharacterDetailRecord | null> {
    try {
      const records = await pb
        .collection('character_details')
        .getList<CharacterDetailRecord>(1, 1, {
          filter: `character_id = '${characterId}'`,
        })
      return records.items[0] || null
    } catch (err) {
      console.warn('Falha ao buscar detalhes do personagem:', err)
      return null
    }
  },

  /**
   * Salva ou atualiza os detalhes de um personagem (upsert com suporte a upload de foto multipart)
   */
  async upsert(data: UpsertCharacterDetailData): Promise<CharacterDetailRecord> {
    const userId = pb.authStore.record?.id
    if (!userId) throw new Error('Usuário não autenticado')

    const existing = await this.getByCharacterId(data.character_id)

    const formData = new FormData()
    formData.append('user', userId)
    formData.append('character_id', data.character_id)
    formData.append('name', data.name)
    if (data.age !== undefined) formData.append('age', data.age)
    if (data.sexuality !== undefined) formData.append('sexuality', data.sexuality)
    if (data.pronouns !== undefined) formData.append('pronouns', data.pronouns)
    if (data.race !== undefined) formData.append('race', data.race)
    if (data.species !== undefined) formData.append('species', data.species)
    if (data.backstory !== undefined) formData.append('backstory', data.backstory)
    if (data.bonds !== undefined) formData.append('bonds', data.bonds)
    if (data.rp_summary !== undefined) formData.append('rp_summary', data.rp_summary)
    if (data.rpg_summary !== undefined) formData.append('rpg_summary', data.rpg_summary)

    if (data.powers !== undefined) {
      formData.append('powers', JSON.stringify(data.powers))
    }
    if (data.abilities !== undefined) {
      formData.append('abilities', JSON.stringify(data.abilities))
    }
    if (data.ai_custom_sheet !== undefined) {
      formData.append(
        'ai_custom_sheet',
        data.ai_custom_sheet ? JSON.stringify(data.ai_custom_sheet) : '',
      )
    }

    if (data.removePhoto) {
      formData.append('photo', '')
    } else if (data.photo) {
      formData.append('photo', data.photo)
    }

    if (existing) {
      return pb.collection('character_details').update<CharacterDetailRecord>(existing.id, formData)
    } else {
      return pb.collection('character_details').create<CharacterDetailRecord>(formData)
    }
  },

  /**
   * Consulta o Oráculo nativo para gerar resumo ou ficha personalizada
   */
  async generateWithOracle(params: {
    type: 'rp_summary' | 'rpg_summary' | 'custom_sheet'
    sheet_format?: 'rp' | 'rpg'
    character: Record<string, any>
    locale?: 'pt-BR' | 'en'
  }): Promise<{ content: string; format?: string; type: string }> {
    const res = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/oracle/character-generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: pb.authStore.token,
        },
        body: JSON.stringify(params),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'O Oráculo não pôde gerar as informações do personagem.')
    }

    return data
  },
}

interface MapleStoryCharacterData {
  characterID: number
  characterName: string
  exp: number
  gap: number
  jobDetail: number
  jobID: number
  level: number
  rank: number
  startRank: number
  worldID: number
  characterImgURL: string
  isSearchTarget: boolean
  legionLevel: number
  raidPower: number
  tierID: number
  score: number
}

interface MapleStoryAPIResponse {
  totalCount: number
  ranks: MapleStoryCharacterData[]
}

export class MapleStoryAPIService {
  private readonly BASE_URL = 'https://www.nexon.com/api/maplestory/no-auth/ranking/v2/eu'
  private readonly REBOOT_INDEX = 2 // Luna server

  async getCharacterData(characterName: string): Promise<MapleStoryCharacterData | null> {
    try {
      const url = `${this.BASE_URL}?type=overall&id=weekly&reboot_index=${this.REBOOT_INDEX}&page_index=1&character_name=${encodeURIComponent(characterName)}`
      
      console.log(`🔍 Fetching data for character: ${characterName}`)
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: MapleStoryAPIResponse = await response.json()
      
      if (data.totalCount === 0 || data.ranks.length === 0) {
        console.log(`❌ Character ${characterName} not found in rankings`)
        return null
      }

      const character = data.ranks[0]
      console.log(`✅ Found character ${characterName}: Level ${character.level}, EXP: ${character.exp}`)
      
      return character
    } catch (error) {
      console.error(`❌ Error fetching data for ${characterName}:`, error)
      return null
    }
  }

  async getAllCharactersData(characterNames: string[]): Promise<MapleStoryCharacterData[]> {
    const results: MapleStoryCharacterData[] = []
    
    // Process characters in batches to avoid rate limiting
    const batchSize = 5
    for (let i = 0; i < characterNames.length; i += batchSize) {
      const batch = characterNames.slice(i, i + batchSize)
      
      const promises = batch.map(async (name) => {
        const data = await this.getCharacterData(name)
        if (data) {
          results.push(data)
        }
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      })
      
      await Promise.all(promises)
      
      // Delay between batches
      if (i + batchSize < characterNames.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    return results
  }
}

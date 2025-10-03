import { PrismaClient } from '@prisma/client'
import { MapleStoryAPIService } from './MapleStoryAPIService'

const prisma = new PrismaClient()

interface CharacterProgressionData {
  characterId: string
  level: number
  experience: number
  rank: number
  legionLevel: number
  raidPower: number
  lastUpdated: Date
}

export class CharacterProgressionService {
  private mapleStoryAPI: MapleStoryAPIService

  constructor() {
    this.mapleStoryAPI = new MapleStoryAPIService()
  }

  async updateAllCharactersProgression(): Promise<void> {
    try {
      console.log('🔄 Starting daily character progression update...')
      
      // Get all characters from database
      const characters = await prisma.character.findMany({
        select: {
          id: true,
          name: true,
          level: true,
          experience: true
        }
      })

      if (characters.length === 0) {
        console.log('ℹ️ No characters found to update')
        return
      }

      console.log(`📊 Found ${characters.length} characters to update`)

      // Get character names for API calls
      const characterNames = characters.map(char => char.name)
      
      // Fetch data from MapleStory API
      const apiData = await this.mapleStoryAPI.getAllCharactersData(characterNames)
      
      if (apiData.length === 0) {
        console.log('❌ No character data received from API')
        return
      }

      // Update each character
      for (const apiCharacter of apiData) {
        const dbCharacter = characters.find(char => 
          char.name.toLowerCase() === apiCharacter.characterName.toLowerCase()
        )

        if (!dbCharacter) {
          console.log(`⚠️ Character ${apiCharacter.characterName} not found in database`)
          continue
        }

        await this.updateCharacterProgression(dbCharacter.id, apiCharacter)
      }

      console.log('✅ Daily character progression update completed')
    } catch (error) {
      console.error('❌ Error updating character progression:', error)
      throw error
    }
  }

  private async updateCharacterProgression(characterId: string, apiData: any): Promise<void> {
    try {
      // Get current character data
      const currentCharacter = await prisma.character.findUnique({
        where: { id: characterId }
      })

      if (!currentCharacter) {
        console.log(`⚠️ Character ${characterId} not found`)
        return
      }

      // Check if there are any changes
      const levelChanged = currentCharacter.level !== apiData.level
      const expChanged = currentCharacter.experience !== BigInt(apiData.exp)
      const avatarChanged = currentCharacter.avatar !== apiData.characterImgURL
      
      if (!levelChanged && !expChanged && !avatarChanged) {
        console.log(`ℹ️ No changes for character ${apiData.characterName}`)
        return
      }

      // Create progression history entry
      await prisma.characterProgression.create({
        data: {
          characterId: characterId,
          level: apiData.level,
          experience: BigInt(apiData.exp),
          rank: apiData.rank,
          legionLevel: apiData.legionLevel,
          raidPower: apiData.raidPower,
          lastUpdated: new Date()
        }
      })

      // Update character with new data
      await prisma.character.update({
        where: { id: characterId },
        data: {
          level: apiData.level,
          experience: BigInt(apiData.exp),
          avatar: apiData.characterImgURL,
          updatedAt: new Date()
        }
      })

      const changes = []
      if (levelChanged) changes.push(`Level ${currentCharacter.level} → ${apiData.level}`)
      if (expChanged) changes.push(`EXP: ${currentCharacter.experience?.toLocaleString()} → ${apiData.exp.toLocaleString()}`)
      if (avatarChanged) changes.push('Avatar updated')
      
      console.log(`✅ Updated ${apiData.characterName}: ${changes.join(', ')}`)
    } catch (error) {
      console.error(`❌ Error updating character ${characterId}:`, error)
      throw error
    }
  }

  async getCharacterProgressionHistory(characterId: string, days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const history = await prisma.characterProgression.findMany({
        where: {
          characterId: characterId,
          lastUpdated: {
            gte: startDate
          }
        },
        orderBy: {
          lastUpdated: 'asc'
        }
      })

      return history
    } catch (error) {
      console.error('❌ Error fetching character progression history:', error)
      throw error
    }
  }

  async getProgressionStats(characterId: string): Promise<any> {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId }
      })

      if (!character) {
        throw new Error('Character not found')
      }

      // Get progression over last 30 days
      const history = await this.getCharacterProgressionHistory(characterId, 30)
      
      if (history.length === 0) {
        return {
          characterName: character.name,
          currentLevel: character.level,
          currentExperience: character.experience,
          levelGained: 0,
          experienceGained: 0,
          daysTracked: 0
        }
      }

      const firstEntry = history[0]
      const lastEntry = history[history.length - 1]
      
      const levelGained = lastEntry.level - firstEntry.level
      const experienceGained = Number(lastEntry.experience - firstEntry.experience)
      const daysTracked = Math.ceil((lastEntry.lastUpdated.getTime() - firstEntry.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))

      return {
        characterName: character.name,
        currentLevel: character.level,
        currentExperience: character.experience ? Number(character.experience) : 0,
        levelGained,
        experienceGained,
        daysTracked,
        averageExpPerDay: daysTracked > 0 ? Math.round(experienceGained / daysTracked) : 0
      }
    } catch (error) {
      console.error('❌ Error calculating progression stats:', error)
      throw error
    }
  }
}

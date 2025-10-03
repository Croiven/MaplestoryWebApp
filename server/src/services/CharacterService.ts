import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CharacterData {
  name: string
  level: number
  job: string
  world: string
  discordUserId: string
  stats: {
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
  }
}

export class CharacterService {
  async getAllCharacters(discordUserId: string) {
    try {
      const whereClause = discordUserId ? { discordUserId } : {}
      const characters = await prisma.character.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      })
      return characters
    } catch (error) {
      console.error('Error fetching characters:', error)
      throw error
    }
  }

  async getCharacterById(id: string) {
    try {
      const character = await prisma.character.findFirst({
        where: { id }
      })
      return character
    } catch (error) {
      console.error('Error fetching character:', error)
      throw error
    }
  }

  async createCharacter(data: CharacterData) {
    try {
      const character = await prisma.character.create({
        data: {
          name: data.name,
          level: data.level,
          job: data.job,
          world: data.world,
          discordUserId: data.discordUserId,
          stats: data.stats
        }
      })
      return character
    } catch (error) {
      console.error('Error creating character:', error)
      throw error
    }
  }

  async updateCharacter(id: string, data: Partial<CharacterData>, discordUserId: string) {
    try {
      const character = await prisma.character.updateMany({
        where: { 
          id,
          discordUserId 
        },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.level && { level: data.level }),
          ...(data.job && { job: data.job }),
          ...(data.world && { world: data.world }),
          ...(data.stats && { stats: data.stats }),
          updatedAt: new Date()
        }
      })

      if (character.count === 0) {
        return null
      }

      return await this.getCharacterById(id)
    } catch (error) {
      console.error('Error updating character:', error)
      throw error
    }
  }

  async deleteCharacter(id: string, discordUserId: string) {
    try {
      const result = await prisma.character.deleteMany({
        where: { 
          id,
          discordUserId 
        }
      })
      return result.count > 0
    } catch (error) {
      console.error('Error deleting character:', error)
      throw error
    }
  }
}

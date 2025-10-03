import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CharacterData {
  name: string
  level: number
  job: string
  world: string
  userId: string
  stats: {
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
  }
  equipment?: {
    weapon?: string
    armor?: string
    accessories?: string[]
  }
}

export class CharacterService {
  async getAllCharacters(userId: string) {
    try {
      const characters = await prisma.character.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      return characters
    } catch (error) {
      console.error('Error fetching characters:', error)
      throw error
    }
  }

  async getCharacterById(id: string, userId: string) {
    try {
      const character = await prisma.character.findFirst({
        where: { 
          id,
          userId 
        }
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
          userId: data.userId,
          stats: data.stats,
          equipment: data.equipment || {}
        }
      })
      return character
    } catch (error) {
      console.error('Error creating character:', error)
      throw error
    }
  }

  async updateCharacter(id: string, data: Partial<CharacterData>, userId: string) {
    try {
      const character = await prisma.character.updateMany({
        where: { 
          id,
          userId 
        },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.level && { level: data.level }),
          ...(data.job && { job: data.job }),
          ...(data.world && { world: data.world }),
          ...(data.stats && { stats: data.stats }),
          ...(data.equipment && { equipment: data.equipment }),
          updatedAt: new Date()
        }
      })

      if (character.count === 0) {
        return null
      }

      return await this.getCharacterById(id, userId)
    } catch (error) {
      console.error('Error updating character:', error)
      throw error
    }
  }

  async deleteCharacter(id: string, userId: string) {
    try {
      const result = await prisma.character.deleteMany({
        where: { 
          id,
          userId 
        }
      })
      return result.count > 0
    } catch (error) {
      console.error('Error deleting character:', error)
      throw error
    }
  }
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  avatar?: string | null
  experience?: number | null
  main: boolean
  stats: any // Character stats object with all MapleStory stats
  createdAt: Date
  updatedAt: Date
  discordUserId: string
}

export interface CreateCharacterData {
  name: string
  level: number
  job: string
  world: string
  avatar?: string | null
  experience?: number | null
  main?: boolean
  stats: any
  discordUserId: string
}

export class CharacterService {
  async getAllCharacters(): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        orderBy: { createdAt: 'desc' },
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error fetching characters:', error)
      throw new Error('Failed to fetch characters')
    }
  }

  async getCharacterById(id: string): Promise<Character | null> {
    try {
      const character = await prisma.character.findUnique({
        where: { id },
        include: { discordUser: true }
      })
      return character ? {
        ...character,
        discordUserId: character.discordUserId,
        main: character.main
      } : null
    } catch (error) {
      console.error('Error fetching character by ID:', error)
      throw new Error('Failed to fetch character')
    }
  }

  async getCharactersByDiscordUser(discordUserId: string): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        where: { discordUserId },
        orderBy: { createdAt: 'desc' },
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error fetching characters by Discord user:', error)
      throw new Error('Failed to fetch user characters')
    }
  }

  async searchCharactersByName(name: string): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' },
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error searching characters by name:', error)
      throw new Error('Failed to search characters')
    }
  }

  async getCharactersByWorld(world: string): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        where: {
          world: {
            contains: world,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' },
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error fetching characters by world:', error)
      throw new Error('Failed to fetch characters by world')
    }
  }

  async getCharactersByJob(job: string): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        where: {
          job: {
            contains: job,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' },
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error fetching characters by job:', error)
      throw new Error('Failed to fetch characters by job')
    }
  }

  async getTopCharacters(limit: number = 10): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        orderBy: { level: 'desc' },
        take: limit,
        include: { discordUser: true }
      })
      return characters.map(char => ({
        ...char,
        discordUserId: char.discordUserId,
        main: char.main
      }))
    } catch (error) {
      console.error('Error fetching top characters:', error)
      throw new Error('Failed to fetch top characters')
    }
  }

  async createCharacter(characterData: CreateCharacterData): Promise<Character> {
    try {
      const character = await prisma.character.create({
        data: characterData,
        include: { discordUser: true }
      })
      return {
        ...character,
        discordUserId: character.discordUserId,
        main: character.main
      }
    } catch (error) {
      console.error('Error creating character:', error)
      throw new Error('Failed to create character')
    }
  }

  async updateCharacter(id: string, characterData: Partial<CreateCharacterData>): Promise<Character | null> {
    try {
      // Get current character data for history
      const currentCharacter = await prisma.character.findUnique({
        where: { id }
      })

      if (!currentCharacter) {
        return null
      }

      // Create history entry before updating
      await prisma.characterHistory.create({
        data: {
          characterId: id,
          level: currentCharacter.level,
          job: currentCharacter.job,
          world: currentCharacter.world,
          avatar: currentCharacter.avatar,
          experience: currentCharacter.experience,
          stats: currentCharacter.stats as any
        }
      })

      // Update the character
      const character = await prisma.character.update({
        where: { id },
        data: characterData,
        include: { discordUser: true }
      })
      return {
        ...character,
        discordUserId: character.discordUserId,
        main: character.main
      }
    } catch (error) {
      console.error('Error updating character:', error)
      throw new Error('Failed to update character')
    }
  }

  async getCharacterHistory(characterId: string): Promise<any[]> {
    try {
      const history = await prisma.characterHistory.findMany({
        where: { characterId },
        orderBy: { createdAt: 'desc' }
      })
      return history
    } catch (error) {
      console.error('Error fetching character history:', error)
      throw new Error('Failed to fetch character history')
    }
  }

  async deleteCharacter(id: string): Promise<boolean> {
    try {
      await prisma.character.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error('Error deleting character:', error)
      throw new Error('Failed to delete character')
    }
  }

  async disconnect() {
    await prisma.$disconnect()
  }
}
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Character {
  id: string
  name: string
  level: number
  job: string
  world: string
  stats: {
    str: number
    dex: number
    int: number
    luk: number
    hp: number
    mp: number
  }
  createdAt: Date
  updatedAt: Date
}

export class CharacterService {
  async getAllCharacters(): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return characters.map(char => ({
        ...char,
        stats: char.stats as Character['stats']
      }))
    } catch (error) {
      console.error('Error fetching characters:', error)
      throw error
    }
  }

  async getCharacterById(id: string): Promise<Character | null> {
    try {
      const character = await prisma.character.findUnique({
        where: { id }
      })
      return character ? {
        ...character,
        stats: character.stats as Character['stats']
      } : null
    } catch (error) {
      console.error('Error fetching character by ID:', error)
      throw error
    }
  }

  async getCharacterByName(name: string): Promise<Character | null> {
    try {
      const character = await prisma.character.findFirst({
        where: { 
          name: {
            contains: name,
            mode: 'insensitive'
          }
        }
      })
      return character ? {
        ...character,
        stats: character.stats as Character['stats']
      } : null
    } catch (error) {
      console.error('Error fetching character by name:', error)
      throw error
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
        orderBy: { level: 'desc' }
      })
      return characters.map(char => ({
        ...char,
        stats: char.stats as Character['stats']
      }))
    } catch (error) {
      console.error('Error fetching characters by world:', error)
      throw error
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
        orderBy: { level: 'desc' }
      })
      return characters.map(char => ({
        ...char,
        stats: char.stats as Character['stats']
      }))
    } catch (error) {
      console.error('Error fetching characters by job:', error)
      throw error
    }
  }

  async getTopCharacters(limit: number = 10): Promise<Character[]> {
    try {
      const characters = await prisma.character.findMany({
        orderBy: { level: 'desc' },
        take: limit
      })
      return characters.map(char => ({
        ...char,
        stats: char.stats as Character['stats']
      }))
    } catch (error) {
      console.error('Error fetching top characters:', error)
      throw error
    }
  }
}

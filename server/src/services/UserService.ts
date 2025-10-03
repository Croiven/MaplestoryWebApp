import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface DiscordUser {
  id: string
  discordId: string
  username: string
  discriminator: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  async getAllUsers(): Promise<DiscordUser[]> {
    try {
      const users = await prisma.discordUser.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async getUserById(id: string): Promise<DiscordUser | null> {
    try {
      const user = await prisma.discordUser.findUnique({
        where: { id }
      })
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  async getUserCharacters(userId: string) {
    try {
      const characters = await prisma.character.findMany({
        where: { discordUserId: userId },
        orderBy: { createdAt: 'desc' }
      })
      return characters
    } catch (error) {
      console.error('Error fetching user characters:', error)
      throw error
    }
  }
}

import { PrismaClient } from '@prisma/client'

export interface CreateDiscordUserData {
  discordId: string
  username: string
  discriminator?: string
  avatar?: string
}

export class UserService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getDiscordUserByDiscordId(discordId: string) {
    return await this.prisma.discordUser.findUnique({
      where: { discordId }
    })
  }

  async createDiscordUser(discordUserData: CreateDiscordUserData) {
    return await this.prisma.discordUser.create({
      data: discordUserData
    })
  }

  async registerDiscordUser(discordId: string, username: string, discriminator?: string, avatar?: string) {
    // Check if Discord user already exists
    const existingDiscordUser = await this.getDiscordUserByDiscordId(discordId)
    if (existingDiscordUser) {
      return { 
        success: false, 
        message: 'User already registered!',
        user: existingDiscordUser
      }
    }

    // Create the Discord user
    const discordUser = await this.createDiscordUser({
      discordId,
      username,
      discriminator,
      avatar
    })

    return {
      success: true,
      message: 'User registered successfully!',
      user: discordUser
    }
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}
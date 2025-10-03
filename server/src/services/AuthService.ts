import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateUserData {
  username: string
  email: string
  password: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
  private readonly JWT_EXPIRES_IN = '15m'
  private readonly JWT_REFRESH_EXPIRES_IN = '7d'

  async createUser(data: CreateUserData) {
    try {
      const hashedPassword = await this.hashPassword(data.password)
      
      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword
        }
      })

      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      return user
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async findUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })
      return user
    } catch (error) {
      console.error('Error finding user by ID:', error)
      throw error
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async generateTokens(userId: string): Promise<TokenPair> {
    const accessToken = jwt.sign(
      { userId },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )

    const refreshToken = jwt.sign(
      { userId },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.JWT_REFRESH_EXPIRES_IN }
    )

    return { accessToken, refreshToken }
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { userId: string }
      
      // Verify user still exists
      const user = await this.findUserById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Generate new tokens
      return this.generateTokens(decoded.userId)
    } catch (error) {
      console.error('Error refreshing tokens:', error)
      throw new Error('Invalid refresh token')
    }
  }
}

import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'

export class AuthController {
  private authService = new AuthService()

  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body

      // Check if user already exists
      const existingUser = await this.authService.findUserByEmail(email)
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' })
      }

      // Create user
      const user = await this.authService.createUser({ username, email, password })
      
      // Generate tokens
      const { accessToken, refreshToken } = await this.authService.generateTokens(user.id)

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        accessToken,
        refreshToken
      })
    } catch (error) {
      console.error('Error during registration:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await this.authService.findUserByEmail(email)
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValidPassword = await this.authService.verifyPassword(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.authService.generateTokens(user.id)

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        accessToken,
        refreshToken
      })
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // In a real app, you might want to blacklist the token
      res.json({ message: 'Logout successful' })
    } catch (error) {
      console.error('Error during logout:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const user = await this.authService.findUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      })
    } catch (error) {
      console.error('Error fetching current user:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' })
      }

      const { accessToken, newRefreshToken } = await this.authService.refreshTokens(refreshToken)
      
      res.json({
        accessToken,
        refreshToken: newRefreshToken
      })
    } catch (error) {
      console.error('Error refreshing token:', error)
      res.status(401).json({ error: 'Invalid refresh token' })
    }
  }
}

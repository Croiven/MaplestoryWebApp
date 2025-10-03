import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
  private userService = new UserService()

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers()
      res.json({ users })
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const user = await this.userService.getUserById(id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ user })
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  getUserCharacters = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const characters = await this.userService.getUserCharacters(id)
      
      // Convert BigInt values to strings for JSON serialization
      const serializedCharacters = characters.map(char => ({
        ...char,
        experience: char.experience ? char.experience.toString() : null
      }))
      
      res.json({ characters: serializedCharacters })
    } catch (error) {
      console.error('Error fetching user characters:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

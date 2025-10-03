import { Request, Response } from 'express'
import { CharacterService } from '../services/CharacterService'

export class CharacterController {
  private characterService = new CharacterService()

  async getAllCharacters(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const characters = await this.characterService.getAllCharacters(userId)
      res.json({ characters })
    } catch (error) {
      console.error('Error fetching characters:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getCharacterById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const character = await this.characterService.getCharacterById(id, userId)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }

      res.json({ character })
    } catch (error) {
      console.error('Error fetching character:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async createCharacter(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const characterData = {
        ...req.body,
        userId
      }

      const character = await this.characterService.createCharacter(characterData)
      res.status(201).json({ character })
    } catch (error) {
      console.error('Error creating character:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async updateCharacter(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const character = await this.characterService.updateCharacter(id, req.body, userId)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }

      res.json({ character })
    } catch (error) {
      console.error('Error updating character:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async deleteCharacter(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const success = await this.characterService.deleteCharacter(id, userId)
      if (!success) {
        return res.status(404).json({ error: 'Character not found' })
      }

      res.json({ message: 'Character deleted successfully' })
    } catch (error) {
      console.error('Error deleting character:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

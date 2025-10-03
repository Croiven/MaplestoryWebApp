import { Request, Response } from 'express'
import { CharacterProgressionService } from '../services/CharacterProgressionService'

export class ProgressionController {
  private progressionService = new CharacterProgressionService()

  getCharacterProgression = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { days = '30' } = req.query
      
      const daysNumber = parseInt(days as string, 10)
      if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
        return res.status(400).json({ error: 'Days must be between 1 and 365' })
      }

      const progression = await this.progressionService.getCharacterProgressionHistory(id, daysNumber)
      
      // Convert BigInt values to strings for JSON serialization
      const serializedProgression = progression.map(entry => ({
        ...entry,
        experience: entry.experience.toString()
      }))
      
      res.json({ progression: serializedProgression })
    } catch (error) {
      console.error('Error fetching character progression:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  getCharacterProgressionStats = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const stats = await this.progressionService.getProgressionStats(id)
      res.json({ stats })
    } catch (error) {
      console.error('Error fetching character progression stats:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  triggerUpdate = async (req: Request, res: Response) => {
    try {
      // This would typically require admin authentication
      await this.progressionService.updateAllCharactersProgression()
      res.json({ message: 'Character progression update triggered successfully' })
    } catch (error) {
      console.error('Error triggering progression update:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

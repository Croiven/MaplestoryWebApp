import { Request, Response } from 'express'
import { CharacterService } from '../services/CharacterService'

export class CharacterController {
  private characterService = new CharacterService()

  getAllCharacters = async (req: Request, res: Response) => {
    try {
      // Get all characters (public access)
      const characters = await this.characterService.getAllCharacters('')
      
      // Convert BigInt values to strings for JSON serialization
      const serializedCharacters = characters.map(char => ({
        ...char,
        experience: char.experience ? char.experience.toString() : null
      }))
      
      res.json({ characters: serializedCharacters })
    } catch (error) {
      console.error('Error fetching characters:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  getCharacterById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      // Get character by ID (public access)
      const character = await this.characterService.getCharacterById(id)
      if (!character) {
        return res.status(404).json({ error: 'Character not found' })
      }

      // Convert BigInt values to strings for JSON serialization
      const serializedCharacter = {
        ...character,
        experience: character.experience ? character.experience.toString() : null
      }

      res.json({ character: serializedCharacter })
    } catch (error) {
      console.error('Error fetching character:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

}

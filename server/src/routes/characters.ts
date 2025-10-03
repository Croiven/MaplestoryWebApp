import { Router } from 'express'
import { CharacterController } from '../controllers/CharacterController'

const router = Router()
const characterController = new CharacterController()

// Get all characters (public access - no authentication required)
router.get('/', characterController.getAllCharacters)

// Get character by ID (public access - no authentication required)
router.get('/:id', characterController.getCharacterById)

export { router as characterRoutes }

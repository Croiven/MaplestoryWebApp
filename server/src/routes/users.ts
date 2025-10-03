import { Router } from 'express'
import { UserController } from '../controllers/UserController'

const router = Router()
const userController = new UserController()

// Get all users (public access)
router.get('/', userController.getAllUsers)

// Get user by ID (public access)
router.get('/:id', userController.getUserById)

// Get user's characters (public access)
router.get('/:id/characters', userController.getUserCharacters)

export { router as userRoutes }

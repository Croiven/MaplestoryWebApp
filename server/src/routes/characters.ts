import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { CharacterController } from '../controllers/CharacterController'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const characterController = new CharacterController()

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Get all characters
router.get('/', authenticateToken, characterController.getAllCharacters)

// Get character by ID
router.get('/:id', 
  authenticateToken,
  param('id').isUUID().withMessage('Invalid character ID'),
  validateRequest,
  characterController.getCharacterById
)

// Create new character
router.post('/',
  authenticateToken,
  [
    body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name must be between 1-50 characters'),
    body('level').isInt({ min: 1, max: 300 }).withMessage('Level must be between 1-300'),
    body('job').trim().isLength({ min: 1, max: 50 }).withMessage('Job is required'),
    body('world').trim().isLength({ min: 1, max: 50 }).withMessage('World is required'),
    body('stats.str').isInt({ min: 0 }).withMessage('STR must be non-negative'),
    body('stats.dex').isInt({ min: 0 }).withMessage('DEX must be non-negative'),
    body('stats.int').isInt({ min: 0 }).withMessage('INT must be non-negative'),
    body('stats.luk').isInt({ min: 0 }).withMessage('LUK must be non-negative'),
    body('stats.hp').isInt({ min: 1 }).withMessage('HP must be positive'),
    body('stats.mp').isInt({ min: 1 }).withMessage('MP must be positive')
  ],
  validateRequest,
  characterController.createCharacter
)

// Update character
router.put('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('Invalid character ID'),
  [
    body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Name must be between 1-50 characters'),
    body('level').optional().isInt({ min: 1, max: 300 }).withMessage('Level must be between 1-300'),
    body('job').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Job is required'),
    body('world').optional().trim().isLength({ min: 1, max: 50 }).withMessage('World is required')
  ],
  validateRequest,
  characterController.updateCharacter
)

// Delete character
router.delete('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('Invalid character ID'),
  validateRequest,
  characterController.deleteCharacter
)

export { router as characterRoutes }

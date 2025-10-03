import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthController } from '../controllers/AuthController'

const router = Router()
const authController = new AuthController()

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Register
router.post('/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  authController.register
)

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login
)

// Logout
router.post('/logout', authController.logout)

// Get current user
router.get('/me', authController.getCurrentUser)

// Refresh token
router.post('/refresh', authController.refreshToken)

export { router as authRoutes }

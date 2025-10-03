import { Router } from 'express'
import { ProgressionController } from '../controllers/ProgressionController'

const router = Router()
const progressionController = new ProgressionController()

// Get character progression history
router.get('/characters/:id/progression', progressionController.getCharacterProgression)

// Get character progression stats
router.get('/characters/:id/progression/stats', progressionController.getCharacterProgressionStats)

// Trigger manual update (for testing)
router.post('/progression/update', progressionController.triggerUpdate)

export { router as progressionRoutes }

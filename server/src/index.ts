import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { characterRoutes } from './routes/characters'
import { userRoutes } from './routes/users'
import { progressionRoutes } from './routes/progression'
import { authRoutes } from './routes/auth'
import { SchedulerService } from './services/SchedulerService'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Logging
app.use(morgan('combined'))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/users', userRoutes)
app.use('/api', progressionRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start the scheduler
const scheduler = new SchedulerService()
scheduler.start()

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔄 Character progression tracking enabled`)
})

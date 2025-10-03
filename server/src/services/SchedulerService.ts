import { CharacterProgressionService } from './CharacterProgressionService'

export class SchedulerService {
  private progressionService: CharacterProgressionService
  private isRunning: boolean = false

  constructor() {
    this.progressionService = new CharacterProgressionService()
  }

  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Scheduler is already running')
      return
    }

    this.isRunning = true
    console.log('🚀 Starting MapleStory progression scheduler...')

    // Run immediately on startup
    this.runDailyUpdate()

    // Schedule daily updates at 5 PM UTC (1 hour after MapleStory API updates at 4 PM UTC)
    this.scheduleDailyUpdate()
  }

  stop(): void {
    this.isRunning = false
    console.log('🛑 Stopping MapleStory progression scheduler...')
  }

  private scheduleDailyUpdate(): void {
    const now = new Date()
    const nextUpdate = new Date(now)
    nextUpdate.setUTCHours(17, 0, 0, 0) // 5 PM UTC
    
    // If it's already past 5 PM today, schedule for tomorrow
    if (now.getUTCHours() >= 17) {
      nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1)
    }

    const timeUntilUpdate = nextUpdate.getTime() - now.getTime()
    
    console.log(`⏰ Next daily update scheduled for: ${nextUpdate.toISOString()}`)
    
    setTimeout(() => {
      this.runDailyUpdate()
      // Schedule the next update
      this.scheduleDailyUpdate()
    }, timeUntilUpdate)
  }

  private async runDailyUpdate(): Promise<void> {
    if (!this.isRunning) {
      return
    }

    try {
      console.log('🔄 Running scheduled daily character progression update...')
      await this.progressionService.updateAllCharactersProgression()
      console.log('✅ Daily update completed successfully')
    } catch (error) {
      console.error('❌ Daily update failed:', error)
    }
  }

  // Manual trigger for testing
  async triggerManualUpdate(): Promise<void> {
    console.log('🔄 Triggering manual character progression update...')
    await this.progressionService.updateAllCharactersProgression()
  }
}

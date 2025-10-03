import { GeminiVisionOCRService } from './GeminiVisionOCRService'

export interface ExtractedStats {
  name?: string
  job?: string
  level?: number
  world?: string
  confidence?: number
  stats: {
    // Basic Stats
    str?: number
    dex?: number
    int?: number
    luk?: number
    hp?: number
    mp?: number
    
    // Combat Power
    combatPower?: number
    
    // Damage Stats
    damageRange?: number
    finalDamage?: number
    ignoreDefense?: number
    attackPower?: number
    magicAttack?: number
    
    // Cooldown Stats
    cooldownReduction?: string
    cooldownNotApplied?: number
    
    // Status & Buff Stats
    additionalStatusDamage?: number
    damage?: number
    bossDamage?: number
    normalEnemyDamage?: number
    criticalRate?: number
    criticalDamage?: number
    buffDuration?: number
    ignoreElementalResistance?: number
    summonsDurationIncrease?: number
    
    // Utility Stats
    mesosObtained?: number
    itemDropRate?: number
    additionalExpObtained?: number
    
    // Power Stats
    starForce?: number
    arcanePower?: number
    sacredPower?: number
    
    // Social Stats
    legion?: number
    muLungDojo?: string
    fame?: number
  }
}

export class OCRService {
  private geminiVisionService: GeminiVisionOCRService

  constructor() {
    try {
      console.log('🔧 Initializing OCR Service with Gemini Vision...')
      this.geminiVisionService = new GeminiVisionOCRService()
      console.log('✅ Gemini Vision OCR Service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Gemini Vision service:', error)
      throw new Error('Gemini Vision service is required for OCR functionality')
    }
  }

  async extractStatsFromImage(imageUrl: string): Promise<ExtractedStats> {
    try {
      console.log('🔍 Starting Gemini Vision analysis...')
      
      // Use Gemini Vision (primary and only method)
      const result = await this.geminiVisionService.extractStatsFromImage(imageUrl)
      
      console.log(`✅ Gemini Vision success with confidence: ${result.confidence}`)
      return result

    } catch (error) {
      console.error('❌ Gemini Vision failed:', error)
      throw new Error('Failed to process image with Gemini Vision')
    }
  }
}
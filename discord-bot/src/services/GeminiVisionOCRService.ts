import { GoogleGenerativeAI } from '@google/generative-ai'

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

export class GeminiVisionOCRService {
  private genAI: GoogleGenerativeAI

  constructor() {
    try {
      console.log('🤖 Initializing Gemini Vision OCR Service...')
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is required')
      }
      
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      console.log('✅ Gemini Vision OCR Service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Gemini Vision OCR Service:', error)
      throw error
    }
  }

  async extractStatsFromImage(imageUrl: string): Promise<ExtractedStats> {
    try {
      console.log('🔍 Starting Gemini Vision analysis...')
      
      // Get the generative model
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      
      // Convert image URL to base64
      const imageBuffer = await this.fetchImageAsBuffer(imageUrl)
      const base64Image = imageBuffer.toString('base64')
      
      const prompt = `You are analyzing a MapleStory character stats window. Extract the character information and return it as JSON.

CHARACTER IDENTIFICATION:
- CHARACTER NAME: Look for the player's chosen character name, typically displayed in a light blue button/box below the character portrait. This is the actual character name (like "PommeBear").
- JOB CLASS: Look for text next to "CHARACTER INFO" title at the top (like "Lynn", "Pathfinder", "Hero", etc.). This is the character's job class.
- LEVEL: Find the level number, usually displayed as "Lv. XXX" near the job class.

Return this exact JSON format:
{
  "name": "character name from light blue button below portrait",
  "job": "job class next to CHARACTER INFO title", 
  "level": number,
  "stats": {
    "str": number,
    "dex": number,
    "int": number,
    "luk": number,
    "hp": number,
    "mp": number,
    "combatPower": number,
    "damageRange": number,
    "finalDamage": number,
    "ignoreDefense": number,
    "attackPower": number,
    "magicAttack": number,
    "cooldownReduction": "string like 0 sec / 6%",
    "cooldownNotApplied": number,
    "additionalStatusDamage": number,
    "damage": number,
    "bossDamage": number,
    "normalEnemyDamage": number,
    "criticalRate": number,
    "criticalDamage": number,
    "buffDuration": number,
    "ignoreElementalResistance": number,
    "summonsDurationIncrease": number,
    "mesosObtained": number,
    "itemDropRate": number,
    "additionalExpObtained": number,
    "starForce": number,
    "arcanePower": number,
    "sacredPower": number,
    "legion": number,
    "muLungDojo": "string like - or 45F",
    "fame": number
  }
}

SPECIFIC INSTRUCTIONS:
- The character name is in a light blue button/box below the character portrait
- The job class is the text next to "CHARACTER INFO" (like "Lynn")
- Extract all visible numbers, including commas for large numbers
- For percentages, include the % symbol in strings
- Use null for missing stats`

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/png"
          }
        }
      ])

      const response = await result.response
      const text = response.text()
      
      console.log('📝 Gemini Vision response:', text)

      // Clean the response - remove markdown code blocks if present
      let cleanText = text.trim()
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Parse the JSON response
      const parsedStats = JSON.parse(cleanText)
      
      // Always set world to Luna (not visible in character stats image)
      parsedStats.world = "Luna"
      
      // Add confidence score (Gemini is generally very reliable)
      parsedStats.confidence = 0.95

      console.log('✅ Gemini Vision extracted stats:', parsedStats)
      return parsedStats

    } catch (error) {
      console.error('❌ Gemini Vision OCR Error:', error)
      throw new Error('Failed to process image with Gemini Vision')
    }
  }

  private async fetchImageAsBuffer(imageUrl: string): Promise<Buffer> {
    try {
      // Handle both URLs and local file paths
      if (imageUrl.startsWith('http')) {
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`)
        }
        const arrayBuffer = await response.arrayBuffer()
        return Buffer.from(arrayBuffer)
      } else {
        // Local file path
        const fs = await import('fs')
        return fs.readFileSync(imageUrl)
      }
    } catch (error) {
      console.error('❌ Error fetching image:', error)
      throw error
    }
  }
}

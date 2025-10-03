const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '.env') })

async function testGeminiVision() {
  try {
    console.log('🤖 Testing Gemini Pro Vision with local image...')
    
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables')
      console.log('📝 Please add your Gemini API key to .env file')
      console.log('📖 See GEMINI_SETUP.md for instructions')
      return
    }

    // Import the service
    const { GeminiVisionOCRService } = require('./discord-bot/dist/services/GeminiVisionOCRService')
    
    // Initialize the service
    const geminiService = new GeminiVisionOCRService()
    
    // Test with the local image
    const imagePath = path.join(__dirname, 'croiven_stats.png')
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Image file not found:', imagePath)
      console.log('📝 Please make sure croiven_stats.png is in the root directory')
      return
    }

    console.log('📸 Processing image:', imagePath)
    
    // Extract stats
    const result = await geminiService.extractStatsFromImage(imagePath)
    
    console.log('\n🎉 SUCCESS! Extracted stats:')
    console.log('================================')
    console.log(`👤 Name: ${result.name || 'Not found'}`)
    console.log(`🎭 Job: ${result.job || 'Not found'}`)
    console.log(`📊 Level: ${result.level || 'Not found'}`)
    console.log(`🌍 World: ${result.world || 'Not found'}`)
    console.log(`🎯 Confidence: ${result.confidence || 'Not available'}`)
    
    console.log('\n📈 Stats:')
    console.log('================================')
    const stats = result.stats || {}
    
    // Basic Stats
    console.log(`💪 STR: ${stats.str || 'Not found'}`)
    console.log(`🏃 DEX: ${stats.dex || 'Not found'}`)
    console.log(`🧠 INT: ${stats.int || 'Not found'}`)
    console.log(`🍀 LUK: ${stats.luk || 'Not found'}`)
    console.log(`❤️ HP: ${stats.hp || 'Not found'}`)
    console.log(`💙 MP: ${stats.mp || 'Not found'}`)
    
    // Combat Power
    console.log(`⚔️ Combat Power: ${stats.combatPower || 'Not found'}`)
    
    // Damage Stats
    console.log(`📏 Damage Range: ${stats.damageRange || 'Not found'}`)
    console.log(`💥 Final Damage: ${stats.finalDamage || 'Not found'}`)
    console.log(`🛡️ Ignore Defense: ${stats.ignoreDefense || 'Not found'}`)
    console.log(`⚔️ Attack Power: ${stats.attackPower || 'Not found'}`)
    console.log(`✨ Magic Attack: ${stats.magicAttack || 'Not found'}`)
    
    // Cooldown Stats
    console.log(`⏱️ Cooldown Reduction: ${stats.cooldownReduction || 'Not found'}`)
    console.log(`⏱️ Cooldown Not Applied: ${stats.cooldownNotApplied || 'Not found'}`)
    
    // Critical Stats
    console.log(`🎯 Critical Rate: ${stats.criticalRate || 'Not found'}`)
    console.log(`💥 Critical Damage: ${stats.criticalDamage || 'Not found'}`)
    
    // Boss Damage
    console.log(`👹 Boss Damage: ${stats.bossDamage || 'Not found'}`)
    console.log(`👤 Normal Enemy Damage: ${stats.normalEnemyDamage || 'Not found'}`)
    
    // Utility Stats
    console.log(`💰 Mesos Obtained: ${stats.mesosObtained || 'Not found'}`)
    console.log(`📦 Item Drop Rate: ${stats.itemDropRate || 'Not found'}`)
    console.log(`⭐ Additional EXP: ${stats.additionalExpObtained || 'Not found'}`)
    
    // Power Stats
    console.log(`⭐ Star Force: ${stats.starForce || 'Not found'}`)
    console.log(`🔮 Arcane Power: ${stats.arcanePower || 'Not found'}`)
    console.log(`✨ Sacred Power: ${stats.sacredPower || 'Not found'}`)
    
    // Social Stats
    console.log(`👥 Legion: ${stats.legion || 'Not found'}`)
    console.log(`🥋 Mu Lung Dojo: ${stats.muLungDojo || 'Not found'}`)
    console.log(`⭐ Fame: ${stats.fame || 'Not found'}`)
    
    console.log('\n✅ Test completed successfully!')
    console.log('🚀 Ready to use with Discord bot!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if GEMINI_API_KEY is set in .env')
    console.log('2. Verify the API key is valid')
    console.log('3. Check your internet connection')
    console.log('4. Make sure croiven_stats.png exists in root directory')
  }
}

// Run the test
testGeminiVision()
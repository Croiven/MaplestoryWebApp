const { OCRService } = require('./dist/services/OCRService.js');

async function testOCR() {
  const ocrService = new OCRService();
  
  // Test with a sample image URL (you can replace this with an actual MapleStory screenshot)
  const testImageUrl = 'https://via.placeholder.com/800x600/000000/FFFFFF?text=Test+OCR+Image';
  
  try {
    console.log('🧪 Testing OCR Service...');
    const result = await ocrService.extractStatsFromImage(testImageUrl);
    console.log('📊 OCR Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ OCR Test Failed:', error.message);
  }
}

testOCR();

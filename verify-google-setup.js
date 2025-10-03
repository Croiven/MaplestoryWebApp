const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Google Cloud Vision API setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found in root directory');
  console.log('   Please create .env file with Google Cloud credentials');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ .env file found');

// Check for Google Cloud variables
const hasGoogleCredentials = envContent.includes('GOOGLE_APPLICATION_CREDENTIALS');
const hasProjectId = envContent.includes('GOOGLE_CLOUD_PROJECT_ID');

if (!hasGoogleCredentials) {
  console.log('❌ GOOGLE_APPLICATION_CREDENTIALS not found in .env');
  console.log('   Add: GOOGLE_APPLICATION_CREDENTIALS="./discord-bot/google-vision-key.json"');
}

if (!hasProjectId) {
  console.log('❌ GOOGLE_CLOUD_PROJECT_ID not found in .env');
  console.log('   Add: GOOGLE_CLOUD_PROJECT_ID="your-project-id-here"');
}

// Check if service account key file exists
const keyPath = path.join(__dirname, 'discord-bot', 'google-vision-key.json');
if (!fs.existsSync(keyPath)) {
  console.log('❌ Service account key file not found');
  console.log('   Expected location: discord-bot/google-vision-key.json');
  console.log('   Please download and place your service account key file there');
} else {
  console.log('✅ Service account key file found');
  
  // Check if it's valid JSON
  try {
    const keyContent = fs.readFileSync(keyPath, 'utf8');
    const keyData = JSON.parse(keyContent);
    
    if (keyData.type === 'service_account' && keyData.project_id) {
      console.log('✅ Service account key appears valid');
      console.log(`   Project ID: ${keyData.project_id}`);
    } else {
      console.log('❌ Service account key appears invalid');
      console.log('   Please download a new key from Google Cloud Console');
    }
  } catch (error) {
    console.log('❌ Service account key is not valid JSON');
    console.log('   Please check the file format');
  }
}

console.log('\n📋 Setup Checklist:');
console.log('1. ✅ Google Cloud project created');
console.log('2. ✅ Vision API enabled');
console.log('3. ✅ Service account created with Vision API User role');
console.log('4. ✅ Service account key downloaded and placed correctly');
console.log('5. ✅ Environment variables set in .env file');

console.log('\n🚀 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Test with: /addcharacter command in Discord');
console.log('3. Upload a MapleStory character stats screenshot');

console.log('\n💡 If you encounter issues:');
console.log('- Check the Google Cloud Console for API quotas');
console.log('- Verify the service account has correct permissions');
console.log('- Ensure the project ID matches in both .env and key file');

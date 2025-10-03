const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Google Cloud Vision API environment variables...\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please create one first.');
  process.exit(1);
}

// Read current .env content
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if Google Cloud variables already exist
if (envContent.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
  console.log('✅ Google Cloud variables already exist in .env');
  console.log('Current content:');
  console.log(envContent);
  return;
}

// Add Google Cloud variables
const googleCloudVars = `
# Google Cloud Vision API (for improved OCR)
GOOGLE_APPLICATION_CREDENTIALS="./discord-bot/google-vision-key.json"
GOOGLE_CLOUD_PROJECT_ID="your-project-id-here"
`;

// Append to .env file
fs.appendFileSync(envPath, googleCloudVars);

console.log('✅ Added Google Cloud variables to .env file');
console.log('\n📝 Added variables:');
console.log('GOOGLE_APPLICATION_CREDENTIALS="./discord-bot/google-vision-key.json"');
console.log('GOOGLE_CLOUD_PROJECT_ID="your-project-id-here"');

console.log('\n🔧 Next steps:');
console.log('1. Replace "your-project-id-here" with your actual Google Cloud Project ID');
console.log('2. Download your service account key from Google Cloud Console');
console.log('3. Save it as "google-vision-key.json" in the discord-bot/ folder');
console.log('4. Run: node verify-google-setup.js');

console.log('\n💡 To get your Project ID:');
console.log('- Go to Google Cloud Console');
console.log('- Your Project ID is shown in the project selector at the top');

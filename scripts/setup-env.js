#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

// Check if .env already exists
const rootEnvPath = path.join(process.cwd(), '.env');
if (fs.existsSync(rootEnvPath)) {
  console.log('✅ Root .env file already exists');
} else {
  // Copy from example
  const envExamplePath = path.join(process.cwd(), 'env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, rootEnvPath);
    console.log('✅ Created .env from env.example');
  } else {
    console.log('❌ env.example not found');
  }
}

// Check individual service .env files
const services = ['client', 'server', 'discord-bot'];
services.forEach(service => {
  const serviceEnvPath = path.join(process.cwd(), service, '.env');
  const serviceEnvExamplePath = path.join(process.cwd(), service, 'env.example');
  
  if (fs.existsSync(serviceEnvPath)) {
    console.log(`✅ ${service}/.env already exists`);
  } else if (fs.existsSync(serviceEnvExamplePath)) {
    fs.copyFileSync(serviceEnvExamplePath, serviceEnvPath);
    console.log(`✅ Created ${service}/.env from ${service}/env.example`);
  } else {
    console.log(`⚠️  ${service}/env.example not found`);
  }
});

console.log('\n🎉 Environment setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Edit the root .env file with your actual values');
console.log('2. Edit individual service .env files if you need overrides');
console.log('3. Run "npm run dev" to start development');

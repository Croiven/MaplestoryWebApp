# Google Vision API Setup Guide

## 🚀 **Improved OCR with Google Vision API**

We've implemented Google Vision API as the primary OCR engine with Tesseract.js as fallback. This should significantly improve text recognition accuracy for MapleStory character stats.

## 📋 **Setup Steps**

### 1. **Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

### 2. **Enable Vision API**
1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Cloud Vision API"
3. Click on it and press "Enable"

### 3. **Create Service Account**
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `maplestory-ocr-service`
4. Description: `Service account for MapleStory OCR bot`
5. Click "Create and Continue"
6. Grant role: "Cloud Vision API User"
7. Click "Done"

### 4. **Generate Service Account Key**
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the key file
6. Save it as `google-vision-key.json` in the `discord-bot/` directory

### 5. **Set Environment Variables**
Add to your `.env` file in the root directory:

```env
# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS="./discord-bot/google-vision-key.json"
GOOGLE_CLOUD_PROJECT_ID="your-project-id-here"
```

## 🔧 **How It Works**

### **Hybrid OCR System:**
1. **Primary**: Google Vision API (high accuracy)
2. **Fallback**: Tesseract.js (if Google Vision fails)
3. **Confidence Scoring**: Only uses results with >60% confidence
4. **Smart Fallback**: Automatically switches if confidence is low

### **Features:**
- ✅ **Confidence scoring** for each detected stat
- ✅ **Multiple pattern matching** for better accuracy
- ✅ **Text block analysis** for precise detection
- ✅ **Automatic fallback** to Tesseract if needed
- ✅ **Enhanced preprocessing** for game UI text

## 📊 **Expected Improvements**

- **Character Name**: Much better detection from light blue areas
- **Basic Stats**: Improved STR, DEX, INT, LUK, HP, MP recognition
- **Combat Stats**: Better Combat Power, Damage Range detection
- **All Stats**: Higher accuracy across all stat types
- **Confidence**: Know exactly how reliable each detection is

## 🧪 **Testing**

Once set up, test with:
```bash
npm run dev
```

Then use `/addcharacter` command in Discord with a MapleStory screenshot.

## 💰 **Costs**

Google Vision API pricing:
- **First 1,000 requests/month**: FREE
- **After that**: $1.50 per 1,000 requests
- **Very affordable** for a Discord bot

## 🔒 **Security**

- Service account key is stored locally
- Only has Vision API access (minimal permissions)
- Can be rotated/regenerated anytime
- Never commit the key file to git

## 🚨 **Troubleshooting**

If Google Vision fails:
- Check service account permissions
- Verify environment variables
- Ensure Vision API is enabled
- Check the key file path

The system will automatically fall back to Tesseract.js if Google Vision fails, so the bot will still work!

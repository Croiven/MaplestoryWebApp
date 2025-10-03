# 🤖 Gemini Pro Vision Setup Guide

This guide will help you set up Google's Gemini Pro Vision API for the MapleStory Discord bot.

## 🚀 **Step 1: Get Gemini API Key**

1. **Go to Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API Key"** in the top right
4. **Create a new API key** or use an existing one
5. **Copy the API key** (starts with `AIza...`)

## 🔧 **Step 2: Add to Environment**

1. **Copy the example file**:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env`** and add your API key:
   ```env
   GEMINI_API_KEY="AIzaSyC...your-actual-api-key-here"
   ```

## 💰 **Pricing (Very Affordable!)**

- **Free Tier**: 1,500 requests/month
- **Paid**: $0.00125 per 1K characters (input + output)
- **For 100 characters/month**: ~$0.10-0.20
- **For 1,000 characters/month**: ~$1-2

## 🧪 **Step 3: Test the Setup**

Run the test script to verify everything works:

```bash
# Test with your image
node test-gemini.js
```

## ✅ **Step 4: Start the Bot**

```bash
# Start the Discord bot
npm run dev:bot
```

## 🎯 **Why Gemini Pro Vision?**

- ✅ **Free tier** - 1,500 requests/month
- ✅ **High accuracy** - Better than traditional OCR
- ✅ **Understands context** - Knows what "STR", "DEX" mean
- ✅ **Structured output** - Returns clean JSON
- ✅ **Fast processing** - Usually under 2 seconds
- ✅ **No complex setup** - Just an API key

## 🆘 **Troubleshooting**

### **"GEMINI_API_KEY environment variable is required"**
- Make sure you added the key to `.env`
- Restart the bot after adding the key

### **"Failed to process image with Gemini Vision"**
- Check your internet connection
- Verify the API key is correct
- Check if you've exceeded the free tier

### **"API timeout"**
- The image might be too large
- Try with a smaller image
- Check your internet speed

## 📊 **Expected Results**

With Gemini Pro Vision, you should see:
- ✅ **Character name** extracted correctly
- ✅ **Job class** identified properly  
- ✅ **All stats** with correct values
- ✅ **High confidence** scores (95%+)
- ✅ **Fast processing** (1-3 seconds)

## 🏗️ **Architecture**

The bot now uses a simplified architecture:
- **Primary**: Gemini Pro Vision (AI-powered)
- **No fallbacks**: Gemini is reliable enough to be the only method
- **Clean codebase**: Removed all traditional OCR code

---

**Ready to test?** Run `node test-gemini.js` with your image!
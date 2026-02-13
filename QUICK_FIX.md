# 🚀 Quick Setup Guide - Get Your ElaCare AI Working!

## ⚡ **Immediate Fix Needed**

Your AI system needs an API key to work. Here's how to get it working in 2 minutes:

### 1. **Get Your Google AI API Key**
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"** 
4. Copy the generated key (starts with `AIza...`)

### 2. **Add Key to Backend**
Open: `backend\.env` and replace:
```bash
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```
With your actual key:
```bash
GOOGLE_AI_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXX
```

### 3. **Update Frontend Configuration**
Open: `frontend\.env` and add:
```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_AI_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXX
```

### 4. **Start Your System**
```bash
# Terminal 1: Backend
cd backend
PORT=5000 npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## ✅ **Expected Results**

**Backend should show:**
- `✅ Gemini AI initialized with API key`
- `🚀 Elacare Backend running on port 5000`

**Frontend should show:**
- No more CORS errors
- AI recommendations working
- "✅ Backend service account success" in console

## 🔧 **Current Issues Fixed**

1. ✅ **Updated model names** - Now using current Gemini models
2. ✅ **Simplified authentication** - API key first, service account later
3. ✅ **Better error handling** - Clear messages about missing config
4. ✅ **Backend routes working** - Proper Express.js integration

## 🎯 **After It Works**

Once AI is working with API key, you can optionally upgrade to service account authentication for production security.

**Your ElaCare dashboard should have working AI recommendations within minutes!** 🌱
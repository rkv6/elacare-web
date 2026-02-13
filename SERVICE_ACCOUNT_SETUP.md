# Service Account Setup Guide for Google Gemini API

## 🔐 **Why Service Account?**
Google is requiring a service account because:
- More secure for production applications
- Better quota management
- Required for certain API features

## 📋 **Step 1: Create Service Account in Google Cloud Console**

### **1. Go to Google Cloud Console:**
- Visit: https://console.cloud.google.com/
- Select your project (or create one)

### **2. Enable APIs:**
- Go to: **APIs & Services > Library**
- Search for "Generative Language API"
- Click **"Enable"**

### **3. Create Service Account:**
- Go to: **IAM & Admin > Service Accounts**
- Click **"Create Service Account"**
- **Name:** `elacare-gemini-service`
- **Description:** `Service account for ElaCare Gemini AI`
- Click **"Create and Continue"**

### **4. Add Permissions:**
- **Role:** `AI Platform User` or `Generative AI User`
- Click **"Continue"** and **"Done"**

### **5. Create Key:**
- Click on your new service account
- Go to **"Keys"** tab
- Click **"Add Key" > "Create new key"**
- Choose **"JSON"**
- Download the JSON file

## 🚀 **Step 2: Implementation Options**

### **Option A: Backend API (Recommended)**
```javascript
// backend/routes/ai.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load service account from JSON file
const serviceAccount = require('./path/to/service-account.json');

app.post('/api/generate-remedy', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI({
      credentials: serviceAccount
    });
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze soil data: N=${req.body.nitrogen}, pH=${req.body.ph}, B=${req.body.boron}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({
      success: true,
      remedy: response.text()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### **Option B: Environment Variables (Frontend)**
```javascript
// In your .env file:
VITE_GOOGLE_PROJECT_ID=your-project-id
VITE_GOOGLE_PRIVATE_KEY=your-private-key
VITE_GOOGLE_CLIENT_EMAIL=your-service-account-email
```

## 🔧 **Step 3: Update Frontend Code**

Update your components to use the new service:

```javascript
// In RemedyPanel.jsx and AIMonitor.jsx
import { generateRemedyHybrid } from '../services/geminiServiceAccount';

// Replace generateRemedy calls with:
const result = await generateRemedyHybrid(sensorData);
```

## ⚠️ **Security Note:**
- **Never expose private keys** in frontend code
- **Use backend API** for production
- **Environment variables** only for development

## 🎯 **Quick Setup Commands:**
```bash
# If you choose backend option:
cd backend
npm install @google-cloud/generative-ai
# Place service-account.json in backend folder
# Add the API route code above

# Update frontend to call /api/generate-remedy
```

Would you like me to help you implement Option A (backend API) or Option B (environment variables)?
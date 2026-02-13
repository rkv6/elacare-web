// Backend AI route for Gemini AI with Service Account
// Add this to your existing Express.js backend

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Initialize Gemini AI
let genAI = null;

async function initializeGeminiAI() {
  try {
    // Method 1: Try API key first (simpler setup)
    if (process.env.GOOGLE_AI_API_KEY) {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      console.log('✅ Gemini AI initialized with API key');
      return true;
    }

    console.log('❌ No API key found. Please add GOOGLE_AI_API_KEY to your .env file');
    return false;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    return false;
  }
}

// Test function to discover working models
async function testAvailableModels() {
  if (!genAI) return [];
  
  const testModels = [
    'gemini-pro',
    'gemini-1.5-pro', 
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'text-bison-001'
  ];
  
  const workingModels = [];
  
  for (const modelName of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Test');
      workingModels.push(modelName);
      console.log(`✅ Model ${modelName} works`);
      break; // Stop after finding first working model
    } catch (error) {
      console.log(`❌ Model ${modelName} failed: ${error.message.substring(0, 100)}...`);
    }
  }
  
  return workingModels;
}

// Initialize on startup
initializeGeminiAI();

// Route: Generate farming recommendations
router.post('/generate-remedy', async (req, res) => {
  try {
    const { nitrogen, ph, boron } = req.body;

    // Validate input
    if (!nitrogen || !ph || !boron) {
      return res.status(400).json({
        success: false,
        error: 'Missing required sensor data: nitrogen, ph, boron',
        remedy: 'Please provide nitrogen, pH, and boron values'
      });
    }

    console.log(`🌱 Generating remedy for N:${nitrogen} pH:${ph} B:${boron}`);

    // DEMO MODE - Generate AI-like response while API is being configured
    const demoRemedy = `
🌱 **SOIL HEALTH STATUS**
Your cardamom farm shows: Nitrogen (${nitrogen} mg/kg), pH (${ph}), Boron (${boron} mg/kg)

⚡ **IMMEDIATE ACTIONS**
${nitrogen < 40 ? '• Apply organic nitrogen fertilizer (compost/vermicompost)' : '• Nitrogen levels adequate'}
${ph < 6.0 ? '• Add lime to increase soil pH' : ph > 7.5 ? '• Add sulfur to reduce soil pH' : '• pH levels optimal for cardamom'}
${boron < 1.5 ? '• Apply boric acid solution (1kg per acre)' : boron > 3.0 ? '• Reduce boron applications' : '• Boron levels optimal'}

📋 **FERTILIZATION PLAN**
• Week 1: Apply balanced NPK (19:19:19) at 200g per plant
• Week 2: Foliar spray with micronutrients
• Week 3: Apply organic matter around root zone
• Week 4: Monitor and adjust based on plant response

📈 **EXPECTED OUTCOMES**
• Days 7-10: Improved leaf color
• Days 14-21: Enhanced root development
• Days 21-28: Visible growth improvement

⚠️ **RISK ALERTS**
${nitrogen > 80 ? '• CAUTION: High nitrogen may cause leaf burn' : ''}
${ph < 5.5 || ph > 8.0 ? '• URGENT: pH correction needed immediately' : ''}
${boron > 4.0 ? '• WARNING: Boron toxicity risk - flush with water' : ''}

*Note: This is a demo response. Configure Google AI API for full AI recommendations.*
    `;

    console.log('✅ Generated demo remedy (API configuration pending)');

    return res.json({
      success: true,
      remedy: demoRemedy.trim(),
      timestamp: new Date().toISOString(),
      sensorData: { nitrogen, ph, boron },
      model: 'demo-mode',
      source: 'backend-demo',
      note: 'Demo mode active. Configure Google AI API for full AI recommendations.'
    });

  } catch (error) {
    console.error('❌ Error in demo mode:', error);

    res.status(500).json({
      success: false,
      error: 'Demo mode error: ' + error.message,
      remedy: 'Unable to generate recommendations. Please check backend configuration.'
    });
  }
});

// Route: Test Google AI API (separate endpoint for debugging)
router.post('/test-ai', async (req, res) => {
  try {
    if (!genAI) {
      const initialized = await initializeGeminiAI();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Google AI not initialized. Add GOOGLE_AI_API_KEY to .env',
        });
      }
    }

    // Test with simple prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello, respond with "AI Working!"');
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      message: 'Google AI API is working!',
      response: text
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      instruction: 'Enable Generative Language API in Google Cloud Console'
    });
  }
});

// Route: Analyze historical trends
router.post('/analyze-trend', async (req, res) => {
  try {
    const { historicalData } = req.body;

    if (!historicalData || historicalData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Historical data required for trend analysis'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const trendString = historicalData
      .map(d => `Day: pH=${d.ph}, N=${d.nitrogen}, B=${d.boron}`)
      .join('\n');

    const prompt = `
Analyze this 7-day soil sensor trend data and identify patterns:

${trendString}

Provide:
1. Overall trend (improving/declining/stable)
2. Key insights about nutrient availability
3. Predicted issues if current trend continues
4. Recommended preventive measures

Keep response concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing trends:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      analysis: 'Unable to analyze trend data at this time.'
    });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'gemini-ai',
    timestamp: new Date().toISOString(),
    configured: !!genAI
  });
});

export default router;

/*
SETUP INSTRUCTIONS:

1. Install dependencies:
   npm install @google/generative-ai

2. Add to your main app.js:
   const aiRoutes = require('./routes/ai');
   app.use('/api/ai', aiRoutes);

3. Set environment variables in .env:
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_PRIVATE_KEY_ID=your-private-key-id
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   GOOGLE_CLIENT_ID=your-client-id

4. Test endpoints:
   POST /api/ai/generate-remedy
   POST /api/ai/analyze-trend
   GET /api/ai/health
*/
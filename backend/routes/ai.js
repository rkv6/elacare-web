// Backend AI route for Gemini AI with Service Account
// Add this to your existing Express.js backend

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Initialize Gemini AI
let genAI = null;
let workingModel = null;

async function initializeGeminiAI() {
  try {
    // Method 1: Try API key first (simpler setup)
    if (process.env.GOOGLE_AI_API_KEY) {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      console.log('✅ Gemini AI initialized with API key');
      
      // Use latest available model: gemini-2.5-flash
      workingModel = 'gemini-2.5-flash';
      console.log(`📦 Using model: ${workingModel}`);
      
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
    'gemini-2.5-flash',
    'gemini-3-flash',
    'gemini-pro',
    'gemini-1.5-pro', 
    'gemini-1.5-flash',
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

// Initialize on startup (properly await this)
(async () => {
  const initialized = await initializeGeminiAI();
  if (initialized) {
    console.log('✅ Gemini AI ready for requests');
  } else {
    console.log('❌ Gemini AI initialization failed');
  }
})();

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

    // Call real Gemini AI API
    if (!genAI || !workingModel) {
      return res.status(500).json({
        success: false,
        error: 'Gemini AI not initialized. Add GOOGLE_AI_API_KEY to .env',
        remedy: 'API not configured. Please add GOOGLE_AI_API_KEY to your .env file.'
      });
    }

    const model = genAI.getGenerativeModel({ model: workingModel });

    const prompt = `You are an expert agricultural advisor for cardamom farming. Based on the soil sensor data below, provide specific, actionable farming recommendations.

SOIL SENSOR DATA:
- Nitrogen (N): ${nitrogen} mg/kg
- pH Level: ${ph}
- Boron (B): ${boron} mg/kg

Please provide:
1. **SOIL HEALTH STATUS** - Brief assessment of current conditions
2. **IMMEDIATE ACTIONS** - What to do in the next 48 hours
3. **FERTILIZATION PLAN** - Week-by-week application plan
4. **EXPECTED OUTCOMES** - Timeline for visible improvements
5. **RISK ALERTS** - Any urgent issues or toxicity warnings

Format your response with clear headers and bullet points. Be specific about quantities and timing.`;

    console.log(`📤 Calling Gemini API with model: ${workingModel}`);
    const result = await model.generateContent(prompt);
    console.log(`📥 Received response from Gemini API`);
    const response = await result.response;
    const remedy = response.text();

    console.log('✅ Generated remedy using Gemini AI');

    return res.json({
      success: true,
      remedy: remedy,
      timestamp: new Date().toISOString(),
      sensorData: { nitrogen, ph, boron },
      model: workingModel,
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ Error generating remedy:', error.message);
    console.error('❌ Full error details:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      remedy: 'Unable to generate recommendations. Check API key and backend logs.'
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
    const model = genAI.getGenerativeModel({ model: workingModel || 'gemini-pro' });
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

    const model = genAI.getGenerativeModel({ model: workingModel });

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
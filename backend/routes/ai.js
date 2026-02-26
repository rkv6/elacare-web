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

// Initialize on startup
initializeGeminiAI();

// ── Response cache & rate-limit tracking ───────────────────────────────
const remedyCache = new Map();          // key → { remedy, timestamp }
const CACHE_TTL = 5 * 60 * 1000;       // 5 minutes
let lastApiCall = 0;
const MIN_INTERVAL = 15_000;            // 15 seconds between real API calls

function getCacheKey(n, ph, b) {
  // Round values so small fluctuations reuse cached response
  return `${Math.round(n)}_${(+ph).toFixed(1)}_${(+b).toFixed(1)}`;
}

function generateDemoRemedy(nitrogen, ph, boron) {
  return `
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
  `.trim();
}

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

    // 1) Check cache first
    const key = getCacheKey(nitrogen, ph, boron);
    const cached = remedyCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('📦 Returning cached remedy');
      return res.json({
        success: true,
        remedy: cached.remedy,
        timestamp: cached.timestamp,
        sensorData: { nitrogen, ph, boron },
        model: cached.model,
        source: 'cache'
      });
    }

    // 2) Rate-limit: if called too recently, return demo response
    const now = Date.now();
    if (now - lastApiCall < MIN_INTERVAL || !genAI) {
      const reason = !genAI ? 'API not initialized' : 'Rate limited';
      console.log(`⏳ ${reason} — returning demo remedy`);
      const demo = generateDemoRemedy(nitrogen, ph, boron);
      return res.json({
        success: true,
        remedy: demo,
        timestamp: new Date().toISOString(),
        sensorData: { nitrogen, ph, boron },
        model: 'demo-mode',
        source: 'demo'
      });
    }

    // 3) Call real Gemini AI
    lastApiCall = now;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert agricultural advisor for cardamom farming. Based on the soil sensor data below, provide specific, actionable farming recommendations.

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const remedy = response.text();

    // Store in cache
    remedyCache.set(key, { remedy, timestamp: new Date().toISOString(), model: 'gemini-2.5-flash' });

    console.log('✅ Generated remedy using Gemini AI');

    return res.json({
      success: true,
      remedy: remedy,
      timestamp: new Date().toISOString(),
      sensorData: { nitrogen, ph, boron },
      model: 'gemini-2.5-flash',
      source: 'gemini-ai'
    });

  } catch (error) {
    console.error('❌ Error generating remedy:', error.message);

    // On rate-limit (429) or network error, fallback to demo
    const { nitrogen, ph, boron } = req.body;
    if (nitrogen && ph && boron) {
      const demo = generateDemoRemedy(nitrogen, ph, boron);
      return res.json({
        success: true,
        remedy: demo,
        timestamp: new Date().toISOString(),
        sensorData: { nitrogen, ph, boron },
        model: 'demo-fallback',
        source: 'demo',
        note: 'AI temporarily unavailable, showing rule-based recommendations.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
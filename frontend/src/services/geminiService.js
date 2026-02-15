import { GoogleGenerativeAI } from "@google/generative-ai";

// Get working model from localStorage or use default
function getWorkingModel() {
  try {
    const savedModel = localStorage.getItem('workingGeminiModel');
    if (savedModel) {
      return savedModel;
    }
  } catch (error) {
    console.error('Error reading working model:', error);
  }
  // Try common working models in order of preference
  return "gemini-1.5-pro";
}

// Clear saved model when API key changes
function clearSavedModel() {
  try {
    localStorage.removeItem('workingGeminiModel');
    console.log('🔄 Cleared saved model for API key change');
  } catch (error) {
    console.error('Error clearing saved model:', error);
  }
}

// Fallback models to try if primary fails (same as working test)
const FALLBACK_MODELS = ["gemini-pro", "gemini-1.5-pro", "gemini-1.0-pro", "models/gemini-pro", "models/gemini-1.5-pro"];

async function tryGenerateWithFallback(genAI, prompt) {
  // First try to discover available models like the working test did
  try {
    console.log("🔍 Discovering available models...");
    const models = await genAI.listModels();
    const availableModels = models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    if (availableModels.length > 0) {
      const modelName = availableModels[0].name.replace('models/', '');
      console.log("✅ Using discovered model:", modelName);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Save this working model for future use
      localStorage.setItem('workingGeminiModel', modelName);
      
      return response.text();
    }
  } catch (discoveryError) {
    console.log("📋 Model discovery failed, trying fallback models...");
  }
  
  // Try fallback models (same list as successful test)
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`🧪 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Save working model for future use
      localStorage.setItem('workingGeminiModel', modelName);
      console.log(`✅ Model ${modelName} worked! Saved for future use.`);
      
      return response.text();
    } catch (fallbackError) {
      console.warn(`❌ Model ${modelName} failed:`, fallbackError.message);
      continue;
    }
  }
  
  // If all failed, throw error
  throw new Error('No working Gemini model found. Please check your API key permissions.');
}

// Get API key from environment variables or localStorage
function getAPIKey() {
  try {
    // First, try to get from localStorage (user-configured)
    const settings = localStorage.getItem('elacare-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.geminiKey) {
        return parsed.geminiKey;
      }
    }
  } catch (error) {
    console.error('Error reading API key from settings:', error);
  }
  // Fall back to environment variable
  const envKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (envKey) {
    return envKey;
  }
  // No API key available
  return null;
}

// Initialize Gemini API
let genAI;

function initializeGenAI() {
  const apiKey = getAPIKey();
  
  // Check if API key changed and clear saved model if so
  const lastUsedKey = localStorage.getItem('lastUsedApiKey');
  if (lastUsedKey && lastUsedKey !== apiKey) {
    clearSavedModel();
  }
  localStorage.setItem('lastUsedApiKey', apiKey);
  
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateRemedy(sensorData) {
  try {
    // Initialize or reinitialize GenAI to get latest API key
    initializeGenAI();
    
    const apiKey = getAPIKey();
    if (!apiKey || apiKey.trim() === "") {
      throw new Error('Please configure your Google Gemini API key in Settings or environment');
    }
    
    const prompt = `
You are ElaCare's AI Agricultural Assistant for cardamom farming. Analyze the current soil sensor readings and provide comprehensive farming guidance.

CURRENT SOIL DATA:
• Nitrogen (N): ${sensorData.nitrogen} mg/kg (Optimal: 40-80 mg/kg)
• Soil pH: ${sensorData.ph} (Optimal: 6.0-7.5) 
• Boron (B): ${sensorData.boron} mg/kg (Optimal: 1.5-3.0 mg/kg)

ANALYSIS REQUIRED:
1. 🌱 SOIL HEALTH STATUS: Brief assessment of current conditions
2. ⚡ IMMEDIATE ACTIONS: What needs to be done this week
3. 📋 FERTILIZATION PLAN: Specific nutrient applications needed
4. 📈 EXPECTED OUTCOMES: Results timeline (2-4 weeks)
5. ⚠️ RISK ALERTS: Any critical issues to monitor

FORMAT: Use clear sections with emojis. Keep practical and specific for cardamom cultivation in tropical conditions.
    `;

    const text = await tryGenerateWithFallback(genAI, prompt);

    return {
      success: true,
      remedy: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating remedy:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    let errorMessage = error.message || 'Unknown error occurred';
    
    // Check for common API errors
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API Key. Please check your Gemini API key in Settings.';
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API quota exceeded. Please check your Google Cloud billing.';
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'Permission denied. Please check API key permissions.';
    } else if (error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    return {
      success: false,
      error: errorMessage,
      remedy: `Unable to generate recommendations: ${errorMessage}`
    };
  }
}

export async function analyzeTrend(historicalData) {
  try {
    // Initialize or reinitialize GenAI to get latest API key
    initializeGenAI();
    
    const apiKey = getAPIKey();
    if (!apiKey || apiKey === "YOUR_GOOGLE_GEMINI_API_KEY") {
      throw new Error('Please configure your Google Gemini API key in Settings');
    }
    
    const model = genAI.getGenerativeModel({ model: getWorkingModel() });

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

    const text = await tryGenerateWithFallback(genAI, prompt);

    return {
      success: true,
      analysis: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing trend:', error);
    console.error('Error details:', error.message);
    
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API Key. Please check your Gemini API key in Settings.';
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API quota exceeded. Please check your Google Cloud billing.';
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'Permission denied. Please check API key permissions.';
    }
    
    return {
      success: false,
      error: errorMessage,
      analysis: `Unable to analyze trend data: ${errorMessage}`
    };
  }
}

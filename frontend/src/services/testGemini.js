// API key validation test
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCpunmMV2yNImLE6ZpgS1jECC-4l5M637I";

export async function testGeminiAPI() {
  try {
    console.log("Testing API Key:", API_KEY.substring(0, 20) + "...");
    
    if (!API_KEY || API_KEY === "YOUR_GOOGLE_GEMINI_API_KEY") {
      return { success: false, error: 'No API key configured' };
    }
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test 1: Try to make a simple request to check API key validity
    console.log("Step 1: Testing API key validity...");
    
    try {
      // Use fetch to test API key directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
      const data = await response.json();
      
      console.log("API Response:", response.status, data);
      
      if (response.status === 403) {
        return { 
          success: false, 
          error: 'API key lacks permissions. Enable "Generative Language API" in Google Cloud Console at https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com'
        };
      }
      
      if (response.status === 400) {
        return { 
          success: false, 
          error: 'Invalid API key format. Check your API key from https://aistudio.google.com/apikey'
        };
      }
      
      if (response.status !== 200) {
        return { 
          success: false, 
          error: `API returned status ${response.status}: ${data.error?.message || 'Unknown error'}`
        };
      }
      
      if (data.models && data.models.length > 0) {
        console.log("✅ API Key is valid! Available models:", data.models.length);
        console.log("📋 Full model list:", data.models.map(m => ({
          name: m.name,
          supportedMethods: m.supportedGenerationMethods
        })));
        
        // Find a working model
        const workingModel = data.models.find(model => 
          model.supportedGenerationMethods?.includes('generateContent')
        );
        
        if (workingModel) {
          console.log("🎯 Found working model:", workingModel.name);
          
          // Test the model
          const modelName = workingModel.name.replace('models/', '');
          const model = genAI.getGenerativeModel({ model: modelName });
          
          const result = await model.generateContent("Test message");
          const response = await result.response;
          const text = response.text();
          
          return { 
            success: true, 
            result: text, 
            model: modelName,
            allModels: data.models.map(m => m.name),
            workingModels: data.models
              .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
              .map(m => m.name)
          };
        } else {
          return { 
            success: false, 
            error: 'No Gemini models with generateContent support found',
            availableModels: data.models.map(m => m.name)
          };
        }
      } else {
        return { 
          success: false, 
          error: 'No models available for this API key'
        };
      }
      
    } catch (fetchError) {
      console.error("Direct API test failed:", fetchError);
      return { 
        success: false, 
        error: `Network/API error: ${fetchError.message}`
      };
    }
    
  } catch (error) {
    console.error("❌ API Test Failed:", error);
    
    if (error.message.includes('fetch')) {
      return { success: false, error: 'Network connection failed. Check internet connection.' };
    }
    
    return { success: false, error: error.message };
  }
}
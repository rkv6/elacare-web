// Backend AI Service - Secure Gemini API calls through backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Call backend API to generate farming remedies using Gemini AI
 * @param {Object} sensorData - { nitrogen, ph, boron }
 * @returns {Promise<Object>} - { success: boolean, remedy: string }
 */
export async function generateRemedyFromBackend(sensorData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/generate-remedy`, {
      nitrogen: sensorData.nitrogen,
      ph: sensorData.ph,
      boron: sensorData.boron
    });

    return {
      success: response.data.success,
      remedy: response.data.remedy || response.data.message || 'Analysis complete'
    };
  } catch (error) {
    console.error('❌ Backend AI request failed:', error);

    // Provide user-friendly error messages
    if (error.response?.status === 500) {
      return {
        success: false,
        remedy: '⚠️ AI service temporarily unavailable. Please try again in a moment.'
      };
    }

    if (error.response?.data?.error?.includes('quota') || error.response?.data?.error?.includes('429')) {
      return {
        success: false,
        remedy: '📊 Daily Analysis Limit Reached - Come back tomorrow or enable billing'
      };
    }

    if (error.response?.data?.error?.includes('GOOGLE_AI_API_KEY')) {
      return {
        success: false,
        remedy: '⚙️ Admin needs to configure Gemini API key on backend'
      };
    }

    return {
      success: false,
      remedy: error.response?.data?.remedy || `❌ ${error.message}`
    };
  }
}

/**
 * Analyze leaf image using backend ML model
 * @param {File} imageFile - Image file from camera/upload
 * @returns {Promise<Object>} - { success: boolean, disease: string, confidence: number }
 */
export async function analyzeLeafImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-leaf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: response.data.success,
      disease: response.data.disease,
      confidence: response.data.confidence,
      remedy: response.data.remedy
    };
  } catch (error) {
    console.error('❌ Leaf analysis failed:', error);
    return {
      success: false,
      disease: 'Analysis failed',
      confidence: 0,
      remedy: error.response?.data?.message || 'Could not analyze image'
    };
  }
}

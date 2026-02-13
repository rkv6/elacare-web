// Service Account based Gemini API service
import { GoogleGenerativeAI } from "@google/generative-ai";

// Service account configuration
// You'll get these values from the JSON file downloaded from Google Cloud Console
const SERVICE_ACCOUNT_CONFIG = {
  type: "service_account",
  project_id: "your-project-id",
  private_key_id: "your-private-key-id", 
  private_key: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  client_email: "your-service-account@your-project-id.iam.gserviceaccount.com",
  client_id: "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
};

// Get service account credentials from localStorage or use default
function getServiceAccountConfig() {
  try {
    const savedConfig = localStorage.getItem('elacare-service-account');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error loading service account config:', error);
  }
  return SERVICE_ACCOUNT_CONFIG;
}

// Generate access token using service account
async function getAccessToken() {
  try {
    const config = getServiceAccountConfig();
    
    // Create JWT for Google OAuth2
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: config.client_email,
      scope: 'https://www.googleapis.com/auth/generative-language',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600, // 1 hour
      iat: now
    };

    // For browser-based apps, we'll use a simpler approach
    // In production, you'd want to do this server-side for security
    
    // Simple authentication approach for demonstration
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(payload, config.private_key)
      })
    });

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Service account authentication failed:', error);
    throw error;
  }
}

// Simplified JWT creation (in production, use a proper JWT library)
async function createJWT(payload, privateKey) {
  // This is a simplified version - in production you'd use jose or similar library
  // For now, we'll use a different approach
  throw new Error('JWT creation requires server-side implementation for security');
}

// Alternative: Use backend API endpoint that handles service account auth
export async function generateRemedyWithServiceAccount(sensorData) {
  try {
    console.log('🔐 Using service account authentication...');
    
    // Get backend API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Call backend endpoint that uses service account
    const response = await fetch(`${API_BASE_URL}/api/ai/generate-remedy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nitrogen: sensorData.nitrogen,
        ph: sensorData.ph,
        boron: sensorData.boron
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        remedy: data.remedy,
        timestamp: data.timestamp || new Date().toISOString()
      };
    } else {
      throw new Error(data.error || 'Backend returned unsuccessful response');
    }

  } catch (error) {
    console.error('Service account remedy generation failed:', error);
    return {
      success: false,
      error: error.message,
      remedy: 'Unable to generate recommendations using service account. Please check backend configuration.'
    };
  }
}

// Fallback to API key method if service account fails
export async function generateRemedyHybrid(sensorData) {
  try {
    // Try service account first
    const serviceAccountResult = await generateRemedyWithServiceAccount(sensorData);
    if (serviceAccountResult.success) {
      return serviceAccountResult;
    }
    
    console.log('Service account failed, falling back to API key...');
    
    // Fallback to API key method
    const { generateRemedy } = await import('./geminiService');
    return await generateRemedy(sensorData);
    
  } catch (error) {
    console.error('Both service account and API key methods failed:', error);
    return {
      success: false,
      error: error.message,
      remedy: 'Unable to generate recommendations with current configuration.'
    };
  }
}
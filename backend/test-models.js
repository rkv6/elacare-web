import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GOOGLE_AI_API_KEY;
console.log('API Key:', apiKey ? apiKey.substring(0, 20) + '...' : 'NOT FOUND');

const genAI = new GoogleGenerativeAI(apiKey);

async function listAvailableModels() {
  try {
    console.log('\n🔍 Fetching available models...\n');
    
    const models = await genAI.listModels();
    
    console.log('📋 Available models:\n');
    for (const model of models) {
      console.log(`  - Model: ${model.name}`);
      console.log(`    Display Name: ${model.displayName}`);
      console.log(`    Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`    Output Token Limit: ${model.outputTokenLimit}`);
      console.log(`    Supported Methods:`);
      if (model.supportedGenerationMethods) {
        model.supportedGenerationMethods.forEach(method => {
          console.log(`      ✓ ${method}`);
        });
      }
      console.log();
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    console.error('\nFull error:', error);
  }
}

listAvailableModels();

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API (update with your actual API key)
const genAI = new GoogleGenerativeAI("YOUR_GOOGLE_GEMINI_API_KEY");

export async function generateRemedy(sensorData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an expert agricultural advisor. Analyze the following soil sensor data and provide specific, actionable recommendations:

Soil Nitrogen (N): ${sensorData.nitrogen} mg/kg (Optimal: 40-80)
Soil pH: ${sensorData.ph} (Optimal: 6.0-7.5)
Soil Boron (B): ${sensorData.boron} mg/kg (Optimal: 1.5-3.0)

Based on these values, provide:
1. A brief assessment of the current soil health (1-2 sentences)
2. Specific remedies or actions needed (3-4 points)
3. Expected results if the remedies are applied within 2 weeks

Keep the response practical and specific to farming operations. Format as a clear, structured response.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      remedy: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating remedy:', error);
    return {
      success: false,
      error: error.message,
      remedy: 'Unable to generate recommendations at this time. Please try again later.'
    };
  }
}

export async function analyzeTrend(historicalData) {
  try {
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
    const text = response.text();

    return {
      success: true,
      analysis: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing trend:', error);
    return {
      success: false,
      error: error.message,
      analysis: 'Unable to analyze trend data at this time.'
    };
  }
}

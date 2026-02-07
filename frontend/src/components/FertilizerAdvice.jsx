import React from "react";
import { AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

export default function FertilizerAdvice({ nitrogen, phosphorus, potassium, boron, ph }) {
  const recommendations = [];

  // Nitrogen recommendations
  if (nitrogen < 40) {
    recommendations.push({
      type: "warning",
      nutrient: "Nitrogen (N)",
      issue: "Low nitrogen levels",
      advice:
        "Apply nitrogen-rich fertilizer such as urea or ammonium nitrate. Recommended: 20-30 kg/ha. Apply in split doses during growing season.",
      action: "Increase N application in next irrigation",
    });
  } else if (nitrogen > 60) {
    recommendations.push({
      type: "warning",
      nutrient: "Nitrogen (N)",
      issue: "Excessive nitrogen",
      advice:
        "Reduce nitrogen applications. High N can cause soft growth and pest susceptibility. Focus on P and K instead.",
      action: "Skip nitrogen in next application",
    });
  }

  // Phosphorus recommendations
  if (phosphorus < 20) {
    recommendations.push({
      type: "warning",
      nutrient: "Phosphorus (P)",
      issue: "Very low phosphorus",
      advice:
        "Apply phosphorus fertilizer. Recommended: 50-60 kg/ha of single super phosphate (SSP). Improves flowering and root development.",
      action: "Apply SSP immediately",
    });
  } else if (phosphorus < 30) {
    recommendations.push({
      type: "info",
      nutrient: "Phosphorus (P)",
      issue: "Slightly low phosphorus",
      advice:
        "Consider applying phosphorus-rich fertilizer. Use DAP (Diammonium Phosphate) for better soil availability.",
      action: "Monitor and supplement if needed",
    });
  }

  // Potassium recommendations
  if (potassium < 100) {
    recommendations.push({
      type: "warning",
      nutrient: "Potassium (K)",
      issue: "Low potassium levels",
      advice:
        "Apply potassium chloride or potassium sulphate. Recommended: 40-60 kg/ha. K improves disease resistance and spice quality.",
      action: "Apply potash fertilizer",
    });
  } else if (potassium > 150) {
    recommendations.push({
      type: "info",
      nutrient: "Potassium (K)",
      issue: "High potassium",
      advice: "Potassium levels are high. Continue with maintenance applications only.",
      action: "Reduce K applications temporarily",
    });
  }

  // Boron recommendations
  if (boron < 1.5) {
    recommendations.push({
      type: "warning",
      nutrient: "Boron (B)",
      issue: "Low boron levels",
      advice:
        "Apply borax or boric acid. Recommended: 1-2 kg/ha. Boron is crucial for flower and fruit development in cardamom.",
      action: "Spray boron solution on foliage",
    });
  } else if (boron > 3.0) {
    recommendations.push({
      type: "warning",
      nutrient: "Boron (B)",
      issue: "Excess boron",
      advice:
        "Reduce boron applications immediately. Excess boron can be toxic. Flush soil with water if possible.",
      action: "Stop boron applications",
    });
  }

  // pH recommendations
  if (ph < 6.0) {
    recommendations.push({
      type: "warning",
      nutrient: "Soil pH",
      issue: "Soil is too acidic",
      advice:
        "Apply lime (calcium carbonate) to increase pH. Cardamom prefers slightly acidic to neutral soil (6.0-7.0). Apply 2-5 tonnes/ha based on severity.",
      action: "Lime application required",
    });
  } else if (ph > 7.5) {
    recommendations.push({
      type: "warning",
      nutrient: "Soil pH",
      issue: "Soil is too alkaline",
      advice:
        "Apply sulfur or organic matter to lower pH. Incorporate 1-2 tonnes/ha of compost or green manure.",
      action: "Reduce pH through organic amendments",
    });
  }

  // If no issues
  if (recommendations.length === 0) {
    recommendations.push({
      type: "success",
      nutrient: "All Parameters Optimal",
      issue: "Excellent growing conditions",
      advice:
        "Your soil conditions are ideal for cardamom cultivation. Continue with regular maintenance fertilizer schedule.",
      action: "Maintain current practices",
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-agri-green" />
        <h2 className="text-2xl font-bold text-gray-900">Fertilizer & Soil Advice</h2>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 ${
              rec.type === "success"
                ? "bg-green-50 border-green-400"
                : rec.type === "warning"
                ? "bg-red-50 border-red-400"
                : "bg-blue-50 border-blue-400"
            }`}
          >
            <div className="flex gap-3">
              {rec.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{rec.nutrient}</h3>
                <p className="text-sm text-gray-700 mt-1">{rec.advice}</p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-white rounded text-xs font-medium text-gray-700">
                    ✓ {rec.action}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-agri-gray rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Expert Tips for Cardamom</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Apply fertilizers in 2-3 split doses during monsoon season for best results</li>
          <li>• Always combine chemical fertilizers with organic manure (5-10 tonnes/ha annually)</li>
          <li>• Mulch the soil with dry leaves to retain moisture and regulate temperature</li>
          <li>• Avoid fertilizer application during dry season; concentrate during monsoon</li>
          <li>• Monitor for pest and disease issues simultaneously with nutrient management</li>
        </ul>
      </div>
    </div>
  );
}

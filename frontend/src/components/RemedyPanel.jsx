import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { generateRemedy } from '../services/geminiService';

export default function RemedyPanel({ sensorData }) {
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRemedy = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateRemedy({
        nitrogen: sensorData.nitrogen || 45,
        ph: sensorData.ph || 6.8,
        boron: sensorData.boron || 2.1
      });

      if (result.success) {
        setRemedy(result.remedy);
      } else {
        setError(result.remedy);
      }
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lab-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="lab-subheading">AI Recommendations</h3>
          <p className="lab-body mt-1">Powered by Google Gemini</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Sparkles className="text-orange-600" size={20} />
        </div>
      </div>

      <p className="lab-body mb-6">
        Get AI-powered recommendations based on your current sensor readings
      </p>

      {!remedy && !loading && (
        <button
          onClick={handleGenerateRemedy}
          className="lab-button w-full flex items-center justify-center gap-3"
        >
          <Sparkles size={18} />
          Generate Recommendations
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8 bg-gray-50 rounded-lg">
          <Loader className="animate-spin text-orange-600" size={20} />
          <p className="text-gray-600 font-medium">Generating AI recommendations...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 mb-3">{error}</p>
          <button
            onClick={handleGenerateRemedy}
            className="lab-button-outline border-red-300 text-red-700 hover:border-red-500"
          >
            Try again
          </button>
        </div>
      )}

      {remedy && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="whitespace-pre-wrap lab-body text-sm mb-4">
            {remedy}
          </div>
          <button
            onClick={handleGenerateRemedy}
            className="lab-button-outline"
          >
            Regenerate Recommendations
          </button>
        </div>
      )}
    </div>
  );
}

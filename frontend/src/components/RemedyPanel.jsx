import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, RefreshCw } from 'lucide-react';
import { generateRemedyHybrid } from '../services/geminiServiceAccount';

export default function RemedyPanel({ sensorData }) {
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleGenerateRemedy();
  }, [sensorData]);

  const handleGenerateRemedy = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRemedyHybrid({
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
    <div className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div>
          <p className="section-label mb-1">AI Recommendations</p>
          <p className="text-xs text-gray-400">Powered by Google Gemini</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Sparkles className="text-emerald-600" size={16} />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-5">
        AI-powered recommendations automatically generated from your current sensor readings
      </p>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8 bg-gray-50 rounded-xl">
          <Loader className="animate-spin text-emerald-600" size={18} />
          <p className="text-sm text-gray-500 font-mono">Analyzing your soil data...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 mb-4">
          <p className="text-sm text-red-700 mb-3">{error}</p>
          {error.includes('configure your Google Gemini API key') && (
            <p className="text-[11px] text-red-500 mb-3">
              Go to Settings → API Configuration and add your Gemini API key
            </p>
          )}
          <button onClick={handleGenerateRemedy}
            className="px-4 py-1.5 text-xs font-semibold text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
            Try again
          </button>
        </div>
      )}

      {remedy && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Current Recommendations</p>
            <button onClick={handleGenerateRemedy} disabled={loading}
              className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">
            {remedy}
          </div>
        </div>
      )}
    </div>
  );
}

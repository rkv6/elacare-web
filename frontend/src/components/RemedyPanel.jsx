import React, { useState } from 'react';
import { Sparkles, Loader, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { generateRemedyHybrid } from '../services/geminiServiceAccount';

export default function RemedyPanel({ sensorData }) {
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleGenerateRemedy = async () => {
    const hasData = sensorData.nitrogen > 0 || sensorData.ph > 0 || sensorData.boron > 0;
    if (!hasData) {
      setError('Waiting for sensor data from ESP32...');
      return;
    }
    setLoading(true);
    setError(null);
    setExpanded(false);
    try {
      const result = await generateRemedyHybrid({
        nitrogen: sensorData.nitrogen,
        ph: sensorData.ph,
        boron: sensorData.boron
      });
      if (result.success) {
        setRemedy(result.remedy);
      } else {
        setError(result.remedy);
      }
    } catch (err) {
      const errorMsg = err.message || err.toString();
      if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('exceeded')) {
        setError('📊 Daily Recommendation Limit Reached - Come back tomorrow or enable billing in Google Cloud Console to unlock unlimited requests');
      } else if (errorMsg.includes('API') || errorMsg.includes('model')) {
        setError('⚠️ AI service temporarily unavailable. Check your connection and try again.');
      } else {
        setError('❌ Failed to generate recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasData = sensorData.nitrogen > 0 || sensorData.ph > 0 || sensorData.boron > 0;

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
        Click below to generate AI-powered recommendations from your sensor readings
      </p>

      {!remedy && !loading && !error && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
          <p className="text-sm text-emerald-900 mb-4">
            {hasData ? 'Ready to generate recommendations' : 'Waiting for sensor data from ESP32...'}
          </p>
          <button
            onClick={handleGenerateRemedy}
            disabled={!hasData || loading}
            className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
          >
            <Sparkles size={16} />
            Generate Remedy
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8 bg-gray-50 rounded-xl">
          <Loader className="animate-spin text-emerald-600" size={18} />
          <p className="text-sm text-gray-500 font-mono">Analyzing your soil data...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-5 mb-4">
          <p className="text-sm text-red-700 font-semibold mb-3">{error}</p>
          {error.includes('Limit Reached') && (
            <a
              href="https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-red-600 hover:text-red-700 font-medium underline block mb-2"
            >
              Enable billing in Google Cloud Console →
            </a>
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
              <Sparkles className={`w-3.5 h-3.5`} />
              Regenerate
            </button>
          </div>
          
          {/* Display recommendation with collapsible feature */}
          <div className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed mb-3">
            {expanded ? remedy : remedy.substring(0, 300) + (remedy.length > 300 ? '...' : '')}
          </div>

          {/* See More/See Less Button */}
          {remedy.length > 300 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} />
                  See Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  See More
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

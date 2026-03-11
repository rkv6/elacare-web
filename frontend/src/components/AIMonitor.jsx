import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Clock, Zap, Sparkles } from 'lucide-react';
import { generateRemedyFromBackend } from '../services/backendAIService';

export default function AIMonitor({ sensorData }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const analyzeData = async () => {
    const hasData = sensorData.nitrogen > 0 || sensorData.ph > 0 || sensorData.boron > 0;
    if (!hasData) {
      setError('No sensor data available. Waiting for ESP32 readings...');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateRemedyFromBackend({
        nitrogen: sensorData.nitrogen,
        ph: sensorData.ph,
        boron: sensorData.boron
      });
      if (result.success) {
        const parsed = parseAIResponse(result.remedy);
        setAnalysis(parsed);
        setLastUpdate(new Date());
      } else {
        setError(result.remedy || 'Analysis failed');
      }
    } catch (err) {
      const errorMsg = err.message || err.toString();
      if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('exceeded')) {
        setError('📊 Daily Analysis Limit Reached - Come back tomorrow or enable billing to unlock unlimited requests');
      } else if (errorMsg.includes('API') || errorMsg.includes('model')) {
        setError('⚠️ AI service temporarily unavailable. Check your internet connection and try again.');
      } else {
        setError('❌ Analysis failed. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (response) => {
    const lines = response.split('\n').filter(line => line.trim());
    let status = 'good';
    let keyActions = [];
    if (sensorData.ph < 6.0 || sensorData.ph > 7.5) status = 'warning';
    if (sensorData.nitrogen < 40 || sensorData.nitrogen > 80) status = 'warning';
    if (sensorData.boron < 1.5 || sensorData.boron > 3.0) status = 'critical';
    lines.forEach(line => {
      if (line.includes('⚡') || line.includes('IMMEDIATE') || line.includes('ACTION')) {
        keyActions.push(line.replace(/[⚡🌱📋📈⚠️]/g, '').trim());
      }
    });
    if (keyActions.length === 0) keyActions = ['Monitor current conditions', 'Maintain optimal growing environment'];
    return {
      status,
      priority: status === 'critical' ? 'high' : status === 'warning' ? 'medium' : 'low',
      keyActions: keyActions.slice(0, 3),
      fullAnalysis: response
    };
  };

  const statusMap = {
    critical: { color: '#ef4444', bg: '#fef2f2', border: 'border-red-100', label: 'Critical' },
    warning:  { color: '#f59e0b', bg: '#fffbeb', border: 'border-amber-100', label: 'Warning' },
    good:     { color: '#10b981', bg: '#ecfdf5', border: 'border-emerald-100', label: 'Good' }
  };

  const s = statusMap[analysis?.status] || statusMap.good;

  const priorityMap = {
    high:   { color: '#ef4444', bg: '#fef2f2' },
    medium: { color: '#f59e0b', bg: '#fffbeb' },
    low:    { color: '#10b981', bg: '#ecfdf5' }
  };

  const hasData = sensorData.nitrogen > 0 || sensorData.ph > 0 || sensorData.boron > 0;

  // Show button to generate analysis if no analysis yet
  if (!analysis && !loading && !error) {
    return (
      <div className="bento-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Brain className="text-emerald-600" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">AI Farm Monitor</h3>
            <p className="text-xs text-gray-400">Real-time intelligent analysis</p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
          <p className="text-sm text-emerald-900 mb-4">
            {hasData ? 
              'Ready to analyze your soil data' : 
              'Waiting for sensor data from ESP32...'}
          </p>
          <button
            onClick={analyzeData}
            disabled={!hasData}
            className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
          >
            <Sparkles size={16} />
            Generate Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Brain className="text-emerald-600" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">AI Farm Monitor</h3>
            <p className="text-xs text-gray-400">Real-time intelligent analysis</p>
          </div>
        </div>
        {lastUpdate && (
          <span className="text-[11px] font-mono text-gray-400">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
          <span className="text-sm text-gray-500 font-mono">Analyzing farm data...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-5">
          <p className="text-sm text-red-700 font-semibold mb-3">{error}</p>
          {error.includes('Limit Reached') && (
            <button
              onClick={analyzeData}
              className="text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Try again anyway, or wait until tomorrow
            </button>
          )}
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          {/* Status */}
          <div className={`rounded-xl p-4 border ${s.border}`} style={{ background: s.bg }}>
            <div className="flex items-center gap-2.5">
              {analysis.status === 'critical' ? <AlertTriangle size={16} style={{ color: s.color }} /> :
               analysis.status === 'warning' ? <Clock size={16} style={{ color: s.color }} /> :
               <CheckCircle size={16} style={{ color: s.color }} />}
              <span className="text-sm font-semibold" style={{ color: s.color }}>{s.label} Status</span>
              {(() => {
                const p = priorityMap[analysis.priority] || priorityMap.low;
                return (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                        style={{ background: p.bg, color: p.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    {analysis.priority.toUpperCase()} PRIORITY
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-emerald-600" />
              <p className="section-label">Recommended Actions</p>
            </div>
            <div className="space-y-2">
              {analysis.keyActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {action}
                </div>
              ))}
            </div>
          </div>

          {/* Data Source */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-mono text-gray-400">
                {lastUpdate ? `Updated ${new Date(lastUpdate).toLocaleTimeString()}` : 'Analysis generated'}
              </span>
            </div>
            <button
              onClick={analyzeData}
              className="px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Sparkles size={12} />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
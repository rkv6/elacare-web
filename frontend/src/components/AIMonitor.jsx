import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { generateRemedyHybrid } from '../services/geminiServiceAccount';

export default function AIMonitor({ sensorData }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    analyzeData();
    const interval = setInterval(analyzeData, 30000);
    return () => clearInterval(interval);
  }, [sensorData]);

  const analyzeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRemedyHybrid({
        nitrogen: sensorData.nitrogen || 45,
        ph: sensorData.ph || 6.8,
        boron: sensorData.boron || 2.1
      });
      if (result.success) {
        const parsed = parseAIResponse(result.remedy);
        setAnalysis(parsed);
        setLastUpdate(new Date());
      } else {
        setError(result.remedy);
      }
    } catch (err) {
      setError('AI monitoring temporarily unavailable');
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
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm text-red-700">{error}</p>
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

          {/* Auto-refresh */}
          <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400">Auto-refreshing every 30 seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}
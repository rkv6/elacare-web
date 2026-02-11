import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function BoronGauge({ value = 2.1, unit = 'mg/kg' }) {
  // Boron optimal: 1.5-3.0 mg/kg
  // Toxicity danger: > 3.0 mg/kg
  const maxValue = 5;
  const percentage = (value / maxValue) * 100;

  const getStatus = (val) => {
    if (val < 0.5) return { status: 'Deficient', color: 'text-orange-600', iconColor: 'bg-orange-100', isDanger: true };
    if (val < 1.5) return { status: 'Low', color: 'text-orange-600', iconColor: 'bg-orange-100', isDanger: false };
    if (val <= 3.0) return { status: 'Optimal', color: 'text-green-600', iconColor: 'bg-green-100', isDanger: false };
    if (val <= 4.0) return { status: 'High (Toxicity Risk)', color: 'text-red-600', iconColor: 'bg-red-100', isDanger: true };
    return { status: 'Toxic', color: 'text-red-700', iconColor: 'bg-red-100', isDanger: true };
  };

  const statusInfo = getStatus(value);

  return (
    <div className="lab-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="lab-subheading">Soil Boron (B)</h3>
          <p className="lab-body mt-1">Micronutrient essential</p>
        </div>
        <div className={`w-12 h-12 ${statusInfo.iconColor} rounded-lg flex items-center justify-center`}>
          {statusInfo.isDanger && (
            <AlertTriangle className={statusInfo.color} size={20} />
          )}
          {!statusInfo.isDanger && (
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-black text-black mb-2">
          {value.toFixed(2)}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{unit}</p>
          <p className={`text-sm font-semibold ${statusInfo.color}`}>
            {statusInfo.status}
          </p>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mb-6">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
          <div 
            className={`h-full transition-all ${
              value <= 1.5 ? 'bg-orange-400' :
              value <= 3.0 ? 'bg-green-400' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Deficient (0)</span>
          <span>Optimal (1.5-3.0)</span>
          <span>Toxic (5+)</span>
        </div>
      </div>

      {/* Danger Zone Indicator */}
      {value >= 3.0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-700">
            ⚠️ TOXICITY DANGER ZONE - Boron levels too high
          </p>
        </div>
      )}

      {/* Status and Recommendation */}
      <div className="pt-4 border-t border-gray-100">
        <p className="lab-body text-sm mb-2">
          <span className="font-semibold text-black">Optimal Range:</span> 1.5-3.0 {unit}
        </p>
        <p className="lab-body text-sm">
          {value < 1.5 ? 'Apply boron-containing fertilizer to prevent deficiency symptoms' :
           value <= 3.0 ? 'Boron levels are optimal for plant growth' :
           'Reduce irrigation or avoid boron fertilizer - toxicity risk'}
        </p>
      </div>
    </div>
  );
}

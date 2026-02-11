import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function pHGauge({ value = 6.8 }) {
  // pH range: 0-14, optimal for most crops: 6.0-7.5
  const percentage = (value / 14) * 100;

  const getStatus = (val) => {
    if (val < 5.5) return { status: 'Too Acidic', color: 'text-red-600', iconColor: 'bg-red-100', isDanger: true };
    if (val < 6.0) return { status: 'Acidic', color: 'text-orange-600', iconColor: 'bg-orange-100', isDanger: false };
    if (val < 7.5) return { status: 'Optimal', color: 'text-green-600', iconColor: 'bg-green-100', isDanger: false };
    if (val <= 8.0) return { status: 'Alkaline', color: 'text-orange-600', iconColor: 'bg-orange-100', isDanger: false };
    return { status: 'Too Alkaline', color: 'text-red-600', iconColor: 'bg-red-100', isDanger: true };
  };

  const statusInfo = getStatus(value);

  return (
    <div className="lab-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="lab-subheading">Soil pH</h3>
          <p className="lab-body mt-1">Acidity/alkalinity balance</p>
        </div>
        <div className={`w-12 h-12 ${statusInfo.iconColor} rounded-lg flex items-center justify-center`}>
          {statusInfo.isDanger && (
            <AlertCircle className={statusInfo.color} size={20} />
          )}
          {!statusInfo.isDanger && (
            <div className="w-6 h-6 bg-purple-500 rounded"></div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-black text-black mb-2">
          {value.toFixed(1)}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">pH Scale</p>
          <p className={`text-sm font-semibold ${statusInfo.color}`}>
            {statusInfo.status}
          </p>
        </div>
      </div>

      {/* Visual Gauge */}
      <div className="mb-6">
        <div className="h-4 bg-linear-to-r from-red-500 via-green-500 to-blue-500 rounded-full overflow-hidden relative">
          <div 
            className="h-full w-1 bg-black opacity-80 transition-all absolute"
            style={{ left: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Acidic (0)</span>
          <span>Neutral (7)</span>
          <span>Alkaline (14)</span>
        </div>
      </div>

      {/* Status and Recommendation */}
      <div className="pt-4 border-t border-gray-100">
        <p className="lab-body text-sm mb-2">
          <span className="font-semibold text-black">Optimal Range:</span> 6.0-7.5
        </p>
        <p className="lab-body text-sm">
          {value < 6.0 ? 'Add lime to increase pH and reduce acidity' :
           value > 7.5 ? 'Add sulfur to decrease pH and reduce alkalinity' :
           'pH is optimal for nutrient availability'}
        </p>
      </div>
    </div>
  );
}

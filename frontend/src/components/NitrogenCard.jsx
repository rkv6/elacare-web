import React from 'react';

export default function NitrogenCard({ value = 45.5, unit = 'mg/kg' }) {
  const getStatus = (val) => {
    if (val < 20) return { status: 'Deficient', color: 'text-red-600', iconColor: 'bg-red-100' };
    if (val < 40) return { status: 'Low', color: 'text-orange-600', iconColor: 'bg-orange-100' };
    if (val < 80) return { status: 'Optimal', color: 'text-green-600', iconColor: 'bg-green-100' };
    return { status: 'Excess', color: 'text-red-600', iconColor: 'bg-red-100' };
  };

  const statusInfo = getStatus(value);

  return (
    <div className="lab-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="lab-subheading">Nitrogen (N)</h3>
          <p className="lab-body mt-1">Essential for plant growth</p>
        </div>
        <div className={`w-12 h-12 ${statusInfo.iconColor} rounded-lg flex items-center justify-center`}>
          <div className="w-6 h-6 accent-block rounded"></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-black text-black mb-2">
          {value.toFixed(1)}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{unit}</p>
          <p className={`text-sm font-semibold ${statusInfo.color}`}>
            {statusInfo.status}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="lab-body text-sm mb-2">
          <span className="font-semibold text-black">Optimal Range:</span> 40-80 mg/kg
        </p>
        <p className="lab-body text-sm">
          {value < 40 ? 'Apply nitrogen fertilizer to boost plant growth' : 
           value > 80 ? 'Reduce nitrogen to prevent over-growth' : 
           'Nitrogen levels are optimal for growth'}
        </p>
      </div>
    </div>
  );
}

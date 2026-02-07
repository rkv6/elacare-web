import React from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function SensorCard({ label, value, unit, optimal, icon }) {
  const isOptimal = value >= optimal[0] && value <= optimal[1];
  const isLow = value < optimal[0];

  const getStatusColor = () => {
    if (isOptimal) return "text-green-600 bg-green-50";
    if (isLow) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusText = () => {
    if (isOptimal) return "Optimal";
    if (isLow) return "Low";
    return "High";
  };

  const getStatusIcon = () => {
    if (isOptimal) return "✓";
    if (isLow) return "↓";
    return "↑";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-gray-500 text-sm">{unit}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={`px-3 py-1 rounded-full font-medium ${getStatusColor()}`}
        >
          {getStatusText()} {getStatusIcon()}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Optimal: {optimal[0]} - {optimal[1]}
      </p>
    </div>
  );
}

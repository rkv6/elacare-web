import React from 'react';

export default function TemperatureCard({ value = 28, unit = '°C' }) {
  const getStatus = (val) => {
    if (val < 15) return { label: 'TOO COLD', color: '#3b82f6', bg: '#eff6ff', hint: 'Growth slowed' };
    if (val < 20) return { label: 'COOL', color: '#06b6d4', bg: '#ecfeff', hint: 'Growth slowed' };
    if (val < 30) return { label: 'OPTIMAL', color: '#10b981', bg: '#ecfdf5', hint: 'Growth optimal' };
    if (val < 35) return { label: 'WARM', color: '#f59e0b', bg: '#fffbeb', hint: 'Heat stress risk' };
    return { label: 'TOO HOT', color: '#ef4444', bg: '#fef2f2', hint: 'Heat stress risk' };
  };
  const s = getStatus(value);

  return (
    <div className="w-full h-full">
      <div className="bento-card h-full flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="section-label">Temperature</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                  style={{ background: s.bg, color: s.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          </div>
          <p className="text-xs text-gray-400">Soil temperature monitoring</p>
        </div>
        <div className="py-6 sm:py-8">
          <div className="flex items-baseline gap-2">
            <span className="data-value text-4xl sm:text-5xl">{value}</span>
            <span className="text-xs font-mono text-gray-400 uppercase">{unit}</span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">{s.hint}</span>
            <span className="text-[10px] font-mono text-gray-300">ENV</span>
          </div>
        </div>
      </div>
    </div>
  );
}
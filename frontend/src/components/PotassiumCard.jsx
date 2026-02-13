import React from 'react';

export default function PotassiumCard({ value = 125.8, unit = 'mg/kg' }) {
  const getStatus = (val) => {
    if (val < 80) return { label: 'DEFICIENT', color: '#ef4444', bg: '#fef2f2', hint: 'Potassium critically low' };
    if (val < 120) return { label: 'LOW', color: '#f59e0b', bg: '#fffbeb', hint: 'Enhance disease resistance' };
    if (val < 200) return { label: 'OPTIMAL', color: '#10b981', bg: '#ecfdf5', hint: 'Strong disease resistance' };
    return { label: 'EXCESS', color: '#ef4444', bg: '#fef2f2', hint: 'Reduce potassium input' };
  };
  const s = getStatus(value);

  return (
    <div className="w-full h-full">
      <div className="bento-card h-full flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="section-label">Potassium</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
                  style={{ background: s.bg, color: s.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          </div>
          <p className="text-xs text-gray-400">Disease resistance & quality</p>
        </div>
        <div className="py-6 sm:py-8">
          <div className="flex items-baseline gap-2">
            <span className="data-value text-4xl sm:text-5xl">{value.toFixed(1)}</span>
            <span className="text-xs font-mono text-gray-400 uppercase">{unit}</span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">{s.hint}</span>
            <span className="text-[10px] font-mono text-gray-300">K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
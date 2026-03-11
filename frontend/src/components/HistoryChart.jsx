import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function HistoryChart({ data = [] }) {
  const [chartType, setChartType] = useState('line');
  
  // Generate current week data if none provided
  const generateDefaultData = () => {
    const today = new Date();
    const defaultData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Generate realistic sensor variations
      const baseN = 50 + (Math.random() - 0.5) * 8;
      const basePh = 6.8 + (Math.random() - 0.5) * 0.4;
      const baseB = 2.2 + (Math.random() - 0.5) * 0.6;
      const baseP = 18.5 + (Math.random() - 0.5) * 2;
      const baseK = 127 + (Math.random() - 0.5) * 8;
      
      defaultData.push({
        day: dayName,
        date: date.toISOString().split('T')[0],
        nitrogen: Math.round(baseN * 10) / 10,
        ph: Math.round(basePh * 10) / 10,
        boron: Math.round(baseB * 10) / 10,
        phosphorus: Math.round(baseP * 10) / 10,
        potassium: Math.round(baseK * 10) / 10
      });
    }
    
    return defaultData;
  };

  const chartData = data && data.length > 0 ? data : generateDefaultData();

  // Custom Tooltip to show correct values - extract from each payload entry
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      // Create object from all payload entries
      const values = {};
      payload.forEach(entry => {
        values[entry.dataKey] = entry.value;
      });
      
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg min-w-max">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 pb-2 border-b border-gray-200">{label}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium"><span className="text-gray-700">N:</span> <span className="font-bold text-emerald-600">{(values.nitrogen !== undefined ? values.nitrogen : 0).toFixed(2)}</span></p>
            <p className="text-sm font-medium"><span className="text-gray-700">P:</span> <span className="font-bold text-blue-600">{(values.phosphorus !== undefined ? values.phosphorus : 0).toFixed(2)}</span></p>
            <p className="text-sm font-medium"><span className="text-gray-700">K:</span> <span className="font-bold text-purple-600">{(values.potassium !== undefined ? values.potassium : 0).toFixed(2)}</span></p>
            <p className="text-sm font-medium"><span className="text-gray-700">pH:</span> <span className="font-bold text-amber-600">{(values.ph !== undefined ? values.ph : 0).toFixed(2)}</span></p>
            <p className="text-sm font-medium"><span className="text-gray-700">B:</span> <span className="font-bold text-orange-600">{(values.boron !== undefined ? values.boron : 0).toFixed(2)}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div>
          <p className="section-label mb-1">7-Day Sensor History</p>
          <p className="text-xs text-gray-400">Precision farming trend data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === 'line' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp size={13} />
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === 'bar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={13} />
              Bar
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'line' ? (
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
              domain={[0, 14]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontWeight: '500' }}
              iconType="line"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="nitrogen" 
              stroke="#10b981" 
              strokeWidth={3}
              name="N (mg/kg)"
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="phosphorus" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="P (mg/kg)"
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="potassium" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="K (mg/kg)"
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ph" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="pH"
              dot={{ fill: '#f59e0b', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="boron" 
              stroke="#ff4500" 
              strokeWidth={3}
              name="B (mg/kg)"
              dot={{ fill: '#ff4500', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        ) : (
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
              domain={[0, 14]}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              isAnimationActive={false}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontWeight: '500' }}
            />
            <Bar yAxisId="left" dataKey="nitrogen" fill="#10b981" name="N (mg/kg)" />
            <Bar yAxisId="left" dataKey="phosphorus" fill="#3b82f6" name="P (mg/kg)" />
            <Bar yAxisId="left" dataKey="potassium" fill="#8b5cf6" name="K (mg/kg)" />
            <Bar yAxisId="right" dataKey="ph" fill="#f59e0b" name="pH" />
            <Bar yAxisId="right" dataKey="boron" fill="#ff4500" name="B (mg/kg)" />
          </BarChart>
        )}
      </ResponsiveContainer>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Insight:</span> Historical trend data enables optimal nutrient management. Regular monitoring prevents deficiencies and maximizes crop yield.
        </p>
      </div>
    </div>
  );
}

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
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => value.toFixed(2)}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontWeight: '500' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="nitrogen" 
              stroke="#10b981" 
              strokeWidth={3}
              name="N (mg/kg)"
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="phosphorus" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="P (mg/kg)"
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="potassium" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="K (mg/kg)"
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="pH"
              dot={{ fill: '#f59e0b', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
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
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: '500' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => value.toFixed(2)}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontWeight: '500' }}
            />
            <Bar dataKey="nitrogen" fill="#10b981" name="N (mg/kg)" />
            <Bar dataKey="phosphorus" fill="#3b82f6" name="P (mg/kg)" />
            <Bar dataKey="potassium" fill="#8b5cf6" name="K (mg/kg)" />
            <Bar dataKey="ph" fill="#f59e0b" name="pH" />
            <Bar dataKey="boron" fill="#ff4500" name="B (mg/kg)" />
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

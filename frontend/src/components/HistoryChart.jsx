import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HistoryChart({ data = [] }) {
  // Sample data if none provided
  const defaultData = [
    { day: 'Day 1', nitrogen: 42, ph: 6.8, boron: 2.1 },
    { day: 'Day 2', nitrogen: 45, ph: 6.9, boron: 2.2 },
    { day: 'Day 3', nitrogen: 48, ph: 6.7, boron: 2.0 },
    { day: 'Day 4', nitrogen: 50, ph: 6.8, boron: 2.3 },
    { day: 'Day 5', nitrogen: 52, ph: 6.9, boron: 2.4 },
    { day: 'Day 6', nitrogen: 55, ph: 7.0, boron: 2.5 },
    { day: 'Day 7', nitrogen: 58, ph: 6.9, boron: 2.4 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="lab-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="lab-subheading">7-Day Sensor History</h3>
          <p className="lab-body mt-1">Precision farming trend data</p>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
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
            dataKey="ph" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            name="pH"
            dot={{ fill: '#8b5cf6', r: 5 }}
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
      </ResponsiveContainer>

      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="lab-body text-sm">
          <span className="font-semibold text-black">Precision Farming Insight:</span> This historical trend data demonstrates 
          optimal sensor monitoring and precise nutrient management. Regular monitoring helps prevent deficiencies 
          and toxicities while maximizing crop yield.
        </p>
      </div>
    </div>
  );
}

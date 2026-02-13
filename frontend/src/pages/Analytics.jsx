import React, { useState, useEffect } from 'react';
import HistoryChart from '../components/HistoryChart';
import DatePicker from '../components/DatePicker';
import BoronCard from '../components/BoronCard';
import TemperatureCard from '../components/TemperatureCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import { Calendar, TrendingUp, Cpu } from 'lucide-react';

export default function Analytics() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState(null);

  const historicalData = {
    '2026-02-11': { nitrogen: 48.3, phosphorus: 18.9, potassium: 127.5, ph: 6.85, boron: 2.15, temperature: 22.5, moisture: 65 },
    '2026-02-10': { nitrogen: 47.1, phosphorus: 18.5, potassium: 125.2, ph: 6.82, boron: 2.18, temperature: 21.8, moisture: 63 },
    '2026-02-09': { nitrogen: 46.8, phosphorus: 17.9, potassium: 128.1, ph: 6.79, boron: 2.12, temperature: 23.1, moisture: 68 },
    '2026-02-08': { nitrogen: 45.5, phosphorus: 19.1, potassium: 131.3, ph: 6.88, boron: 2.09, temperature: 22.3, moisture: 66 },
    '2026-02-07': { nitrogen: 44.2, phosphorus: 18.2, potassium: 123.8, ph: 6.91, boron: 2.16, temperature: 21.9, moisture: 64 },
  };

  useEffect(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    setFilteredData(historicalData[dateKey] || null);
  }, [selectedDate]);

  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const MiniCard = ({ label, value, unit, ok }) => (
    <div className="bento-card flex flex-col justify-between">
      <p className="section-label mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5 my-3">
        <span className="data-value text-3xl sm:text-4xl">{value}</span>
        <span className="text-[10px] font-mono text-gray-400 uppercase">{unit}</span>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <span className={`text-[11px] font-medium ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>
          {ok ? 'Optimal range' : 'Needs attention'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <p className="section-label mb-2">Historical Data</p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Analytics & <span className="text-emerald-600">History</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Analyze cardamom farm data to optimize cultivation</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Select Date</p>
                  <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} className="w-60" />
                </div>
              </div>

              {/* Date banner */}
              <div className="bento-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-label">Viewing Data For</p>
                    <p className="text-base font-semibold text-emerald-700 mt-1 font-mono">{formatDate(selectedDate)}</p>
                  </div>
                  {filteredData ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> DATA AVAILABLE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-gray-50 text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> NO DATA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Data Cards */}
            {filteredData ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                <MiniCard label="Nitrogen" value={filteredData.nitrogen} unit="mg/kg" ok={filteredData.nitrogen >= 40 && filteredData.nitrogen <= 80} />
                <MiniCard label="Soil pH" value={filteredData.ph} unit="pH" ok={filteredData.ph >= 6.0 && filteredData.ph <= 7.5} />
                <MiniCard label="Phosphorus" value={filteredData.phosphorus} unit="mg/kg" ok={filteredData.phosphorus >= 15 && filteredData.phosphorus <= 25} />
                <MiniCard label="Potassium" value={filteredData.potassium} unit="mg/kg" ok={filteredData.potassium >= 120 && filteredData.potassium <= 200} />
                <BoronCard value={filteredData.boron} />
              </div>
            ) : (
              <div className="bento-card mb-10 text-center py-14">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-gray-300" size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">No Data Available</p>
                <p className="text-xs text-gray-400">No readings for {formatDate(selectedDate)}</p>
              </div>
            )}

            {/* Chart + Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
              <div className="lg:col-span-2"><HistoryChart /></div>
              <div className="flex flex-col gap-5">
                {filteredData && (
                  <div className="grid grid-cols-2 gap-4">
                    <TemperatureCard value={filteredData.temperature} />
                    <SoilMoistureCard value={filteredData.moisture} />
                  </div>
                )}

                <div className="bento-card flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-emerald-600" />
                    <p className="section-label">Cultivation Insights</p>
                  </div>
                  <ul className="space-y-2.5">
                    {['Soil nutrient levels tracking well for cardamom growth cycles',
                      'pH balance optimal for root development and nutrient absorption',
                      'Micronutrient levels within safe ranges — no toxicity concerns'].map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bento-card flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu size={16} className="text-emerald-600" />
                    <p className="section-label">System Status</p>
                  </div>
                  <ul className="space-y-2.5">
                    {['Sensor network operating optimally with consistent data collection',
                      'Automated monitoring ensures 24/7 cardamom farm surveillance',
                      'Data accuracy meets precision agriculture standards'].map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HistoryChart from '../components/HistoryChart';
import DatePicker from '../components/DatePicker';
import { Calendar } from 'lucide-react';

export default function Analytics() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState(null);

  // Mock historical data - replace with actual API call
  const historicalData = {
    '2026-02-11': { nitrogen: 48.3, ph: 6.85, boron: 2.15, temperature: 22.5, moisture: 65 },
    '2026-02-10': { nitrogen: 47.1, ph: 6.82, boron: 2.18, temperature: 21.8, moisture: 63 },
    '2026-02-09': { nitrogen: 46.8, ph: 6.79, boron: 2.12, temperature: 23.1, moisture: 68 },
    '2026-02-08': { nitrogen: 45.5, ph: 6.88, boron: 2.09, temperature: 22.3, moisture: 66 },
    '2026-02-07': { nitrogen: 44.2, ph: 6.91, boron: 2.16, temperature: 21.9, moisture: 64 },
  };

  // Update filtered data when date changes
  useEffect(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const dayData = historicalData[dateKey];
    setFilteredData(dayData || null);
  }, [selectedDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
        <Navbar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="lab-heading text-4xl mb-4">
                    Analytics &
                    <br /><span className="text-orange-500">History</span>.
                  </h1>
                  <p className="lab-body text-lg">
                    Analyze cardamom farm data to optimize cultivation practices
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Select Date to View History</p>
                  <DatePicker 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate}
                    className="w-64"
                  />
                </div>
              </div>
              
              {/* Selected Date Display */}
              <div className="lab-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="lab-subheading">Viewing Data For</h3>
                    <p className="lab-body text-lg font-semibold text-orange-600 mt-1">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                  {filteredData ? (
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-semibold">✓ Data Available</p>
                      <p className="text-xs text-gray-500">Showing sensor readings for this date</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">No Data</p>
                      <p className="text-xs text-gray-400">No readings found for this date</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Data Cards */}
            {filteredData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lab-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="lab-subheading">Nitrogen Level</h3>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-green-500 rounded"></div>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-black mb-2">{filteredData.nitrogen} mg/kg</p>
                  <p className="lab-body text-sm">
                    {filteredData.nitrogen >= 40 && filteredData.nitrogen <= 80 ? 'Optimal range' : 'Needs attention'}
                  </p>
                </div>

                <div className="lab-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="lab-subheading">Soil pH</h3>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-purple-500 rounded"></div>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-black mb-2">{filteredData.ph}</p>
                  <p className="lab-body text-sm">
                    {filteredData.ph >= 6.0 && filteredData.ph <= 7.5 ? 'Perfect balance' : 'Adjustment needed'}
                  </p>
                </div>

                <div className="lab-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="lab-subheading">Boron Content</h3>
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-yellow-500 rounded"></div>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-black mb-2">{filteredData.boron} mg/kg</p>
                  <p className="lab-body text-sm">
                    {filteredData.boron >= 1.5 && filteredData.boron <= 3.0 ? 'Safe levels' : 'Monitor closely'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="lab-card mb-12 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="text-gray-400" size={24} />
                </div>
                <h3 className="lab-subheading mb-2">No Data Available</h3>
                <p className="lab-body">No sensor readings found for {formatDate(selectedDate)}</p>
                <p className="text-sm text-gray-500 mt-2">Try selecting a different date or check if sensors were active</p>
              </div>
            )}

            {/* Historical Chart & Environmental Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <HistoryChart />
              
              {filteredData && (
                <div className="lab-card">
                  <h3 className="lab-subheading mb-6">Environmental Conditions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="lab-body font-semibold">Temperature</span>
                      <span className="text-lg font-black text-orange-600">{filteredData.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="lab-body font-semibold">Soil Moisture</span>
                      <span className="text-lg font-black text-blue-600">{filteredData.moisture}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="lab-body text-sm">
                      <span className="font-semibold text-black">Daily Summary:</span> 
                      Environmental conditions on this date were 
                      {filteredData.temperature > 25 ? ' warm' : filteredData.temperature < 18 ? ' cool' : ' moderate'} 
                      with {filteredData.moisture > 70 ? 'high' : filteredData.moisture < 50 ? 'low' : 'adequate'} soil moisture levels.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Insights & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lab-card">
                <h3 className="lab-subheading mb-6">Cardamom Cultivation Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      Soil nutrient levels are tracking well for cardamom growth cycles
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      pH balance remains optimal for elachi root development and nutrient absorption
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      Micronutrient levels are within safe ranges with no toxicity concerns
                    </p>
                  </div>
                </div>
              </div>

              <div className="lab-card">
                <h3 className="lab-subheading mb-6">Hardware System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      Sensor network is operating optimally with consistent data collection
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      Automated monitoring ensures 24/7 cardamom farm surveillance
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                    <p className="lab-body text-sm">
                      Data accuracy meets precision agriculture standards for elachi cultivation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

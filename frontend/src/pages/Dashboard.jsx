import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import NitrogenCard from '../components/NitrogenCard';
import pHGauge from '../components/pHGauge';
import BoronGauge from '../components/BoronGauge';
import HistoryChart from '../components/HistoryChart';
import RemedyPanel from '../components/RemedyPanel';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  // Mock sensor data - replace with real API calls
  const [sensorData, setSensorData] = useState({
    nitrogen: 52.5,
    ph: 6.8,
    boron: 2.2,
    temperature: 28,
    moisture: 65,
    lastUpdate: new Date().toLocaleString()
  });

  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Replace with actual API call to backend
      // const response = await fetch('/api/sensors/current');
      // const data = await response.json();
      // setSensorData(data);

      // For now, simulate API call
      setTimeout(() => {
        setSensorData(prev => ({
          ...prev,
          lastUpdate: new Date().toLocaleString()
        }));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing sensor data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
        <Navbar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Hero Section with Image Placeholder */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-16 h-2 accent-block mb-6"></div>
                  <h1 className="lab-heading mb-6">
                    Cardamom
                    <br />Farming
                    <br /><span className="text-orange-500">System</span>.
                  </h1>
                  <p className="lab-body text-lg mb-8">
                    Hardware-integrated soil monitoring with AI-powered insights
                    for precision elachi cultivation and optimal yield.
                  </p>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className={`lab-button flex items-center gap-3 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh Data
                  </button>
                </div>
                <div className="image-placeholder h-96">
                  Hero Image
                  <br />
                  (Coming Soon)
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="lab-card mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-black text-lg">System Status</p>
                  <p className="text-gray-600">Last updated: {sensorData.lastUpdate}</p>
                </div>
              </div>
            </div>

            {/* Sensor Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <NitrogenCard value={sensorData.nitrogen} />
              <pHGauge value={sensorData.ph} />
              <BoronGauge value={sensorData.boron} />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="lab-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="lab-subheading">Temperature</h3>
                    <p className="lab-body mt-1">Soil temperature monitoring</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 accent-block rounded"></div>
                  </div>
                </div>
                <div className="text-4xl font-black text-black mb-2">
                  {sensorData.temperature}°C
                </div>
                <p className="lab-body">Optimal for growth rate estimation</p>
              </div>

              <div className="lab-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="lab-subheading">Soil Moisture</h3>
                    <p className="lab-body mt-1">Irrigation scheduling data</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="text-4xl font-black text-black mb-2">
                  {sensorData.moisture}%
                </div>
                <p className="lab-body">Perfect for optimal irrigation</p>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <HistoryChart data={sensorData.history} />
              <RemedyPanel sensorData={sensorData} />
            </div>

            {/* Image Gallery Placeholder */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="lab-subheading mb-4">Visual Documentation</h2>
                <p className="lab-body">Field imagery and sensor deployment photos</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="image-placeholder aspect-square">
                  Field Image 1
                  <br />
                  (Coming Soon)
                </div>
                <div className="image-placeholder aspect-square">
                  Field Image 2
                  <br />
                  (Coming Soon)
                </div>
                <div className="image-placeholder aspect-square">
                  Field Image 3
                  <br />
                  (Coming Soon)
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-lg font-light text-white mb-4">Temperature</h3>
                <div className="flex items-end gap-4">
                  <div className="text-3xl font-light text-orange-400">
                    {sensorData.temperature}°C
                  </div>
                  <div className="text-sm text-neutral-400 pb-2">
                    Soil temperature for growth rate estimation
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-lg font-light text-white mb-4">Soil Moisture</h3>
                <div className="flex items-end gap-4">
                  <div className="text-3xl font-light text-blue-400">
                    {sensorData.moisture}%
                  </div>
                  <div className="text-sm text-neutral-400 pb-2">
                    Optimal irrigation scheduling
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

import React, { useState, useEffect, useContext } from 'react';
import NitrogenCard from '../components/NitrogenCard';
import PhosphorusCard from '../components/PhosphorusCard';
import PotassiumCard from '../components/PotassiumCard';
import BoronCard from '../components/BoronCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import HistoryChart from '../components/HistoryChart';
import RemedyPanel from '../components/RemedyPanel';
import AIMonitor from '../components/AIMonitor';
import { AuthContext } from '../context/AuthContext';
import { db, doc, onSnapshot, collection, query, orderBy, limit, getDocs } from '../services/firebase';
import { RefreshCw, Activity, Droplets, Thermometer, Leaf } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const farmId = user?.uid || 'JX7O6poLC5QPZ5zY0fMCVZqUC003';

  const [sensorData, setSensorData] = useState({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    ph: 0,
    boron: 0,
    temperature: 0,
    moisture: 0,
    lastUpdate: '—',
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Real-time listener for current sensor data
  useEffect(() => {
    const sensorRef = doc(db, 'farms', farmId, 'sensors', 'current');

    const unsubscribe = onSnapshot(sensorRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setSensorData(prev => ({
          ...prev,
          nitrogen: d.nitrogen ?? 0,
          phosphorus: d.phosphorus ?? 0,
          potassium: d.potassium ?? 0,
          ph: d.ph ?? 0,
          boron: d.boron ?? 0,
          temperature: d.temperature ?? 0,
          moisture: d.humidity ?? 0,
          lastUpdate: d.lastUpdate || new Date().toLocaleString()
        }));
        setConnected(true);
      }
    }, (error) => {
      console.error('Firestore listener error:', error);
      setConnected(false);
    });

    return () => unsubscribe();
  }, [farmId]);

  // Fetch sensor history
  const fetchHistory = async () => {
    try {
      const historyRef = collection(db, 'farms', farmId, 'sensorHistory');
      const q = query(historyRef, orderBy('timestamp', 'desc'), limit(7));
      const snapshot = await getDocs(q);

      const history = snapshot.docs.map(doc => {
        const d = doc.data();
        const date = d.timestamp?.toDate?.() || new Date(d.lastUpdate || Date.now());
        return {
          day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: date.toISOString().split('T')[0],
          nitrogen: d.nitrogen ?? 0,
          ph: d.ph ?? 0,
          boron: d.boron ?? 0,
          phosphorus: d.phosphorus ?? 0,
          potassium: d.potassium ?? 0
        };
      }).reverse();

      setSensorData(prev => ({ ...prev, history }));
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [farmId]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchHistory();
    setLoading(false);
  };

  const getPhStatus = (v) => {
    if (v >= 5.5 && v <= 6.5) return { label: 'OPTIMAL', cls: 'status-pill--optimal' };
    if (v >= 5.0 && v <= 7.0) return { label: 'ACCEPTABLE', cls: 'status-pill--warning' };
    return { label: 'OUT OF RANGE', cls: 'status-pill--danger' };
  };

  const phStatus = getPhStatus(sensorData.ph);

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-2">IOT Dashboard</p>
            <h1 className="lab-heading">
              Cardamom Farming<br />
              <span className="text-emerald-600">System</span>.
            </h1>
            <p className="lab-body mt-3 max-w-lg text-sm sm:text-base">
              Hardware-integrated soil monitoring with AI-powered insights
              for precision elachi cultivation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {connected ? 'LIVE' : 'OFFLINE'}
            </div>
            <button onClick={handleRefresh} disabled={loading}
              className={`lab-button flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">

          {/* Large card: pH Gauge */}
          <div className="bento-card sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label">SOIL PH</p>
                <p className="text-xs text-gray-400 mt-0.5">Target: 5.5 – 6.5</p>
              </div>
              <span className={`status-pill ${phStatus.cls}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {phStatus.label}
              </span>
            </div>
            <div className="flex items-center justify-center py-6 sm:py-10">
              <div className="relative">
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-[6px] sm:border-8 flex items-center justify-center"
                     style={{ borderColor: sensorData.ph >= 5.5 && sensorData.ph <= 6.5 ? '#10b981' : sensorData.ph >= 5.0 && sensorData.ph <= 7.0 ? '#f59e0b' : '#ef4444' }}>
                  <div className="text-center">
                    <span className="data-value text-4xl sm:text-5xl">{sensorData.ph.toFixed(1)}</span>
                    <p className="text-xs text-gray-400 font-mono mt-1">pH Level</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Min</p>
                <p className="data-value text-sm">5.5</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Current</p>
                <p className="data-value text-sm text-emerald-600">{sensorData.ph.toFixed(1)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase">Max</p>
                <p className="data-value text-sm">6.5</p>
              </div>
            </div>
          </div>

          {/* Medium: Environment stats */}
          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Temperature</p>
              <Thermometer size={14} className="text-orange-500" />
            </div>
            <div>
              <span className="data-value text-3xl">{sensorData.temperature}°</span>
              <span className="text-xs text-gray-400 font-mono ml-1">C</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Optimal: 15–35 °C</p>
          </div>

          <div className="bento-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Moisture</p>
              <Droplets size={14} className="text-blue-500" />
            </div>
            <div>
              <span className="data-value text-3xl">{sensorData.moisture}</span>
              <span className="text-xs text-gray-400 font-mono ml-1">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Optimal: 50–80 %</p>
          </div>

          {/* System Status */}
          <div className="bento-card sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Activity size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{connected ? 'System Online' : 'Waiting for Data'}</p>
                <p className="text-xs text-gray-400 font-mono">Last sync: {sensorData.lastUpdate}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                <span className={`text-xs font-mono ${connected ? 'text-emerald-600' : 'text-gray-400'}`}>{connected ? 'CONNECTED' : 'WAITING'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── NPK + Boron + Moisture Cards ── */}
        <div className="mb-8">
          <p className="section-label mb-4">Soil Nutrient Levels</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            <div className="h-72 sm:h-80 flex"><NitrogenCard value={sensorData.nitrogen} /></div>
            <div className="h-72 sm:h-80 flex"><PhosphorusCard value={sensorData.phosphorus} /></div>
            <div className="h-72 sm:h-80 flex"><PotassiumCard value={sensorData.potassium} /></div>
            <div className="h-72 sm:h-80 flex"><BoronCard value={sensorData.boron} /></div>
            <div className="h-72 sm:h-80 flex"><SoilMoistureCard value={sensorData.moisture} /></div>
          </div>
        </div>

        {/* ── AI Monitor ── */}
        <div className="mb-8">
          <p className="section-label mb-4">AI Analysis</p>
          <AIMonitor sensorData={sensorData} />
        </div>

        {/* ── Charts + Remedy ── */}
        <div className="mb-8">
          <p className="section-label mb-4">Analytics & Recommendations</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <HistoryChart data={sensorData.history} />
            <RemedyPanel sensorData={sensorData} />
          </div>
        </div>

        {/* ── Credits Footer ── */}
        <footer className="bento-card mt-12 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={16} className="text-emerald-600" />
                <span className="font-bold text-sm">ElaCare</span>
                <span className="text-xs text-gray-400 font-mono">v1.0</span>
              </div>
              <p className="text-xs text-gray-400">Smart Agriculture System for Cardamom Cultivation</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-400 uppercase mb-1">Developed by</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Jiss Mohan K · Rithin K Varghese  · Neo Biju<br />
               Jomet Sajan · Kevin Subash
              </p>
              <p className="text-[10px] font-mono text-gray-300 mt-1">SJCET Palai</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

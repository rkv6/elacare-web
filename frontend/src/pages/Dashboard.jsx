import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { LogOut, Leaf, AlertCircle, TrendingUp } from "lucide-react";
import SensorCard from "../components/SensorCard";
import FertilizerAdvice from "../components/FertilizerAdvice";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Real-time listener for sensor data from ESP32
      const sensorRef = doc(db, "farms", user.uid, "sensors", "current");
      
      const unsubscribe = onSnapshot(sensorRef, (doc) => {
        if (doc.exists()) {
          setSensorData(doc.data());
        } else {
          // Use mock data for demo
          setSensorData({
            nitrogen: 45,
            phosphorus: 35,
            potassium: 120,
            ph: 6.8,
            boron: 2.1,
            lastUpdate: new Date().toISOString(),
          });
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening to sensor data:", err);
      setError("Failed to load sensor data");
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-agri-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agri-gray">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agri-green mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of your cardamom farm</p>
          {sensorData?.lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(sensorData.lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Sensor Cards Grid */}
        {sensorData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <SensorCard
                label="Nitrogen (N)"
                value={sensorData.nitrogen}
                unit="mg/kg"
                optimal={[40, 60]}
                icon="🌱"
              />
              <SensorCard
                label="Phosphorus (P)"
                value={sensorData.phosphorus}
                unit="mg/kg"
                optimal={[20, 40]}
                icon="💛"
              />
              <SensorCard
                label="Potassium (K)"
                value={sensorData.potassium}
                unit="mg/kg"
                optimal={[100, 150]}
                icon="🔵"
              />
              <SensorCard
                label="pH Level"
                value={sensorData.ph}
                unit="pH"
                optimal={[6.0, 7.5]}
                icon="⚗️"
              />
              <SensorCard
                label="Boron (B)"
                value={sensorData.boron}
                unit="mg/kg"
                optimal={[1.5, 3.0]}
                icon="💚"
              />
            </div>

            {/* Fertilizer Advice Section */}
            <FertilizerAdvice
              nitrogen={sensorData.nitrogen}
              phosphorus={sensorData.phosphorus}
              potassium={sensorData.potassium}
              boron={sensorData.boron}
              ph={sensorData.ph}
            />

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/leaf-scanner")}
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex items-center gap-4 hover:bg-agri-gray"
              >
                <Leaf className="w-8 h-8 text-agri-green" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Leaf Health Check</h3>
                  <p className="text-sm text-gray-600">Scan a leaf for disease detection</p>
                </div>
              </button>
              <button
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex items-center gap-4 hover:bg-agri-gray"
              >
                <TrendingUp className="w-8 h-8 text-agri-green" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Historical trends and patterns</p>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

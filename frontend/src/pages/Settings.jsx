import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Save, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    fieldSize: '50',
    irrigationMode: 'automatic',
    soilType: 'loam',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    geminiKey: ''
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save settings to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
        <Navbar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600 mb-8">
              Manage your cardamom farm settings and preferences
            </p>

            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="text-green-600" size={20} />
                <p className="text-green-800 font-semibold">Settings saved successfully!</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Farm Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Cardamom Farm Settings</h2>
                
                <div className="space-y-4">
                  {/* Fixed Crop Type Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Type
                    </label>
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      Cardamom (Elachi) - Hardware Integrated System
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This system is specifically designed for cardamom cultivation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Size (hectares)
                    </label>
                    <input
                      type="number"
                      value={settings.fieldSize}
                      onChange={(e) => handleChange('fieldSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soil Type
                    </label>
                    <select
                      value={settings.soilType}
                      onChange={(e) => handleChange('soilType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="loam">Loam</option>
                      <option value="clay">Clay</option>
                      <option value="sandy">Sandy</option>
                      <option value="silty">Silty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Irrigation Mode
                    </label>
                    <select
                      value={settings.irrigationMode}
                      onChange={(e) => handleChange('irrigationMode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleChange('notifications', e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Enable in-app notifications</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Send email alerts for critical events</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsAlerts}
                      onChange={(e) => handleChange('smsAlerts', e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Send SMS alerts for critical events</span>
                  </label>
                </div>
              </div>

              {/* API Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">API Configuration</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your API key for AI recommendations"
                    value={settings.geminiKey}
                    onChange={(e) => handleChange('geminiKey', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Get your API key from Google Cloud Console
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={20} />
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

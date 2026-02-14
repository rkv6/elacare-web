import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, SlidersHorizontal, Bell, Key } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    fieldSize: '50',
    irrigationMode: 'automatic',
    soilType: 'loam',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    geminiKey: 'AIzaSyCpunmMV2yNImLE6ZpgS1jECC-4l5M637I'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('elacare-settings');
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    } else {
      localStorage.setItem('elacare-settings', JSON.stringify(settings));
    }
  }, []);

  const handleChange = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    try {
      localStorage.setItem('elacare-settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 text-sm transition-colors";

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10">
              <p className="section-label mb-2">Configuration</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Settings</h1>
              <p className="text-sm text-gray-500">Manage your cardamom farm preferences</p>
            </div>

            {saved && (
              <div className="bento-card mb-6 border-emerald-200! bg-emerald-50/50!">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="text-emerald-600" size={18} />
                  <p className="text-sm font-semibold text-emerald-800">Settings saved successfully</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Farm Settings */}
              <div className="bento-card">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal size={16} className="text-emerald-600" />
                  <p className="section-label">Farm Settings</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Crop Type</label>
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-medium font-mono">
                      Cardamom (Elachi) — Hardware Integrated
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Field Size (acres)</label>
                    <input type="number" value={settings.fieldSize} onChange={(e) => handleChange('fieldSize', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Soil Type</label>
                    <select value={settings.soilType} onChange={(e) => handleChange('soilType', e.target.value)} className={inputClass}>
                      <option value="loam">Loam</option>
                      <option value="clay">Clay</option>
                      <option value="sandy">Sandy</option>
                      <option value="silty">Silty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Irrigation Mode</label>
                    <select value={settings.irrigationMode} onChange={(e) => handleChange('irrigationMode', e.target.value)} className={inputClass}>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bento-card">
                <div className="flex items-center gap-2 mb-6">
                  <Bell size={16} className="text-emerald-600" />
                  <p className="section-label">Notifications</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'notifications', text: 'Enable in-app notifications' },
                    { key: 'emailAlerts', text: 'Send email alerts for critical events' },
                    { key: 'smsAlerts', text: 'Send SMS alerts for critical events' }
                  ].map(({ key, text }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={settings[key]}
                        onChange={(e) => handleChange(key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* API Config */}
              <div className="bento-card">
                <div className="flex items-center gap-2 mb-6">
                  <Key size={16} className="text-emerald-600" />
                  <p className="section-label">API Configuration</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Google Gemini API Key</label>
                  <input type="password" placeholder="Enter your API key" value={settings.geminiKey}
                    onChange={(e) => handleChange('geminiKey', e.target.value)} className={inputClass} />
                  <p className="text-[11px] text-gray-400 mt-1.5 font-mono">Get your key from Google Cloud Console</p>
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                <Save size={16} /> Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

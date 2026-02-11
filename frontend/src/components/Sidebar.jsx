import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  BarChart3, 
  Settings, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leaf-sensor', icon: Leaf, label: 'Leaf Sensor' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 accent-block"></div>
          <h1 className="text-2xl font-black text-black">
            ela<span className="text-orange-500">Care</span>.
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-medium">Cardamom Farming System</p>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-black font-medium'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Image Placeholder - User will add later */}
      <div className="mx-4 mb-6">
        <div className="image-placeholder h-32 text-sm">
          Image Space
          <br />
          (Coming Soon)
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={logout}
          className="w-full lab-button-outline text-red-600 border-red-200 hover:border-red-500 hover:text-red-700"
        >
          <LogOut size={18} className="inline mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

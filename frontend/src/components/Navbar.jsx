import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h2 className="text-xl font-black text-black">
            Cardamom Farming <span className="text-orange-500">System</span>.
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={18} className="text-gray-600 hover:text-black" />
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="w-10 h-10 accent-block rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-black">
                  {user.email?.split('@')[0]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

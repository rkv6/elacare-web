import React from "react";
import { LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 bg-agri-green rounded-lg flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <h1 className="text-xl font-bold text-agri-green">Elacare</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-agri-green transition"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Welcome, </span>
              {user?.email?.split("@")[0]}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from './ui/sidebar';

export function AppSidebar() {
  const location = useLocation();
  const { logout, user, profilePhoto } = useAuth();
  const { isOpen, isCollapsed, isMobile, toggleCollapsed, closeMobile } = useSidebar();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leaf-sensor', icon: Leaf, label: 'Leaf Sensor' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path) => location.pathname === path;

  if (!isOpen) return null;

  // Mobile: overlay sidebar with backdrop
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={closeMobile} />
        <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-gray-100 flex flex-col z-50 shadow-2xl animate-slide-in">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Leaf size={14} className="text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  ela<span className="text-emerald-600">Care</span>
                </h1>
              </div>
              <button onClick={closeMobile} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-widest">Cardamom Farm IoT</p>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={closeMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}>
                  <Icon size={17} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-700 font-bold text-sm font-mono">{(user.displayName || user.email)?.charAt(0).toUpperCase()}</span>
                </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || user.email?.split('@')[0]}</p>
                  <p className="text-[11px] text-gray-400 truncate font-mono">{user.email}</p>
                </div>
                <button onClick={logout} className="p-2 hover:bg-red-50 rounded-xl transition-colors" title="Logout">
                  <LogOut size={15} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`${isCollapsed ? 'w-17' : 'w-60'} min-h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Leaf size={14} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none">
                    ela<span className="text-emerald-600">Care</span>
                  </h1>
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">Farm IoT</p>
                </div>
              </div>
              <button onClick={toggleCollapsed} className="p-1 hover:bg-gray-50 rounded-lg transition-colors" title="Collapse">
                <ChevronLeft size={14} className="text-gray-400" />
              </button>
            </>
          ) : (
            <button onClick={toggleCollapsed} className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center mx-auto hover:bg-emerald-700 transition-colors" title="Expand sidebar">
              <Leaf size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}>
              <Icon size={17} className="shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>



      <div className="border-t border-gray-100">
        {user && (
          <div className="p-3">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" />
                ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-700 font-bold text-xs font-mono">{(user.displayName || user.email)?.charAt(0).toUpperCase()}</span>
                </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName || user.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-gray-400 truncate font-mono">{user.email}</p>
                </div>
                <button onClick={logout} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                  <LogOut size={14} className="text-red-500" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-7 h-7 rounded-xl object-cover" />
                ) : (
                <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-[10px] font-mono">{(user.displayName || user.email)?.charAt(0).toUpperCase()}</span>
                </div>
                )}
                <button onClick={logout} className="p-1 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                  <LogOut size={12} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
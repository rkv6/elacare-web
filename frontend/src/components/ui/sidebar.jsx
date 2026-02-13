import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SidebarContext = createContext(null);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

export function SidebarProvider({ children, defaultOpen = true }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(isMobile ? false : defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      setIsCollapsed(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggle = useCallback(() => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    } else if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isMobile, isCollapsed]);
  
  const toggleCollapsed = () => {
    if (isOpen && !isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobile = useCallback(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile]);

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        isCollapsed,
        isMobile,
        toggle, 
        toggleCollapsed,
        closeMobile,
        setIsOpen,
        setIsCollapsed
      }}
    >
      <div className="flex h-screen transition-all duration-300 ease-in-out">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({ className = "" }) {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('SidebarTrigger must be used within SidebarProvider');
  }
  
  const { toggle, isOpen, isMobile } = context;

  return (
    <button
      onClick={toggle}
      className={`p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-200 ease-in-out"
      >
        {isMobile && isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
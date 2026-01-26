import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-[64px] bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden mr-4">
        <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <NavLink 
          to="/admission" 
          className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          Admissions
        </NavLink>
        <NavLink 
          to="/commercial" 
          className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          Commercial
        </NavLink>
        <NavLink 
          to="/rh" 
          className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          RH
        </NavLink>
        <NavLink 
          to="/etudiant" 
          className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Étudiant
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Search size={20} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-600 text-sm font-medium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          FR
        </div>
        <div className="w-10 h-10 rounded-full bg-[#818CF8] flex items-center justify-center text-white font-bold text-sm cursor-pointer">
          AP
        </div>
      </div>
    </header>
  );
};

export default Header;
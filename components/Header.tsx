import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { AppModule } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  activeModule: AppModule;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeModule }) => {
  return (
    <header className="header">
      <div className="flex items-center gap-4 md:hidden mr-4">
        <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      <div className="header-tabs hidden md:flex">
        <button className={`header-tab ${activeModule === AppModule.ADMISSION ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          Admissions
        </button>
        <button className={`header-tab ${activeModule === AppModule.COMMERCIAL ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          Commercial
        </button>
        <button className={`header-tab ${activeModule === AppModule.RH ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          RH
        </button>
        <button className={`header-tab ${activeModule === AppModule.STUDENT ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Étudiant
        </button>
      </div>

      <div className="header-actions">
        <button className="header-icon-btn">
          <Search size={20} />
        </button>
        <button className="header-icon-btn">
          <Bell size={20} />
        </button>
        <div className="header-lang">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          FR
        </div>
        <div className="header-user">AP</div>
      </div>
    </header>
  );
};

export default Header;
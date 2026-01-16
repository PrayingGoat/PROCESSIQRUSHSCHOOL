import React from 'react';
import { Bell, Search, Command, CalendarRange, ChevronDown } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title, subtitle }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 transition-all">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button className="md:hidden mr-2 text-slate-500 hover:text-slate-700 transition-colors" onClick={toggleSidebar}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block group">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
            placeholder="Rechercher un étudiant, une entreprise, un dossier..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-slate-400 text-xs border border-slate-300 rounded px-1.5 py-0.5 flex items-center gap-1">
              <Command size={10} /> K
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        
        {/* School Year Selector */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
          <CalendarRange size={16} />
          <span>2025 - 2026</span>
          <ChevronDown size={14} className="opacity-50" />
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

        <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-700">Arsène P.</div>
            <div className="text-xs text-slate-400 font-medium">Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 ring-2 ring-white">
            AP
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
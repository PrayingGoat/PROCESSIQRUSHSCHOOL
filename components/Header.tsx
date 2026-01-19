import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { AppModule } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  activeModule: AppModule;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeModule }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Breadcrumb / Title */}
        <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-800">
            {activeModule}
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
            Tableau de bord de gestion
            </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-800">Arsène P.</div>
            <div className="text-xs text-slate-500 font-medium">Administrateur</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white cursor-pointer hover:shadow-lg transition-shadow">
            AP
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { AppModule } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  activeModule: AppModule;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeModule }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm/50">
      
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors">
          <Menu size={24} />
        </button>
        
        {/* Module Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeModule === AppModule.ADMISSION ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            <span className={`w-2 h-2 rounded-full ${activeModule === AppModule.ADMISSION ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
            Admissions
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeModule === AppModule.COMMERCIAL ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className={`w-2 h-2 rounded-full ${activeModule === AppModule.COMMERCIAL ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            Commercial
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeModule === AppModule.RH ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className={`w-2 h-2 rounded-full ${activeModule === AppModule.RH ? 'bg-purple-500' : 'bg-slate-300'}`}></span>
            RH
          </div>
           <div className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeModule === AppModule.STUDENT ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className={`w-2 h-2 rounded-full ${activeModule === AppModule.STUDENT ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            Étudiant
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all w-64">
             <Search size={16} className="text-slate-400" />
             <input type="text" placeholder="Rechercher..." className="bg-transparent border-none text-sm focus:outline-none text-slate-700 placeholder:text-slate-400 w-full" />
        </div>

        <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-1">
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                <HelpCircle size={20} />
             </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">Arsène P.</p>
              <p className="text-xs text-slate-400 mt-1">Admin</p>
           </div>
           <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
             AP
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
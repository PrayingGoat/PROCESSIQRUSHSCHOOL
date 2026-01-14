import React from 'react';
import { AppModule } from '../types';
import { Bell, Globe, Layout, Users, GraduationCap, Briefcase } from 'lucide-react';

interface HeaderProps {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Mobile Toggle & Tabs */}
      <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
        <button className="md:hidden mr-2 text-slate-500" onClick={toggleSidebar}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveModule(AppModule.COMMERCIAL)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeModule === AppModule.COMMERCIAL ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <Layout size={16} />
            Commercial
          </button>
          <button 
            onClick={() => setActiveModule(AppModule.ADMISSION)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeModule === AppModule.ADMISSION ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <Briefcase size={16} />
            Admission
          </button>
          <button 
            onClick={() => setActiveModule(AppModule.RH)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeModule === AppModule.RH ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <Users size={16} />
            RH
          </button>
          <button 
            onClick={() => setActiveModule(AppModule.STUDENT)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeModule === AppModule.STUDENT ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <GraduationCap size={16} />
            Étudiant
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-100">
          <Globe size={16} />
          FR
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-md shadow-blue-500/20">
          AP
        </div>
      </div>
    </header>
  );
};

export default Header;
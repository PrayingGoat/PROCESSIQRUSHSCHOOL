import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { ViewId, AppModule } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, setActiveView }) => {
  const [commercialOpen, setCommercialOpen] = useState(true);
  const [rhOpen, setRhOpen] = useState(true);

  // Helper to check active state
  const isActive = (view: ViewId) => activeView === view;
  const isModuleActive = (modulePrefix: string) => activeView.startsWith(modulePrefix);

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] text-[#e2e8f0] flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative w-10 h-10">
          <span className="absolute w-3 h-3 rounded-full bg-[#EC4899] top-0 left-2"></span>
          <span className="absolute w-3 h-3 rounded-full bg-[#F97316] top-2 left-5"></span>
          <span className="absolute w-3 h-3 rounded-full bg-[#06B6D4] top-5 left-6"></span>
          <span className="absolute w-3 h-3 rounded-full bg-[#86EFAC] top-7 left-3"></span>
          <span className="absolute w-3 h-3 rounded-full bg-[#A78BFA] top-4 left-1"></span>
        </div>
        <span className="text-[1.35rem] font-bold text-white">Process<span className="text-[#3B82F6]">IQ</span></span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        
        {/* Admissions */}
        <div
          onClick={() => setActiveView('admission-main')}
          className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${
            isActive('admission-main')
              ? 'bg-[#6366F1] text-white' 
              : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
          }`}
        >
          <Briefcase size={22} className={isActive('admission-main') ? 'text-white' : 'text-[#94a3b8]'} />
          <span>Admissions</span>
        </div>

        {/* Commercial Group */}
        <div className="mb-1">
            <div
                onClick={() => setCommercialOpen(!commercialOpen)}
                className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${
                    isModuleActive('commercial') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
                }`}
            >
                <LayoutDashboard size={22} className={isModuleActive('commercial') ? 'text-white' : 'text-[#94a3b8]'} />
                <span>Commercial</span>
                <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${commercialOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Submenu */}
            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${commercialOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div onClick={() => setActiveView('commercial-dashboard')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('commercial-dashboard') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Tableau de bord</span>
                </div>
                <div onClick={() => setActiveView('commercial-placer')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('commercial-placer') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Élèves à placer</span>
                </div>
                <div onClick={() => setActiveView('commercial-alternance')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('commercial-alternance') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Élèves en alternance</span>
                </div>
            </div>
        </div>

        {/* RH Group */}
        <div className="mb-1">
            <div
                onClick={() => setRhOpen(!rhOpen)}
                className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${
                    isModuleActive('rh') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
                }`}
            >
                <Users size={22} className={isModuleActive('rh') ? 'text-white' : 'text-[#94a3b8]'} />
                <span>RH</span>
                <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${rhOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Submenu */}
            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${rhOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div onClick={() => setActiveView('rh-fiche')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('rh-fiche') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Fiche Entreprise</span>
                </div>
                <div onClick={() => setActiveView('rh-cerfa')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('rh-cerfa') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>CERFA</span>
                </div>
                <div onClick={() => setActiveView('rh-pec')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('rh-pec') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Prises en charge</span>
                </div>
                <div onClick={() => setActiveView('rh-ruptures')} className={`flex items-center gap-3 pl-[52px] pr-[18px] py-3 cursor-pointer text-[0.9rem] hover:bg-white/5 hover:text-white transition-colors ${isActive('rh-ruptures') ? 'text-[#3B82F6] bg-blue-500/10' : 'text-[#94a3b8]'}`}>
                    <span>Ruptures</span>
                </div>
            </div>
        </div>

        {/* Étudiant */}
        <div
          onClick={() => setActiveView('etudiant')}
          className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${
            isActive('etudiant') 
              ? 'bg-[#6366F1] text-white' 
              : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
          }`}
        >
          <BookOpen size={22} className={isActive('etudiant') ? 'text-white' : 'text-[#94a3b8]'} />
          <span>Étudiant</span>
        </div>

        {/* Paramètres */}
        <div
          onClick={() => setActiveView('parametres')}
          className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] mb-1 ${
            isActive('parametres') 
              ? 'bg-[#6366F1] text-white' 
              : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings size={22} className={isActive('parametres') ? 'text-white' : 'text-[#94a3b8]'} />
          <span>Paramètres</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-[14px] px-[18px] py-[14px] w-full rounded-xl text-[#e2e8f0] hover:bg-red-500/15 hover:text-[#FCA5A5] transition-colors">
          <LogOut size={22} className="text-[#94a3b8]" />
          <span className="font-medium text-[0.95rem]">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
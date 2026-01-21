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
import { ViewId } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, setActiveView }) => {
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [commercialOpen, setCommercialOpen] = useState(true);
  const [rhOpen, setRhOpen] = useState(true);

  // Helper to check active state
  const isActive = (view: ViewId) => activeView === view;
  const isModuleActive = (modulePrefix: string) => activeView.startsWith(modulePrefix);

  return (
    <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] text-[#e2e8f0] flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="logo-dots">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <span className="text-[1.35rem] font-bold text-white">Process<span className="text-[#3B82F6]">IQ</span></span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        
        {/* Admissions Group */}
        <div className="mb-1">
            <div
                onClick={() => setAdmissionOpen(!admissionOpen)}
                className={`flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] relative ${
                    isModuleActive('admission') ? 'bg-[#6366F1] text-white' : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
                }`}
            >
                <Briefcase size={22} className={isModuleActive('admission') ? 'text-white' : 'text-[#94a3b8]'} />
                <span>Admissions</span>
                <ChevronDown size={18} className={`ml-auto transition-transform duration-300 ${admissionOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${admissionOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                <div onClick={() => setActiveView('admission-main')} className={`nav-subitem ${activeView === 'admission-main' || !activeView.startsWith('admission-') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
                    </div>
                    <span>Tableau de bord</span>
                </div>
            </div>
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
            
            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${commercialOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div onClick={() => setActiveView('commercial-dashboard')} className={`nav-subitem ${isActive('commercial-dashboard') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>Tableau de bord</span>
                </div>
                <div onClick={() => setActiveView('commercial-placer')} className={`nav-subitem ${isActive('commercial-placer') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>Élèves à placer</span>
                </div>
                <div onClick={() => setActiveView('commercial-alternance')} className={`nav-subitem ${isActive('commercial-alternance') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
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
            
            <div className={`overflow-hidden transition-all duration-300 bg-black/15 rounded-b-xl mt-[-4px] ${rhOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                <div onClick={() => setActiveView('rh-dashboard')} className={`nav-subitem ${isActive('rh-dashboard') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>Vue d'ensemble</span>
                </div>
                <div onClick={() => setActiveView('rh-fiche')} className={`nav-subitem ${isActive('rh-fiche') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>Fiche Entreprise</span>
                </div>
                <div onClick={() => setActiveView('rh-cerfa')} className={`nav-subitem ${isActive('rh-cerfa') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>CERFA</span>
                </div>
                <div onClick={() => setActiveView('rh-pec')} className={`nav-subitem ${isActive('rh-pec') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
                    <span>Prises en charge</span>
                </div>
                <div onClick={() => setActiveView('rh-ruptures')} className={`nav-subitem ${isActive('rh-ruptures') ? 'active' : ''}`}>
                    <div className="w-[18px] h-[18px] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div></div>
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
      <div className="p-4 border-t border-slate-700/50">
        <button className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl cursor-pointer transition-all duration-200 font-medium text-[0.95rem] w-full hover:bg-red-500/10 hover:text-red-400 text-[#94a3b8]">
          <LogOut size={22} className="nav-icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;